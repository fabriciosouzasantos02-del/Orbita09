import React, { useEffect, useState } from 'react';
import { Bell, Sparkles, Check, Info, Calendar, AlertTriangle, Eye, ChevronRight, X, Compass, Globe } from 'lucide-react';

export interface AstroNotification {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
  read: boolean;
  planet: string;
  aspect: string;
  category: 'alignment' | 'eclipse' | 'retrograde' | 'node';
}

interface AstroNotificationsProps {
  userName?: string;
  birthDate?: string;
  userEmail?: string;
  onRewardPoints?: (amount: number) => void;
}

export default function AstroNotifications({ userName, birthDate, userEmail, onRewardPoints }: AstroNotificationsProps) {
  const [notifications, setNotifications] = useState<AstroNotification[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<AstroNotification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [claimedBlessings, setClaimedBlessings] = useState<string[]>([]);

  // 1. Load claimed blessings list from localStorage
  useEffect(() => {
    const claimed = localStorage.getItem('claimed_blessings_keys');
    if (claimed) {
      try {
        setClaimedBlessings(JSON.parse(claimed));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // 2. Fetch notification data from backend
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/astrology/rare-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, birthDate: birthDate, email: userEmail })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.notifications)) {
          // Merge read state from localStorage if exists
          const savedReadIds = localStorage.getItem('astro_read_notification_ids');
          const readIds: string[] = savedReadIds ? JSON.parse(savedReadIds) : [];
          
          const parsedNotifications = data.notifications.map((n: AstroNotification) => ({
            ...n,
            read: readIds.includes(n.id)
          }));
          setNotifications(parsedNotifications);
        }
      }
    } catch (err) {
      console.error("Error fetching rare alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userName, birthDate, userEmail]);

  // Handle Mark All as Read
  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    
    const allIds = updated.map(n => n.id);
    localStorage.setItem('astro_read_notification_ids', JSON.stringify(allIds));
  };

  // Handle Mark Single as Read
  const handleMarkSingleRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);

    const savedReadIds = localStorage.getItem('astro_read_notification_ids');
    const readIds: string[] = savedReadIds ? JSON.parse(savedReadIds) : [];
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('astro_read_notification_ids', JSON.stringify(readIds));
    }
  };

  // Handle Claming Blessing Points
  const handleClaimBlessing = (n: AstroNotification) => {
    if (claimedBlessings.includes(n.id)) return;
    
    const nextClaimed = [...claimedBlessings, n.id];
    setClaimedBlessings(nextClaimed);
    localStorage.setItem('claimed_blessings_keys', JSON.stringify(nextClaimed));

    if (onRewardPoints) {
      onRewardPoints(200); // 200 points per rare planetary sintonization
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getSeverityStyles = (severity: AstroNotification['severity']) => {
    switch (severity) {
      case 'high':
        return {
          bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-500',
          badge: 'Critico'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
          badge: 'Raro'
        };
      default:
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          badge: 'Sutil'
        };
    }
  };

  const getPlanetEmoji = (planet: string) => {
    const name = planet.toLowerCase();
    if (name.includes('sol')) return '☀️';
    if (name.includes('lua')) return '🌙';
    if (name.includes('merc')) return '☿';
    if (name.includes('ven')) return '♀';
    if (name.includes('marte')) return '♂';
    if (name.includes('jup')) return '♃';
    if (name.includes('sat')) return '♄';
    if (name.includes('uran')) return '♅';
    if (name.includes('net')) return '♆';
    if (name.includes('plut')) return '♇';
    return '🪐';
  };

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="astro-notifications-wrapper" className="relative">
      
      {/* Notifications bell button */}
      <button
        id="astro-notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-450 hover:text-slate-200 transition active:scale-95 cursor-pointer flex items-center justify-center"
        title="Alertas Planetários Raros"
      >
        <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'animate-swing duration-1000 iteration-infinite' : ''}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold font-mono text-white flex items-center justify-center border-2 border-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div 
          id="astro-notifications-dropdown"
          className="absolute right-0 mt-3 w-80 md:w-96 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-3xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-4 duration-200 flex flex-col space-y-2 overflow-hidden max-h-[480px]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-900/40">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Sinais Celestes Ativos
              </h4>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[9px] font-mono font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
              >
                Lidos todos ({unreadCount})
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-900">
            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-slate-500 flex flex-col items-center gap-2">
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span>Calculando trânsitos no seu mapa...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => {
                const sev = getSeverityStyles(n.severity);
                const emoji = getPlanetEmoji(n.planet);
                return (
                  <div
                    key={n.id}
                    onClick={() => {
                      handleMarkSingleRead(n.id);
                      setSelectedNotification(n);
                    }}
                    className={`p-4 transition cursor-pointer hover:bg-slate-900/65 flex gap-3 text-left relative ${
                      !n.read ? 'bg-slate-950 border-l-2 border-amber-500' : ''
                    }`}
                  >
                    <div className="text-lg">{emoji}</div>
                    
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${sev.bg}`}>
                          {sev.badge}
                        </span>
                        <span className="text-[8px] font-mono text-slate-500">
                          {formatDate(n.date)}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-slate-200 line-clamp-1">
                        {n.title}
                      </h5>

                      <p className="text-[10px] text-slate-400 line-clamp-2">
                        {n.message}
                      </p>
                    </div>

                    {!n.read && (
                      <span className={`absolute right-4 top-4 w-2 h-2 rounded-full ${sev.dot}`} />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs font-mono text-slate-500">
                Nenhum sinal kármico raro detectado no céu hoje.
              </div>
            )}
          </div>

          {/* Footer view alignment explanation */}
          <div className="p-3 bg-slate-900/30 text-[9px] font-mono text-slate-500 text-center border-t border-slate-900">
            Alertas sintonizados com o Sol, Lua e Ascendente de nascimento.
          </div>
        </div>
      )}

      {/* Astro Alert Modal / Details Card Backdrop */}
      {selectedNotification && (
        <div id="astro-notification-modal-backdrop" className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-60 animate-in fade-in duration-200">
          <div 
            id="astro-notification-modal-container"
            className="w-full max-w-md bg-slate-950 border-2 border-amber-500/25 rounded-3xl p-6 shadow-3xl text-left space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden"
          >
            {/* Ambient background accent based on severity */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl -z-10" />

            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getPlanetEmoji(selectedNotification.planet)}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-205 font-sans">
                    {selectedNotification.title}
                  </h4>
                  <p className="text-[9px] font-mono text-slate-500">
                    Trânsito do Planeta: {selectedNotification.planet} ({selectedNotification.aspect})
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedNotification(null)}
                className="p-1 rounded bg-slate-900 hover:bg-slate-850 text-slate-450 hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4">
              {/* Alert Badge info */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[9px] font-mono text-amber-400 font-bold uppercase rounded">
                  Alinhamento Raro Natal
                </span>
                <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Alcança pico em: {formatDate(selectedNotification.date)}
                </span>
              </div>

              {/* Message */}
              <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
                {selectedNotification.message}
              </p>

              {/* Suggestions Box / Cosmic Ritual instructions */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-905 space-y-1.5">
                <h5 className="text-[10px] font-mono uppercase text-amber-450 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  Instruções de Sintonização Sagrada:
                </h5>
                <ul className="text-[10px] text-slate-400 font-sans space-y-1 pl-4 list-disc">
                  <li>Medite de costas para o Sol durante o pico do alinhamento celeste.</li>
                  <li>Invoque as forças arquetípicas de {selectedNotification.planet} para harmonização.</li>
                  <li>Consuma chás correspondentes e registre sonhos em seu jornal sagrado.</li>
                </ul>
              </div>
            </div>

            {/* Actions for Gamified Experience */}
            <div className="pt-3 border-t border-slate-900 flex justify-between items-center gap-4">
              <span className="text-[8px] font-mono text-slate-500 uppercase">
                Conexão Astral Ativa
              </span>

              {claimedBlessings.includes(selectedNotification.id) ? (
                <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/5 text-emerald-400 text-xs font-mono font-bold rounded-xl border border-emerald-500/20">
                  <Check className="w-3 h-3" />
                  Alinhamento Sintonizado! (+200 pts)
                </span>
              ) : (
                <button
                  onClick={() => handleClaimBlessing(selectedNotification)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-600 font-mono font-bold text-slate-950 rounded-xl hover:from-amber-450 hover:to-rose-550 transition text-xs cursor-pointer shadow-lg hover:shadow-rose-500/10 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Venerar & Sintonizar (+200 pts)
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
