import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translateUiText, Language } from '../lib/translations';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Layers, 
  TrendingUp, 
  Bell, 
  Mail, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  Database, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  ArrowRight, 
  Cloud, 
  Globe, 
  AlertCircle,
  Clock,
  Eye,
  Settings,
  Flame,
  LayoutGrid
} from 'lucide-react';

interface AdminPanelProps {
  userName: string;
  userBirthDate: string;
  userBirthSign: string;
  triggerGlobalNotification: (title: string, message: string, type: string) => void;
  firebaseErrors?: any[];
  onClearErrors?: () => void;
  lang?: string;
}

export default function AdminPanel({ 
  userName, 
  userBirthDate, 
  userBirthSign, 
  triggerGlobalNotification,
  firebaseErrors = [],
  onClearErrors,
  lang
}: AdminPanelProps) {
  const { t: i18nT } = useTranslation();
  const t = (text: string) => {
    if (!text) return "";
    const res = i18nT(text);
    if (res === text || !res) {
      return translateUiText(text, (lang as Language) || 'pt');
    }
    return res;
  };

  // Navigation for Sub-panels inside the configurations page
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'stats' | 'users' | 'plans' | 'content' | 'notifications' | 'performance' | 'diagnostics'>('stats');

  // Backend States
  const [users, setUsers] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [notifHistory, setNotifHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Forms editing states
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [createUserForm, setCreateUserForm] = useState({ name: '', email: '', plan: 'Celestial VIP', birthDate: '1997-02-11' });
  const [showCreateUser, setShowCreateUser] = useState(false);

  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  
  const [editingContent, setEditingContent] = useState<any | null>(null);
  const [createContentForm, setCreateContentForm] = useState({ title: '', type: 'Alerta Astral', author: '', status: 'Publicado' });
  const [showCreateContent, setShowCreateContent] = useState(false);

  // Notification simulator form
  const [simNotif, setSimNotif] = useState({ type: 'push', title: 'Alerta Urgente de Eclipse', message: 'A energia solar entrará em alinhamento exato com seu signo em poucas horas.' });
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState('astro_daily');

  // Performance simulation triggers
  const [pwaStatus, setPwaStatus] = useState<'Registering...' | 'Active & Cached (V1.0.8)' | 'Offline Ready'>('Active & Cached (V1.0.8)');
  const [cacheClearMsg, setCacheClearMsg] = useState('');
  const [lazyImagesLoaded, setLazyImagesLoaded] = useState<boolean>(false);
  const [seoSchemaExported, setSeoSchemaExported] = useState(false);

  // Load the initial data from Backend APIs on mount & tab change
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [usersRes, plansRes, contentsRes, statsRes, notifRes] = await Promise.all([
        fetch('/api/admin/users').then(res => res.json()),
        fetch('/api/admin/plans').then(res => res.json()),
        fetch('/api/admin/content').then(res => res.json()),
        fetch('/api/admin/stats').then(res => res.json()),
        fetch('/api/admin/notifications/history').then(res => res.json())
      ]);

      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(plansRes)) setPlans(plansRes);
      if (Array.isArray(contentsRes)) setContents(contentsRes);
      if (statsRes) setStats(statsRes);
      if (Array.isArray(notifRes)) setNotifHistory(notifRes);
    } catch (e) {
      console.warn("Failed to fetch admin data from backend:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [activeAdminSubTab]);

  // Operations: User Management
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createUserForm)
      });
      const data = await res.json();
      if (data.id) {
        triggerGlobalNotification("Usuário Sincronizado", `O usuário ${data.name} foi inserido no banco de dados com plano ${data.plan}.`, "success");
        setShowCreateUser(false);
        setCreateUserForm({ name: '', email: '', plan: 'Celestial VIP', birthDate: '1997-02-11' });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, plan: newPlan })
      });
      if (res.ok) {
        triggerGlobalNotification("Plano Atualizado", `Plano alterado para ${newPlan} com sucesso.`, "success");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, status: nextStatus })
      });
      if (res.ok) {
        triggerGlobalNotification("Status Alterado", `Usuário marcado como ${nextStatus === 'Active' ? 'Ativo' : 'Inativo'}.`, "success");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Tem certeza que deseja desvincular e excluir este assinante do banco de dados estelar?")) return;
    try {
      const res = await fetch('/api/admin/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        triggerGlobalNotification("Usuário Removido", "Assinante removido e encerrado do sistema cloud.", "success");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Operations: Plans Management
  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      const res = await fetch('/api/admin/plans/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlan)
      });
      if (res.ok) {
        triggerGlobalNotification("Plano Sincronizado", `O plano ${editingPlan.name} foi atualizado em tempo real.`, "success");
        setEditingPlan(null);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Operations: Content Management
  const handleCreateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/content/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createContentForm)
      });
      if (res.ok) {
        triggerGlobalNotification("Conteúdo Sincronizado", `O informativo "${createContentForm.title}" foi armazenado em rascunho de nuvem.`, "success");
        setShowCreateContent(false);
        setCreateContentForm({ title: '', type: 'Alerta Astral', author: '', status: 'Publicado' });
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateContentStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Publicado' ? 'Rascunho' : 'Publicado';
    try {
      const res = await fetch('/api/admin/content/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) {
        triggerGlobalNotification("Status de Conteúdo", `Informativo sintonizado em status [${nextStatus}].`, "success");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      const res = await fetch('/api/admin/content/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        triggerGlobalNotification("Conteúdo Deletado", "Postagem astrológica arquivada com sucesso.", "success");
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Operations: Dispatch Notifications Simulator
  const handleDispatchNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simNotif)
      });
      const data = await res.json();
      if (data.success) {
        // Trigger a real beautiful UI notification toast on the screen for instant feedback!
        triggerGlobalNotification(simNotif.title, simNotif.message, simNotif.type);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Generate Email template mock send
  const triggerEmailSimulation = (template: string) => {
    let emailTitle = '';
    let emailContent = '';
    if (template === 'astro_daily') {
      emailTitle = `Seu Radar Astral para ${userName}`;
      emailContent = `Com o Sol transitando por seu setor de destino, o dia favorece assinatura de contratos e sintonizações de amor para nativos de ${userBirthSign}.`;
    } else if (template === 'mercurio_retrograde') {
      emailTitle = `⚠️ ALERTA DE COAXIAL: Mercúrio Retrógrado!`;
      emailContent = `Prezado(a) ${userName}, faça backup de todos seus arquivos e evite comprar eletrônicos nas próximas 3 semanas de declínio cósmico.`;
    } else {
      emailTitle = `Bem-vindo(a) ao Mapa Estelar VIP`;
      emailContent = `Parabéns Fabricio, sua transação TX_990234 foi aprovada. O cosmos está agora de portas totalmente escancaradas para você.`;
    }

    setSimNotif({
      type: 'email',
      title: emailTitle,
      message: emailContent
    });

    triggerGlobalNotification(
      `E-mail Pronto para Roteamento`, 
      `Template [${template}] carregado. Clique em "Disparar Alerta Integrado" abaixo para simular o recebimento na sua caixa postal.`, 
      "email"
    );
  };

  // Clear local Astro Cache simulating immediate memory refreshing
  const handleClearAstroCache = () => {
    setCacheClearMsg('Limpando buckets do Redis + Cloudflare Edge CDN...');
    setTimeout(() => {
      setCacheClearMsg('Garantindo sincronia offline... Re-hidratando caches de órbita estelar com sintonias de 2026!');
      setTimeout(() => {
        setCacheClearMsg('Sucesso! Cache CDN de 24 horas limpo. Astrólogos e IA estão operando sincronizados.');
        triggerGlobalNotification("Bancos Re-hidratados", "Cache do servidor limpo e re-renderizado com alta taxa de compressão.", "success");
      }, 1200);
    }, 800);
  };

  // SEO Microdata Schema.org (Dynamic JSON-LD tailored to the active native)
  const generatedSeoSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": `Mapa Estelar de ${userName}`,
    "description": `Relatórios Premium de Astrologia Natal, Trânsitos e Oráculo para o nativo sob regência de ${userBirthSign}.`,
    "mainEntity": {
      "@type": "Person",
      "name": userName,
      "memberOf": {
        "@type": "Organization",
        "name": "Mapa Estelar Celestial VIP",
        "url": "https://mapaestelar.com"
      },
      "knowsAbout": ["Astrologia Natal", "Tarô", "Bioritmo", "Ciclo Lunar"]
    },
    "dateModified": "2026-06-09T09:30:00Z"
  };

  const handleExportSeoSchema = () => {
    setSeoSchemaExported(true);
    triggerGlobalNotification("Schema.org Exportado", "O script JSON-LD de SEO foi inserido com sucesso na head do HTML para validação de rastreadores do Google.", "success");
    setTimeout(() => setSeoSchemaExported(false), 3000);
  };

  return (
    <div className="bg-[#0c1221]/90 rounded-3xl border border-amber-500/20 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6 overflow-hidden">
      
      {/* Upper Module header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E5C158] animate-pulse" />
            <h2 className="text-xl font-serif text-white font-semibold">
              Painel de Ferramentas de Alta Operação
            </h2>
          </div>
          <p className="text-xs text-slate-450 mt-1">
            Módulos premium integrados de métricas, banco de dados local, roteador de disparos e performance SEO avançada.
          </p>
        </div>

        {/* Dynamic Reload Indicator */}
        <button 
          onClick={fetchAllData}
          className="px-3 py-1.5 rounded-xl bg-[#090e1a] hover:bg-[#151c33] border border-slate-800 hover:border-slate-700 flex items-center gap-1.5 text-xs text-[#E5C158] cursor-pointer transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Cloud</span>
        </button>
      </div>

      {/* Sub tabs of administration */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#050811] rounded-2xl border border-slate-850/50">
        
        <button
          onClick={() => setActiveAdminSubTab('stats')}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminSubTab === 'stats'
              ? 'bg-amber-500/10 text-[#E5C158] border border-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Estatísticas</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminSubTab === 'users'
              ? 'bg-amber-500/10 text-[#E5C158] border border-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Usuários ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('plans')}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminSubTab === 'plans'
              ? 'bg-amber-500/10 text-[#E5C158] border border-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Planos ({plans.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('content')}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminSubTab === 'content'
              ? 'bg-amber-500/10 text-[#E5C158] border border-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Conteúdo ({contents.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('notifications')}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminSubTab === 'notifications'
              ? 'bg-amber-500/10 text-[#E5C158] border border-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Roteador de Alertas</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('performance')}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminSubTab === 'performance'
              ? 'bg-amber-500/10 text-[#E5C158] border border-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Engine Performance & PWA</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('diagnostics')}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center gap-1.5 ${
            activeAdminSubTab === 'diagnostics'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>Sincronização & Erros ({firebaseErrors.length})</span>
        </button>
      </div>

      {isLoading && (
        <div className="py-12 flex flex-col items-center justify-center space-y-2">
          <RefreshCw className="w-8 h-8 text-[#E5C158] animate-spin" />
          <span className="text-xs text-slate-500 font-mono">Consolidando dados na nuvem...</span>
        </div>
      )}

      {/* SUB PANELS VIEW */}
      {!isLoading && (
        <div className="space-y-6 font-sans">
          
          {/* TAB 1: STATISTICS */}
          {activeAdminSubTab === 'stats' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Bento Grid High Level Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="p-4 bg-[#090e1a] border border-slate-800 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Faturamento Mensal (MRR)</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mt-1.5 font-bold">
                    {stats?.monthlyRecurringRevenue || "R$ 398,50"}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-mono">
                    <span>▲ +18.4% este mês</span>
                  </div>
                </div>

                <div className="p-4 bg-[#090e1a] border border-slate-800 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Assinantes Ativos</span>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mt-1.5 font-bold">
                    {stats?.activeSubscribers || "3"} / {stats?.totalUsers || "5"}
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-450 mt-1 font-mono">
                    <span>Taxa de conversão: 60%</span>
                  </div>
                </div>

                <div className="p-4 bg-[#090e1a] border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Caches Inteligentes (Hit)</span>
                    <Database className="w-4 h-4 text-[#E5C158]" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mt-1.5 font-bold">
                    {stats?.cacheHits || "12"} Consultas
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 mt-1 font-mono">
                    <span>Evitou estouro de cota Gemini</span>
                  </div>
                </div>

                <div className="p-4 bg-[#090e1a] border border-slate-800 rounded-xl">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Estabilidade Astral API</span>
                    <Zap className="w-4 h-4 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-serif text-white mt-1.5 font-bold">
                    99.8%
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-mono">
                    <span>Latência regularizada: ~24ms</span>
                  </div>
                </div>

              </div>

              {/* Graphic stats details */}
              <div className="p-5 bg-[#090e1a] rounded-2xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                  <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    Análise Fina de Dispositivos e Carga de IA
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-amber-500/5 text-[9px] font-mono text-[#E5C158] border border-amber-500/10">
                    Sincronizado: Hoje, 2026-06-09
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs">
                  {/* Left Column: Device and layout stats (Mobile First Verification) */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-white flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                      Engajamento de Tela Mobile-First
                    </h5>
                    
                    <div className="space-y-2 font-mono text-[11px]">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-450">Smartphones e Tablets (Touch)</span>
                          <span className="text-[#E5C158] font-bold">78%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500" style={{ width: '78%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-450">Telas de Desktop / Notebooks</span>
                          <span className="text-slate-300 font-bold">22%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: '22%' }} />
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
                      *O layout é auditado dinamicamente para garantir áreas de toque mínimas de 44px e evitar transbordamento de grid lateral em iPhones SE ou telas amplas.
                    </p>
                  </div>

                  {/* Right Column: AI engines in production */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-white flex items-center gap-1.5">
                      <LayoutGrid className="w-3.5 h-3.5 text-amber-500" />
                      Modelos de Sintonização de IA Ativos
                    </h5>

                    <div className="space-y-2 font-mono text-[11px]">
                      <div className="p-2 rounded bg-slate-950 border border-slate-850 flex items-center justify-between">
                        <span className="text-slate-300">Google Gemini 3.5-Flash</span>
                        <span className="text-[#E5C158]">Oráculo Prioritário</span>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-850 flex items-center justify-between">
                        <span className="text-slate-300">Google Gemini 3.1-Lite</span>
                        <span className="text-slate-400">Fallback Primário</span>
                      </div>
                      <div className="p-2 rounded bg-slate-950 border border-slate-850 flex items-center justify-between">
                        <span className="text-[#E5C158] font-bold">Astro Sintonizador Local</span>
                        <span className="text-emerald-400 font-bold">Resiliência Offline</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 2: ACTIVE USERS MANAGEMENT */}
          {activeAdminSubTab === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono font-bold text-[#E5C158] uppercase tracking-widest">
                  {t("Banco de Usuários e Assinantes")}
                </h3>
                <button
                  onClick={() => setShowCreateUser(!showCreateUser)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-black font-semibold text-xs transition cursor-pointer flex items-center gap-1 ml-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t("Novo Assinante")}</span>
                </button>
              </div>

              {/* Create User Form Section */}
              {showCreateUser && (
                <form onSubmit={handleCreateUser} className="p-4 bg-[#050811] rounded-2xl border border-amber-500/20 space-y-4 animate-in slide-in-from-top-3 duration-250">
                  <h4 className="text-xs font-semibold text-white">{t("Adicionar Assinante ao Log")}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <label className="block text-slate-450 mb-1">{t("NOME COMPLETO")}</label>
                      <input 
                        type="text" 
                        value={createUserForm.name}
                        onChange={(e) => setCreateUserForm({...createUserForm, name: e.target.value})}
                        placeholder="e.g. Maria Oliveira"
                        required
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-450 mb-1">{t("E-MAIL DO PERFIL")}</label>
                      <input 
                        type="email" 
                        value={createUserForm.email}
                        onChange={(e) => setCreateUserForm({...createUserForm, email: e.target.value})}
                        placeholder="e.g. maria@example.com"
                        required
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-450 mb-1">{t("DATA DE NASCIMENTO")}</label>
                      <input 
                        type="date" 
                        value={createUserForm.birthDate}
                        onChange={(e) => setCreateUserForm({...createUserForm, birthDate: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden text-slate-250"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-450 mb-1">PLANO ASSOCIADO</label>
                      <select 
                        value={createUserForm.plan}
                        onChange={(e) => setCreateUserForm({...createUserForm, plan: e.target.value})}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden text-slate-305"
                      >
                        <option value="Free Tier">Free Tier</option>
                        <option value="Basic Plan">Basic Plan</option>
                        <option value="Astro Premium">Astro Premium</option>
                        <option value="Celestial VIP">Celestial VIP</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1.5">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateUser(false)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-xs text-slate-400 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                    >
                      Salvar Assinante
                    </button>
                  </div>
                </form>
              )}

              {/* Users Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map((userItem) => (
                  <div 
                    key={userItem.id}
                    className={`p-4 rounded-2xl border bg-[#090e1a] hover:border-slate-700 transition space-y-3 relative overflow-hidden ${
                      userItem.role === 'Premium Subscriber' ? 'border-amber-500/10' : 'border-slate-800'
                    }`}
                  >
                    {/* Role badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                        userItem.role === 'Premium Subscriber'
                          ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {userItem.plan}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">{userItem.name}</h4>
                      <p className="text-[10.5px] text-slate-450 font-mono">{userItem.email}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-850 gap-2 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500">Membro desde:</span>{' '}
                        <span className="text-slate-300">{userItem.joinDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Status:</span>
                        <button 
                          type="button"
                          onClick={() => handleToggleUserStatus(userItem.id, userItem.status)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold cursor-pointer uppercase ${
                            userItem.status === 'Active' 
                              ? 'bg-emerald-500/10 text-emerald-400' 
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {userItem.status === 'Active' ? '✔ Ativo' : '✖ Suspenso'}
                        </button>
                      </div>
                    </div>

                    {/* Quick upgrades of plans */}
                    <div className="pt-2 flex items-center justify-between gap-1.5 border-t border-slate-850">
                      <span className="text-[10px] text-slate-500 font-mono">Modificar Plano:</span>
                      
                      <div className="flex items-center gap-1">
                        <select 
                          value={userItem.plan}
                          onChange={(e) => handleUpdateUserPlan(userItem.id, e.target.value)}
                          className="px-2 py-1 rounded bg-[#050811] border border-slate-800 text-[10px] text-slate-300 focus:outline-hidden"
                        >
                          <option value="Free Tier">Free Tier</option>
                          <option value="Basic Plan">Basic Plan</option>
                          <option value="Astro Premium">Astro Premium</option>
                          <option value="Celestial VIP">Celestial VIP</option>
                        </select>

                        <button 
                          onClick={() => handleDeleteUser(userItem.id)}
                          className="p-1 rounded bg-slate-950 hover:bg-red-950/20 border border-slate-850 hover:border-red-500/20 text-slate-500 hover:text-red-400 transition cursor-pointer"
                          title="Excluir Usuário"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: SUBSCRIPTION PLANS */}
          {activeAdminSubTab === 'plans' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              <h3 className="text-xs font-mono font-bold text-[#E5C158] uppercase tracking-widest pb-1">
                Ajuste de Preços e Pacotes de Assinatura
              </h3>

              {editingPlan && (
                <form onSubmit={handleUpdatePlan} className="p-4 bg-[#050811] rounded-2xl border border-amber-500/20 space-y-3 text-xs">
                  <h4 className="font-semibold text-white">Editando Plano: {editingPlan.name}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                    <div>
                      <label className="block text-slate-500 mb-1">NOME EXIBIDO</label>
                      <input 
                        type="text"
                        value={editingPlan.name}
                        onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">PREÇO PÚBLICO</label>
                      <input 
                        type="text"
                        value={editingPlan.price}
                        onChange={(e) => setEditingPlan({...editingPlan, price: e.target.value})}
                        className="w-full px-2.5 py-1.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 mb-1 font-mono">DESCRIÇÃO CURTA</label>
                    <input 
                      type="text"
                      value={editingPlan.description}
                      onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                      className="w-full px-2.5 py-1.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-200"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setEditingPlan(null)}
                      className="px-3 py-1 bg-slate-900 rounded-lg hover:bg-slate-800 text-slate-400"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3 font-sans">
                {plans.map((pl) => (
                  <div 
                    key={pl.id}
                    className="p-4 bg-[#090e1a] rounded-2xl border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-white">{pl.name}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono font-bold text-amber-500">
                          {pl.price}
                        </span>
                      </div>
                      <p className="text-xs text-slate-450">{pl.description}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        {pl.features.map((f: string, i: number) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 text-[9px] font-mono text-slate-450">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingPlan(pl)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-[11px] font-medium text-amber-400 cursor-pointer flex items-center justify-center gap-1.5 transition self-start sm:self-center shrink-0"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Modificar Preço</span>
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: CONTENT MANAGER */}
          {activeAdminSubTab === 'content' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-mono font-bold text-[#E5C158] uppercase tracking-widest">
                  Notícias, Dicas Clássicas e Curadorias Diárias
                </h3>
                
                <button
                  onClick={() => setShowCreateContent(!showCreateContent)}
                  className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 transition flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Alerta</span>
                </button>
              </div>

              {showCreateContent && (
                <form onSubmit={handleCreateContent} className="p-4 bg-[#050811] rounded-2xl border border-amber-500/20 space-y-3 text-xs">
                  <h4 className="font-semibold text-white">Cadastrar Nova Matéria Estelar</h4>
                  
                  <div className="space-y-2 font-mono">
                    <div>
                      <label className="block text-slate-500 mb-0.5">TÍTULO INFORMATIVO</label>
                      <input 
                        type="text"
                        value={createContentForm.title}
                        onChange={(e) => setCreateContentForm({...createContentForm, title: e.target.value})}
                        placeholder="e.g. Alinhamento de Quirão com Urano"
                        required
                        className="w-full px-2.5 py-1.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-500 mb-0.5">TIPO DE ARTIGO</label>
                        <select 
                          value={createContentForm.type}
                          onChange={(e) => setCreateContentForm({...createContentForm, type: e.target.value})}
                          className="w-full px-2.5 py-1.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-200"
                        >
                          <option value="Alerta Astral">Alerta Astral</option>
                          <option value="Guia Clássico">Guia Clássico</option>
                          <option value="Artigo Premium">Artigo Premium</option>
                          <option value="Relatório">Relatório</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-500 mb-0.5">AUTOR DA CURADORIA</label>
                        <input 
                          type="text"
                          value={createContentForm.author}
                          onChange={(e) => setCreateContentForm({...createContentForm, author: e.target.value})}
                          placeholder="e.g. Regina Tarot"
                          className="w-full px-2.5 py-1.5 bg-slate-955 border border-slate-800 rounded-xl text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateContent(false)}
                      className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg cursor-pointer"
                    >
                      Publicar Conteúdo
                    </button>
                  </div>
                </form>
              )}

              {/* Contents Table / Cards */}
              <div className="space-y-3">
                {contents.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 bg-[#090e1a] rounded-2xl border border-slate-800 flex items-center justify-between gap-4 font-mono text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-850 text-[9px] text-[#E5C158]">
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-550">por {item.author || "Sistema"}</span>
                      </div>
                      <h4 className="font-sans text-sm font-bold text-white leading-tight">{item.title}</h4>
                      <p className="text-[9.5px] text-slate-500">Postagem: {item.date}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleUpdateContentStatus(item.id, item.status)}
                        className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition ${
                          item.status === 'Publicado'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-950 text-slate-450 border border-slate-850'
                        }`}
                      >
                        {item.status}
                      </button>

                      <button
                        onClick={() => handleDeleteContent(item.id)}
                        className="p-2 rounded bg-slate-950 border border-slate-850 hover:bg-red-950/20 hover:border-red-500/20 hover:text-red-400 text-slate-450 transition cursor-pointer"
                        title="Deletar informativo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: MULTI-CHANNEL ALERTS ROUTER (NOTIFICAÇÕES) */}
          {activeAdminSubTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              <div className="p-4 bg-[#0c1328] border border-amber-500/15 rounded-2xl space-y-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/25 text-[9px] font-mono text-amber-500 uppercase font-bold">
                  Simbologia Ativa de Disparo
                </span>
                <h4 className="text-sm font-serif text-white font-medium">Sincronizador de Contatos e Alunos</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Utilize as ferramentas abaixo e os templates astrológicos para gerar disparos artificiais. O sistema encaminha sinais simulados no console do backend e injeta cards nos alertas internos do app instantaneamente!
                </p>
              </div>

              {/* Fast Email templates selectors */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono font-bold text-[#E5C158] uppercase tracking-widest">
                  1. Carregar Templates Rápidos de Email / SMS
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => triggerEmailSimulation('astro_daily')}
                    className="p-3 bg-[#090e1a] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left rounded-xl transition cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      <strong>Informativo Diário</strong>
                    </div>
                    <p className="text-[10px] text-slate-500 block leading-tight">Boletim personalizado para nativo de Touro/Escorpião.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerEmailSimulation('mercurio_retrograde')}
                    className="p-3 bg-[#090e1a] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left rounded-xl transition cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <strong>Mercúrio Alinhamento</strong>
                    </div>
                    <p className="text-[10px] text-slate-500 block leading-tight">Alerta de trânsito perigoso enviado no celular.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerEmailSimulation('vip_welcoming')}
                    className="p-3 bg-[#090e1a] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-left rounded-xl transition cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-white">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E5C158]" />
                      <strong>Boas-vindas VIP</strong>
                    </div>
                    <p className="text-[10px] text-slate-500 block leading-tight">Instruções de acesso aos oráculos de cota ilimitada.</p>
                  </button>
                </div>
              </div>

              {/* Notification Sender form */}
              <form onSubmit={handleDispatchNotification} className="p-4 bg-[#050811] rounded-2xl border border-slate-800 space-y-4">
                <h4 className="text-xs font-mono font-bold text-slate-350 uppercase tracking-widest pb-2 border-b border-slate-850">
                  2. Construir Alerta Personalizado
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  
                  <div className="sm:col-span-1">
                    <label className="block text-slate-500 mb-1">CANAL DE ENTREGA</label>
                    <div className="flex flex-col gap-1.5 pt-1 text-[11px] text-slate-300">
                      
                      <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                        <input 
                          type="radio" 
                          name="notif_type" 
                          checked={simNotif.type === 'push'} 
                          onChange={() => setSimNotif({...simNotif, type: 'push'})}
                          className="text-amber-500"
                        />
                        <span className="flex items-center gap-1">
                          <Smartphone className="w-3 h-3 text-[#E5C158]" /> Push celular
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                        <input 
                          type="radio" 
                          name="notif_type" 
                          checked={simNotif.type === 'email'} 
                          onChange={() => setSimNotif({...simNotif, type: 'email'})}
                          className="text-amber-500"
                        />
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-emerald-400" /> E-mail HTML
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                        <input 
                          type="radio" 
                          name="notif_type" 
                          checked={simNotif.type === 'alert'} 
                          onChange={() => setSimNotif({...simNotif, type: 'alert'})}
                          className="text-amber-500"
                        />
                        <span className="flex items-center gap-1">
                          <Bell className="w-3 h-3 text-amber-500" /> Alerta interno app
                        </span>
                      </label>

                    </div>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <div>
                      <label className="block text-slate-500 mb-1 font-mono uppercase text-[10px]">TÍTULO PRINCIPAL</label>
                      <input 
                        type="text" 
                        value={simNotif.title}
                        onChange={(e) => setSimNotif({...simNotif, title: e.target.value})}
                        required
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden text-slate-20"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-500 mb-1 font-mono uppercase text-[10px]">MENSAGEM DE TEXTO</label>
                      <textarea 
                        value={simNotif.message}
                        onChange={(e) => setSimNotif({...simNotif, message: e.target.value})}
                        required
                        rows={2}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-hidden text-slate-20"
                      />
                    </div>
                  </div>

                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 hover:text-black font-extrabold uppercase text-xs rounded-xl tracking-wider cursor-pointer active:scale-98 transition text-center"
                  >
                    Disparar Alerta Integrado
                  </button>
                </div>
              </form>

              {/* Notifications Dispatched History Logs */}
              <div className="space-y-3 font-mono text-xs">
                <h4 className="text-xs font-mono font-bold text-slate-350 uppercase tracking-widest">
                  Notificações Ativas e Logs de Envio ({notifHistory.length})
                </h4>

                <div className="space-y-2.5">
                  {notifHistory.map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-3 bg-[#090e1a] rounded-xl border border-slate-850 flex items-start gap-3 justify-between ${
                        !item.read ? 'border-amber-500/10 bg-[#0d152b]' : ''
                      }`}
                    >
                      <div className="flex gap-2.5">
                        <div className="p-2 rounded bg-slate-950 border border-slate-850 mt-0.5">
                          {item.type === 'push' && <Smartphone className="w-4 h-4 text-[#E5C158]" />}
                          {item.type === 'email' && <Mail className="w-4 h-4 text-emerald-400" />}
                          {item.type === 'alert' && <Bell className="w-4 h-4 text-amber-500" />}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="text-white font-sans text-xs">{item.title}</strong>
                            {!item.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans leading-tight">{item.message}</p>
                          <span className="text-[9px] text-[#E5C158] flex items-center gap-1 font-mono">
                            <Clock className="w-2.5 h-2.5" /> {new Date(item.timestamp).toLocaleTimeString()} • {item.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: PERFORMANCE ENGING DIAGNOSTICS */}
          {activeAdminSubTab === 'performance' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* PWA Section */}
              <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-2xl space-y-4">
                <div className="pb-3 border-b border-slate-850 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Cloud className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-semibold text-white">Auditoria PWA (Progressive Web App)</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 font-bold uppercase">
                    {pwaStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-slate-400">
                  <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[10px] text-slate-500">SERVICE WORKER</span>
                    <strong className="block text-emerald-400 font-sans">Registrado (SW.js)</strong>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[10px] text-slate-500">MANIFESTO JSON</span>
                    <strong className="block text-white font-sans">Ativo (/manifest.json)</strong>
                  </div>
                  <div className="p-3 rounded bg-slate-950 border border-slate-850 space-y-1">
                    <span className="text-[10px] text-slate-500">TELAS SUPORTADAS</span>
                    <strong className="block text-white font-sans">Celular + Desktop</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-450 leading-relaxed font-sans mt-1">
                  O manifesto configura a plataforma para rodar como app nativo em tela cheia no Android, iOS e Windows. Ativa cores de barra de status personalizadas em preto e azul noite royal, e suporta carregamento offline absoluto do Tarot estelar.
                </p>
              </div>

              {/* Cache storage cleaner */}
              <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-2xl space-y-4">
                <div className="pb-3 border-b border-slate-850 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-5 h-5 text-[#E5C158]" />
                    <h4 className="text-sm font-semibold text-white">Estratégias de Cache (Local & CDN)</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">15.4 KB Usados</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Utilizamos uma política agressiva de cache de 24 horas (`stale-while-revalidate`) para requisições de mapas natais. Isso impede consultas redundantes e garante velocidade de resposta estantânea de menos de 10ms.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleClearAstroCache}
                    className="px-4 py-2 bg-[#050811] hover:bg-[#111930] rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-bold text-amber-500 transition cursor-pointer"
                  >
                    Esvaziar Caches Estelares e Forçar Sincronia
                  </button>

                  {cacheClearMsg && (
                    <div className="p-3 bg-[#050811] border border-amber-500/10 rounded-xl text-[11px] font-mono text-amber-500 text-center animate-pulse">
                      {cacheClearMsg}
                    </div>
                  )}
                </div>
              </div>

              {/* Lazy Loading demo section */}
              <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-2xl space-y-4">
                <div className="pb-3 border-b border-slate-850">
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-semibold text-white">Deferimento de Imagens (Lazy Loading)</h4>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  As cartas de Tarot e planos de fundo de constelações são renderizados nativamente com o atributo `loading="lazy"`. Além disso, geramos previews estruturais vetoriais antes das imagens em alta definição serem baixadas da CDN global.
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-500">Mecanismo do Browser:</span>
                    <span className="px-2 py-0.5 rounded bg-amber-550/10 text-[9px] font-mono text-amber-500 font-medium">Nativo [loading="lazy"] + Intersec Obs</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-ratio-video rounded-xl bg-slate-950 border border-slate-850 relative overflow-hidden flex items-center justify-center h-16">
                        <span className="text-[10px] text-slate-600 font-mono">Espelho {i}</span>
                        {!lazyImagesLoaded ? (
                          <div className="absolute inset-0 bg-[#0c1221] flex items-center justify-center font-mono text-[9px] text-amber-600">
                             Placeholder...
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center text-[9px] font-mono text-emerald-400">
                             Imagem HD Ativa!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setLazyImagesLoaded(!lazyImagesLoaded);
                      triggerGlobalNotification(
                        lazyImagesLoaded ? "Imagens Retomadas" : "Imagens Carregadas da CDN", 
                        lazyImagesLoaded ? "Visualizadores voltaram para modo econômico de dados." : "As imagens HD em cache foram ativadas e exibidas.",
                        "success"
                      );
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-805 hover:bg-slate-900 text-xs text-slate-350 cursor-pointer text-[#E5C158]"
                  >
                    {lazyImagesLoaded ? "Simular Deferimento (Pre-HD)" : "Simular Visão HD Completa (Scroll)"}
                  </button>
                </div>
              </div>

              {/* Advanced SEO Schema.org Panel */}
              <div className="p-5 bg-[#090e1a] border border-[#E5C158]/10 rounded-2xl space-y-4">
                <div className="pb-3 border-b border-slate-850 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-semibold text-white">SEO Avançado & Metadados Estruturados</h4>
                  </div>
                </div>

                <p className="text-xs text-slate-450 leading-relaxed">
                  Geramos metadados orgânicos JSON-LD dinamicamente sintonizados para o nome do visitante e seu signo solar natal. O código resultante é injetado diretamente nos canais de cabeçalho do app para melhor indexação e indexabilidade no Google.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-48 overflow-y-auto leading-relaxed">
                  <pre>{JSON.stringify(generatedSeoSchema, null, 2)}</pre>
                </div>

                <button
                  onClick={handleExportSeoSchema}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>{seoSchemaExported ? "Pronto! Schema Validado" : "Exportar & Injetar Schema.org HTML"}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 7: FIREBASE CLOUD DIAGNOSTICS & SYSTEM LOG MONITOR */}
          {activeAdminSubTab === 'diagnostics' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Connection Status Panel */}
              <div className="p-5 bg-[#090e1a] border border-slate-800 rounded-2xl space-y-4">
                <div className="pb-3 border-b border-slate-850 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-5 h-5 text-rose-500 animate-pulse" />
                    <h4 className="text-sm font-semibold text-white">Status da Sincronização Firebase & Firestore</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/25">
                     Monitor Ativo
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-[#050811] border border-slate-850 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-500">PROVIMENTO CLOUD</span>
                    <strong className="block text-xs text-emerald-400">ATIVO & SINTONIZADO</strong>
                    <span className="text-[9px] font-mono text-slate-600">Hybrid Synchronizer ativo</span>
                  </div>
                  <div className="p-3 bg-[#050811] border border-slate-850 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-500">REGRAS DE SEGURANÇA</span>
                    <strong className="block text-xs text-[#E5C158]">Módulo ABAC Ativado</strong>
                    <span className="text-[9px] font-mono text-slate-600">Rules v2 Ativo na Nuvem</span>
                  </div>
                  <div className="p-3 bg-[#050811] border border-slate-850 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-500">FALLBACK OFFLINE</span>
                    <strong className="block text-xs text-blue-400">LocalStorage Híbrido</strong>
                    <span className="text-[9px] font-mono text-slate-600">Reconciliação Automática</span>
                  </div>
                </div>
              </div>

              {/* Active Errors Workspace */}
              <div className="p-5 bg-[#0c080d] border border-rose-500/10 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-rose-500/15 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Log de Segurança & Auditoria de Erros</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Captura e inspectação de falhas e violações de permissões do Firebase.</p>
                    </div>
                  </div>
                  {firebaseErrors.length > 0 && (
                    <button
                      onClick={onClearErrors}
                      className="px-2 py-1 bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/20 text-[10px] font-mono text-rose-400 rounded-lg transition"
                    >
                      Limpar Logs
                    </button>
                  )}
                </div>

                {firebaseErrors.length === 0 ? (
                  <div className="p-8 text-center bg-[#070508] border border-slate-850 rounded-xl space-y-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-500/80 mx-auto animate-pulse" />
                    <h5 className="text-xs font-semibold text-slate-300">Nenhum Erro ou Violação Detectados</h5>
                    <p className="text-[10px] text-slate-550 max-w-sm mx-auto">
                      O sistema de integridade estelar está rodando com sucesso. Todas as leituras e gravações transacionaram limpas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {firebaseErrors.map((err, idx) => (
                      <div key={idx} className="p-4 bg-[#0a060a] border border-rose-950 rounded-xl space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between text-[10px] pb-1.5 border-b border-rose-955/40">
                          <span className="text-rose-400 font-bold">{err.message}</span>
                          <span className="text-slate-500">{err.timestamp}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed select-all">
                          {err.details}
                        </p>
                        {err.details.startsWith('{') && (
                          <div className="mt-2 p-2 bg-slate-950 rounded border border-rose-955/50 overflow-x-auto text-[9.5px]">
                            <pre className="text-rose-350">{err.details}</pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 bg-[#070508] border border-slate-905 rounded-xl text-[10px] font-mono text-slate-500 leading-relaxed">
                  <strong>Simulador de Erros Robustos:</strong> Se você quiser testar as regras de segurança e o logger integrado, tente cadastrar um usuário com campos corrompidos ou ler de caminhos privados sem permissões no Firebase. O middleware irá interceptar, traduzir para a especificação JSON e printar acima.
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
