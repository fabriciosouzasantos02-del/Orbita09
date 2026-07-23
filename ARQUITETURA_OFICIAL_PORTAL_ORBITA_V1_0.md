# Especificação Arquitetural Oficial do Ecossistema de Dados
## Arquitetura Oficial do Portal Órbita v1.0

Este documento estabelece a especificação técnica oficial e definitiva para a arquitetura de dados, fluxos de persistência, segurança e sincronização do **Portal Órbita**. Ele atua como a única fonte de verdade arquitetural do ecossistema e deve ser seguido rigorosamente para qualquer modificação ou adição de módulos futuros.

---

## 1. Justificativa Técnica & Decisões Arquiteturais

### 1.1 Por que Armazenamento Baseado Estritamente em UID?
Na arquitetura legada, ocorria uma mistura crítica entre o **e-mail** e o **UID (Unique Identifier)** do Firebase Authentication para identificar os documentos na coleção `/users`. Esta inconsistência causava:
- **Falha de Regras de Segurança (Zero-Trust):** As regras do Firestore comparam `request.auth.uid == userId`. Se o ID do documento é o e-mail, a regra falha, impedindo escritas legítimas de usuários logados.
- **Vulnerabilidade de LGPD/Privacidade:** Usar e-mails na URL e nas chaves de documentos expõe informações de identificação pessoal (PII) nos logs, além de violar princípios de privacidade por padrão (*privacy by design*).
- **Duplicação de Perfis:** Um mesmo usuário possuía o documento `/users/{uid}` para o módulo de Astrologia/Sonhos e `/users/{email}` para a Rede Social, fragmentando as estatísticas e as subcoleções.

**Decisão:** Centralização absoluta. O UID gerado pelo Firebase Authentication é a chave primária única de todo o ecossistema. Qualquer referência a usuários em coleções, subcoleções ou redes de relacionamentos deve utilizar o UID. O e-mail passa a ser um mero atributo de busca interna indexado e seguro.

### 1.2 Estratégia de Sincronização Local-Nuvem (Merge Engine Não-Destrutivo)
Para evitar que o carregamento do Firestore limpe dados mais recentes que foram criados offline no `localStorage`, definimos um **Merge Engine Baseado em Timestamps**. 
- Cada documento e registro local possui os campos `updatedAt` e `schemaVersion`.
- Durante a sincronização ou login, o sistema compara as datas de modificação local e remota campo a campo ou registro a registro, preservando o dado com o `updatedAt` mais recente.
- Caso o usuário faça ações como deslogado (Guest), os dados são acumulados no `localStorage`. Ao fazer login, esses dados são mesclados de forma incremental ao perfil em nuvem do UID associado.

---

## 2. Diagrama do Ecossistema de Dados

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PORTAL ÓRBITA CLIENT                          │
│                                                                         │
│   ┌─────────────────────┐       ┌─────────────────┐       ┌─────────┐   │
│   │    Local State      │ ◄───► │  Merge Engine   │ ◄───► │ Local   │   │
│   │    (React Hooks)    │       │  (Timestamps)   │       │ Storage │   │
│   └─────────────────────┘       └────────┬────────┘       └─────────┘   │
└──────────────────────────────────────────┼──────────────────────────────┘
                                           │
                                  HTTPS    ▼ (Auth State Triggered)
┌─────────────────────────────────────────────────────────────────────────┐
│                           FIREBASE BACKEND                              │
│                                                                         │
│    ┌────────────────────────┐         ┌────────────────────────────┐    │
│    │ Firebase Auth (UID)    ├────────►│ Cloud Firestore            │    │
│    │                        │         │                            │    │
│    │ - Email/Senha          │         │ /users/{uid} (Perfil)      │    │
│    │ - Google OAuth         │         │   ├── /natalCharts         │    │
│    │ - Facebook OAuth       │         │   ├── /dreams              │    │
│    └────────────────────────┘         │   ├── /following           │    │
│                                       │   ├── /followers           │    │
│                                       │   └── /notifications       │    │
│                                       └────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Arquitetura Detalhada do Firestore

A topologia do banco de dados está estruturada sob a coleção raiz `/users`, utilizando subcoleções específicas por domínio de dados do usuário para garantir isolamento físico e controle estrito de acessos.

