# Relatório Técnico de Persistência - Portal Órbita (Orbita07)

Este relatório analisa de forma minuciosa os fluxos de cadastro, login, geração de mapas astrais e salvamento de dados do aplicativo **Portal Órbita**, diagnosticando os problemas de persistência solicitados e propondo as correções exatas a serem aplicadas.

---

## 1. Diagnóstico: Por que os dados não estão salvando?

Após uma auditoria completa nos arquivos `src/App.tsx`, `src/lib/firebase.ts` e `src/types.ts`, identificamos as seguintes causas fundamentais para os dados não permanecerem salvos ao sair e retornar ao aplicativo:

1. **Ausência de Fluxo para Usuários não Registrados (Raciocínio Local vs Nuvem):**
   * Atualmente, o aplicativo possui apenas o botão **"CADASTRAR E GERAR MEU MAPA"**. Se um usuário apenas gera o mapa astro sem concluir ou validar o fluxo de autenticação correspondente, seus dados de nascimento, coordenadas (`latitude`, `longitude`) e o mapa gerado são parcialmente perdidos ou não são carregados na próxima inicialização, pois o estado `user` é resetado para um perfil vazio ao identificar que `isLoggedIn` é falso.

2. **Inconsistência de Chaveamento de Documentos no Firestore (`getUserDocKey`):**
   * A função `getUserDocKey(email)` em `src/lib/firebase.ts` tenta alternar entre o `uid` do Firebase Authentication e o `email` de forma reativa. Em momentos de inicialização (subscrição do `onAuthStateChanged`), se o objeto `auth.currentUser` ainda não carregou ou há condições de corrida (*race conditions*), o sistema grava o perfil usando o `email` como id do documento no Firestore, mas tenta ler por `uid` após o login, gerando incompatibilidade de leitura/escrita e dando a sensação de que os dados sumiram.

3. **Ausência do Campo "Região ou País de Nascimento" (Tela Inicial):**
   * O fluxo inicial de preenchimento solicitava apenas Nome, Data, Hora e Cidade. A falta do campo de região ou país impedia que esses metadados cruciais fossem persistidos no perfil do usuário no Firestore, além de limitar as opções de buscas integradas de cidades mundiais.

4. **Botões Duplos Faltantes ("Salvar Mapa" vs "Gerar Mapa"):**
   * O usuário não possuía a autonomia para primeiro apenas **"Gerar Mapa"** (para visualizar localmente na hora na forma de *Guest/Offline* temporário persistido localmente) e depois **"Salvar Mapa"** (vinculando a uma autenticação segura por E-mail ou Google na nuvem do Firestore de forma indestrutível).

5. **Ausência de Botão de Salvamento Permanente nas Telas Internas:**
   * Dentro do aplicativo, após recalcular mapas ou sintonizar novas efemérides (como mapas extras de terceiros), não havia um botão explícito de **"Salvar Mapa"** que garantisse o *commit* imediato na nuvem de forma legível e sem fricções.

---

## 2. Arquivos Responsáveis

* **`src/types.ts`:** Necessário estender a interface `UserProfile` para comportar a nova propriedade `birthRegion` (Região ou país de nascimento).
* **`src/lib/firebase.ts`:** Ajustar e padronizar as funções `getUserDocKey` e `saveProfileToDatabase` para priorizar rigidamente o `uid` do usuário autenticado no documento `/users/{uid}`, gerando redundância via e-mail somente para migrações legadas obsoletas. Estender o tipo `UserProfileData` para incluir `birthRegion`.
* **`src/App.tsx`:**
  * Implementar o estado reativo `createMainRegion` e sincronizá-lo com o formulário.
  * Reestruturar o design da Tela de Boas-vindas para apresentar os campos de nascimento unificados com os botões físicos **"Salvar Mapa"** e **"Gerar Mapa"**.
  * Ajustar as funções de submissão do formulário (`handleRegisterAccountSubmit` e `handleGoogleLogin`) para tratar o preenchimento de `birthRegion`.
  * Integrar o fluxo de "Conecte-se para Salvar" caso um usuário use a função rápida "Gerar Mapa" e queira salvar seu mapa na nuvem posteriormente.

---

## 3. Correções Necessárias & Fluxo Proposto

### A. Estrutura do Firestore Recomendada (Zero-Trust & Higiene de Dados)

O modelo de dados deve seguir a seguinte topologia padrão no Cloud Firestore:

```
/users/{userId} (Documento do usuário identificado rigorosamente pelo UID do Firebase Auth)
  ├── email: string
  ├── name: string
  ├── birthDate: string
  ├── birthTime: string
  ├── birthCity: string
  ├── birthRegion: string
  ├── latitude: number
  ├── longitude: number
  ├── hasCreatedMap: boolean
  ├── isPremium: boolean
  ├── currentChartId: string
  └── (outras preferências de controle interno)
  
/users/{userId}/natalCharts/{chartId} (Coleção de Mapas Astrais Natais Calculados)
  ├── name: string
  ├── birthDate: string
  ├── birthTime: string
  ├── birthCity: string
  ├── birthRegion: string
  ├── mapData: MapsObject (Posições elementares, cúspides Placidus, aspectos cósmicos)
  └── numerology: NumerologyObject (Caminho de vida, ciclos numéricos terrestres)
```

### B. Fluxo Correto de Salvamento e Recuperação

1. **Preenchimento Inicial:** O usuário digita seus dados estelares na tela de boas-vindas. Ele pode selecionar sugestões autocompletadas no campo de cidade, capturando as coordenadas exatas (`latitude`, `longitude`).
2. **Ao Clicar em "Gerar Mapa" (Estilo Local/Rápido):**
   * O sistema valida os campos principais (Nome, Cidade, Data, Hora).
   * Ele salva esses dados nos estados locais e os persiste reativamente no `localStorage` sob a chave `"orbi_guest_profile"` (para o usuário temporário offline).
   * O mapa principal é calculado via Astro API ou fallback local, permitindo que ele visualize o painel de bordo imediatamente sem exigir cadastro forçado.
3. **Ao Clicar em "Salvar Mapa" (Sincronização na Nuvem):**
   * Se o usuário já estiver logado (ou preencher o e-mail/senha na tela inicial), o sistema realiza a criação de conta no Firebase Authentication.
   * Após a validação, salva o Perfil do Usuário e adiciona o Mapa Integral na coleção `/users/{uid}/natalCharts/{chartId}` do Firestore de forma definitiva.
   * Se um usuário que entrou inicialmente como Guest clicar em "Salvar Mapa", um prompt elegante e amigável é aberto para que ele crie sua conta (por e-mail ou Google), migrando instantaneamente o mapa calculado localmente para a sua conta definitiva na nuvem.
4. **Logins Futuros:**
   * O observer de autenticação `subscribeToAuthChanges` detecta a sessão ativa do usuário.
   * Ele faz a requisição de `/users/{uid}` trazendo o perfil persistido no Firestore.
   * Em seguida, busca o mapa natal sintonizado em `/users/{uid}/natalCharts/{currentChartId}`.
   * Atualiza a interface e limpa o fluxo de boas-vindas exibindo os gráficos do usuário salvos de forma offline-first e persistente.