```
/users/{userId} [Coleção Principal de Usuários]
  ├── /natalCharts/{chartId} [Histórico de Mapas Astrais]
  ├── /dreams/{dreamId} [Diário de Sonhos]
  ├── /transits/{transitId} [Transitando Estelares]
  ├── /tarotReadings/{readingId} [Leituras de Tarot]
  ├── /numerology/{numId} [Mapas Numerológicos]
  ├── /following/{followedUserId} [Quem este usuário segue (UID)]
  ├── /followers/{followerUserId} [Quem segue este usuário (UID)]
  ├── /friends/{friendUserId} [Amigos Mútuos (UID)]
  ├── /likesGiven/{likedUserId} [Curtidas enviadas (UID)]
  ├── /likesSnapshot/{likerUserId} [Curtidas recebidas (UID)]
  └── /notifications/{notifId} [Notificações em Tempo Real]
```

### 3.1 Definições de Atributos por Coleção

#### A. Documento de Usuário: `/users/{userId}`
*Chave do Documento:* `userId` (UID retornado pelo Firebase Authentication).
*Finalidade:* Cadastro de dados cadastrais, astrológicos básicos e preferências globais.

| Campo | Tipo | Obrigatoriedade | Descrição / Detalhe |
| :--- | :--- | :--- | :--- |
| `uid` | string | **Obrigatório** | UID do Firebase Auth. |
| `email` | string | **Obrigatório** | E-mail do usuário em minúsculas. |
| `name` | string | **Obrigatório** | Nome completo ou de exibição. |
| `birthDate` | string | **Obrigatório** | Formato YYYY-MM-DD. |
| `birthTime` | string | **Obrigatório** | Formato HH:MM. |
| `birthCity` | string | **Obrigatório** | Nome completo da cidade de nascimento. |
| `birthRegion` | string | Opcional | Região/Estado/País de nascimento. |
| `latitude` | number | **Obrigatório** | Latitude da cidade para cálculo do mapa. |
| `longitude` | number | **Obrigatório** | Longitude da cidade para cálculo do mapa. |
| `hasCreatedMap`| boolean| Opcional | Flag indicativa de mapa natal gerado. |
| `isPremium` | boolean | **Obrigatório** | Status de assinatura Premium. |
| `trialUsed` | boolean | Opcional | Se o período de teste grátis já foi ativado. |
| `preferredLanguage`| string| Opcional | Idioma escolhido (`pt`, `en`, `es`, `fr`, `de`). |
| `bio` | string | Opcional | Biografia pública na rede social. |
| `instagram` | string | Opcional | Identificador do Instagram para conexões. |
| `facebook` | string | Opcional | Identificador do Facebook para conexões. |
| `avatarId` | string | Opcional | ID do avatar ou foto de perfil. |
| `followersCount`| number | **Obrigatório** | Contador denormalizado de seguidores. |
| `followingCount`| number | **Obrigatório** | Contador denormalizado de seguindo. |
| `likesCount` | number | **Obrigatório** | Contador denormalizado de curtidas recebidas. |
| `friendsCount` | number | **Obrigatório** | Contador denormalizado de amigos mútuos. |
| `schemaVersion`| string | **Obrigatório** | Versão do esquema de dados (`1.0.0`). |
| `createdAt` | string | **Obrigatório** | Timestamp ISO-8601. |
| `updatedAt` | string | **Obrigatório** | Timestamp ISO-8601. |

---

#### B. Subcoleção de Mapas Astrais: `/users/{userId}/natalCharts/{chartId}`
*Chave do Documento:* UUID aleatório ou `main_chart` (para o mapa principal).
*Finalidade:* Registro de mapas astrais gerados pelo usuário ou de seus entes queridos.

| Campo | Tipo | Obrigatoriedade | Descrição |
| :--- | :--- | :--- | :--- |
| `chartId` | string | **Obrigatório** | Identificador único do mapa. |
| `name` | string | **Obrigatório** | Nome do dono do mapa natal. |
| `birthDate` | string | **Obrigatório** | Formato YYYY-MM-DD. |
| `birthTime` | string | **Obrigatório** | Formato HH:MM. |
| `birthCity` | string | **Obrigatório** | Cidade de nascimento. |
| `birthRegion` | string | Opcional | Estado ou país. |
| `mapData` | object | **Obrigatório** | Dados detalhados das posições planetárias, casas e aspectos. |
| `numerology` | object | Opcional | Dados de numerologia calculados associados. |
| `createdAt` | string | **Obrigatório** | Timestamp ISO-8501. |
| `updatedAt` | string | **Obrigatório** | Timestamp ISO-8501. |

---

#### C. Subcoleção de Sonhos: `/users/{userId}/dreams/{dreamId}`
*Chave do Documento:* UUID aleatório.
*Finalidade:* Diário de sonhos e interpretações baseadas no Oráculo de IA.

| Campo | Tipo | Obrigatoriedade | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | string | **Obrigatório** | ID único do sonho. |
| `text` | string | **Obrigatório** | Descrição em texto feita pelo usuário. |
| `interpretation`| string| Opcional | Resposta gerada pela IA do Portal Órbita. |
| `sentiment` | string | Opcional | Sentimento detectado (e.g., positivo, neutro, ansioso). |
| `date` | string | **Obrigatório** | Formato YYYY-MM-DD. |
| `time` | string | Opcional | Horário de registro. |
| `language` | string | Opcional | Idioma de cadastro do sonho. |
| `createdAt` | string | **Obrigatório** | Timestamp ISO-8501. |
| `updatedAt` | string | **Obrigatório** | Timestamp ISO-8501. |

---

#### D. Subcoleção de Relacionamentos e Redes Sociais
*Chaves de Documentos:* `targetUserId` (UID do usuário destino).
*Finalidade:* Registro de conexões bidirecionais (seguindo, seguidores, amigos e curtidas).

- **`/users/{userId}/following/{targetUserId}`**: Contém `{ followedAt: string }`.
- **`/users/{userId}/followers/{targetUserId}`**: Contém `{ followedAt: string }`.
- **`/users/{userId}/friends/{targetUserId}`**: Contém `{ addedAt: string }`.
- **`/users/{userId}/likesGiven/{targetUserId}`**: Contém `{ likedAt: string }`.
- **`/users/{userId}/likesSnapshot/{targetUserId}`**: Contém `{ likedAt: string }`.

---

#### E. Subcoleção de Notificações: `/users/{userId}/notifications/{notifId}`
*Chave do Documento:* UUID aleatório.
*Finalidade:* Armazenamento de avisos, interações sociais e novidades estelares.

| Campo | Tipo | Obrigatoriedade | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | string | **Obrigatório** | ID único da notificação. |
| `type` | string | **Obrigatório** | Tipo: `like`, `follow`, `friend`, `system`. |
| `senderId` | string | **Obrigatório** | UID do remetente da ação. |
| `senderName` | string | **Obrigatório** | Nome de exibição do remetente. |
| `message` | string | **Obrigatório** | Mensagem formatada. |
| `read` | boolean | **Obrigatório** | Status de leitura (default: `false`). |
| `createdAt` | string | **Obrigatório** | Timestamp ISO-8501. |

---

## 4. Política de Versionamento de Esquema & Migração de Dados

### 4.1 Versionamento (`schemaVersion: "1.0.0"`)
Cada registro escrito no Firestore e no `localStorage` deve possuir o atributo `schemaVersion: "1.0.0"`. Caso ocorram alterações futuras na modelagem do banco de dados, o versionamento permitirá a execução de conversores de dados sob demanda (*lazy-migrations*) no dispositivo cliente antes do envio de leituras/escritas.

### 4.2 Estratégia de Migração Incremental (E-mail -> UID)
Para resgatar usuários legados e uni-los sob o novo padrão baseado estritamente em UID:
1. No login ou inicialização, o sistema verifica se existe um perfil salvo sob a chave antiga `/users/{emailLower}`.
2. Se o documento antigo for encontrado e o usuário estiver autenticado com um UID válido, o sistema:
   - Lê os dados de `/users/{emailLower}`.
   - Escreve esses mesmos dados no novo endereço seguro `/users/{uid}`.
   - Varre as 15 subcoleções em lote (*Write Batch*) copiando os registros antigos para o novo caminho sob `/users/{uid}`.
   - Exclui o documento legado de `/users/{emailLower}` para limpar o banco de dados e garantir a integridade.
   - Atualiza o `localStorage` indicando que a migração foi concluída com sucesso.

---

## 5. Regras de Segurança do Cloud Firestore (`firestore.rules`)

As regras a seguir implementam segurança no nível de documento com isolamento completo e privilégios mínimos necessários (*least-privilege*).

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funções auxiliares
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    // Regras de Usuários e Perfis
    match /users/{userId} {
      // Qualquer usuário logado pode ler perfis para possibilitar buscas e redes de conexões
      allow read: if isSignedIn();
      // Apenas o próprio dono do perfil correspondente ao seu UID pode escrevê-lo
      allow write: if isOwner(userId);

      // Subcoleções Privadas (Apenas o próprio proprietário acessa)
      match /natalCharts/{chartId} {
        allow read, write: if isOwner(userId);
      }
      match /dreams/{dreamId} {
        allow read, write: if isOwner(userId);
      }
      match /transits/{transitId} {
        allow read, write: if isOwner(userId);
      }
      match /tarotReadings/{readingId} {
        allow read, write: if isOwner(userId);
      }
      match /tarotHistory/{historyId} {
        allow read, write: if isOwner(userId);
      }
      match /numerology/{numId} {
        allow read, write: if isOwner(userId);
      }
      match /prosperityMaps/{prosperityId} {
        allow read, write: if isOwner(userId);
      }
      match /biorhythm/{biorhythmId} {
        allow read, write: if isOwner(userId);
      }
      match /lunarNodes/{nodeId} {
        allow read, write: if isOwner(userId);
      }
      match /subscriptions/{subId} {
        allow read, write: if isOwner(userId);
      }
      match /cache/{cacheId} {
        allow read, write: if isOwner(userId);
      }

      // Subcoleções Sociais (Acesso controlado)
      match /following/{followedUserId} {
        allow read: if isSignedIn();
        allow write: if isOwner(userId);
      }
      match /followers/{followerUserId} {
        allow read: if isSignedIn();
        // Permite que outros usuários se registrem na lista de seguidores deste usuário
        allow write: if isSignedIn();
      }
      match /friends/{friendUserId} {
        allow read: if isSignedIn();
        allow write: if isSignedIn();
      }
      match /likesGiven/{likedUserId} {
        allow read: if isSignedIn();
        allow write: if isOwner(userId);
      }
      match /likesSnapshot/{likerUserId} {
        allow read: if isSignedIn();
        allow write: if isSignedIn();
      }
      match /notifications/{notifId} {
        // Apenas o proprietário lê as suas notificações
        allow read: if isOwner(userId);
        // Qualquer usuário logado pode disparar uma notificação social (seguir, curtir, etc.)
        allow write: if isSignedIn();
      }
    }

    // Coleção global de controle antifraude e testes de dispositivos
    match /device_trials/{deviceId} {
      allow read, write: if isSignedIn();
    }
  }
}
```

---

## 6. Fluxos Críticos de Autenticação e Sincronização

### 6.1 Cadastro e Criação de Contas
1. O usuário preenche dados básicos na tela inicial.
2. Clica em **"Salvar e Gerar Meu Mapa"**.
3. O sistema invoca `registerWithEmailFirebase` ou autenticação por redes sociais.
4. Ao retornar sucesso do Auth, o sistema obtém o `uid` e dispara o processo de criação de perfil inicial em `/users/{uid}`, enviando em seguida os dados calculados do mapa principal para a subcoleção `/users/{uid}/natalCharts/main_chart`.
5. O estado reativo global é sintonizado e a visualização principal do Dashboard é liberada.

### 6.2 Restauração de Sessão (Offline-First)
1. Durante a inicialização do app, um listener persistente do Firebase Auth detecta mudanças no estado de login (`subscribeToAuthChanges`).
2. Se um usuário logado é detectado, o sistema:
   - Carrega o perfil local salvo no `localStorage`.
   - Paralelamente, faz a requisição de `/users/{uid}` do Firestore (com cache de leituras habilitado).
   - Executa o **Merge Engine** para unificar modificações offline que possam ter ocorrido localmente.
   - Subscreve em tempo real para as atualizações em nuvem.

### 6.3 Mecanismo de Resolução de Conflitos (Merge Engine)

```typescript
export function mergeProfileData(local: any, remote: any): any {
  if (!local) return remote;
  if (!remote) return local;

  const localTime = new Date(local.updatedAt || 0).getTime();
  const remoteTime = new Date(remote.updatedAt || 0).getTime();

  // Prefere o registro mais recentemente atualizado globalmente
  if (localTime > remoteTime) {
    return { ...remote, ...local, updatedAt: local.updatedAt };
  } else {
    return { ...local, ...remote, updatedAt: remote.updatedAt };
  }
}
```

---

## 7. Otimizações de Performance, Custos & Escalabilidade

Para suportar milhões de usuários ativos com alta performance e mínimos custos de faturamento no Firestore, definimos as seguintes diretrizes:

### 7.1 Sem Leituras de Coleções Completas (Anti-Patterns de getDocs)
- **Eliminação Total de Escaneamento de Usuários:** A tela de Rede Social não pode mais realizar consultas sem filtros na coleção `/users`. 
- **Estratégia de Busca Focada:**
  - Perfis Recomendados (Destaques): Carregados por uma consulta limitada e ordenada baseada em atividade recente ou pontos estelares (`limit(15)`).
  - Caixa de Busca Pública: A busca de usuários deve exigir um termo de pesquisa de no mínimo 3 caracteres, acionando uma query indexada por prefixo ou correspondência exata, limitando a 10 resultados por consulta.
- **Estruturas Denormalizadas:**
  - Estatísticas de engajamento (`followersCount`, `followingCount`, `likesCount`, `friendsCount`) são salvas como contadores inteiros diretamente no documento principal `/users/{uid}`.
  - Isso remove a necessidade de realizar leituras de subcoleções inteiras apenas para renderizar os cartões na tela.

### 7.2 Paginação Obrigatória
Todas as listagens extensas de subcoleções (como diário de sonhos, histórico de leituras de tarot e mapas extras) devem implementar paginação por cursor (`startAfter`) ou queries com limites rígidos (`limit(20)`).

---

## 8. Segurança Avançada & Cloud Functions

Para atividades sensíveis que não devem depender do dispositivo cliente e evitar fraudes:

### 8.1 Assinaturas Premium & Liberação de Recursos
- O status `isPremium` é validado em backend seguro ou gerido por webhook do Stripe. O cliente apenas lê o campo e adapta o layout.
- A validação técnica dos recursos premium deve ocorrer por meio de regras de escrita restritas no Firestore, onde os campos sensíveis do plano do usuário são protegidos e atualizados apenas por processos administrativos autorizados.

### 8.2 Antifraude do Período de Teste (Trial Grace Period)
- O controle antifraude é baseado em impressões digitais de dispositivos e identificadores exclusivos de hardware associados na coleção `/device_trials`.
- Esta validação impede que o usuário limpe o cache do navegador ou crie e-mails descartáveis sucessivamente para obter períodos de teste premium gratuitos de forma abusiva.

---

## 9. Plano de Migração Incremental (Executável)

Este plano divide as alterações estruturais em etapas lógicas para garantir estabilidade e zero indisponibilidade do serviço.

### Etapa 1: Normalização dos IDs do Firestore
- Atualizar a função `getUserDocKey` em `/src/lib/firebase.ts` para garantir que o UID autenticado seja SEMPRE retornado se disponível, com fallback seguro para e-mail apenas quando offline.
- Ajustar os salvamentos e as leituras de subcoleções para apontar para caminhos baseados em UID.

### Etapa 2: Implementação do Merge Engine Não-Destrutivo
- Codificar a função de mesclagem inteligente comparando datas de atualização (`updatedAt`) antes de sincronizar o perfil local com o Firestore.
- Prevenir a sobrescrita cega de dados que ocorre durante trocas rápidas de abas ou reconexões.

### Etapa 3: Correção de Arquitetura da Rede Social
- Substituir todas as referências de e-mail por UID nos documentos de relacionamentos da rede social (subcoleções `following`, `followers`, `likesGiven`, etc.).
- Modificar as consultas na aba Relacionamentos para aplicar limites restritos, removendo a leitura indiscriminada de toda a coleção de usuários.

### Etapa 4: Implantação e Validação de Regras de Segurança
- Implantar as regras de segurança refinadas contidas na seção 5 em `/firestore.rules` utilizando o utilitário de deploy integrado.
- Executar linter e compilação de testes de regressão locais.

---

**Fim da Especificação de Arquitetura v1.0**
