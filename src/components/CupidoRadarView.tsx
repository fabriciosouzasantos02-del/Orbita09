import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getClientCupidoFallback } from '../lib/cupidoFallback';
import { 
  Heart, Sparkles, User, Calendar, Clock, MapPin, Trash, Edit2, Plus, 
  Activity, Star, ArrowRight, Compass, ShieldCheck, BookOpen, MessageSquare, 
  Smile, Send, Bell, X, Check, Save, Share2, HelpCircle, AlertCircle, ChevronRight,
  TrendingUp, Flame
} from 'lucide-react';
import { CityAutocomplete } from './CityAutocomplete';
import { getFirebaseAuth } from '../lib/firebase';
import { 
  saveCupidoPerson, 
  deleteCupidoPerson, 
  subscribeToCupidoPeople, 
  saveCupidoHistory, 
  loadCupidoHistory, 
  saveCupidoFavorite, 
  deleteCupidoFavorite, 
  loadCupidoFavorites, 
  saveCupidoSettings, 
  loadCupidoSettings,
  CupidoPerson,
  CupidoHistory,
  CupidoFavorite,
  CupidoSettings
} from '../lib/cupidoFirebase';

interface CupidoRadarViewProps {
  user: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthCity: string;
    email?: string;
    latitude?: number;
    longitude?: number;
  };
  lang?: string;
}

export function CupidoRadarView({ user, lang = 'pt' }: CupidoRadarViewProps) {
  const { t } = useTranslation();
  
  // ----------------------------------------------------
  // States
  // ----------------------------------------------------
  const [people, setPeople] = useState<CupidoPerson[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<CupidoPerson | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<CupidoPerson | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<CupidoFavorite[]>([]);
  const [history, setHistory] = useState<CupidoHistory[]>([]);
  const [settings, setSettings] = useState<CupidoSettings>({
    notifyNewRadar: true,
    notifyTransits: true,
    notifyFavorablePeriods: true
  });

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formBirthDate, setFormBirthDate] = useState('');
  const [formBirthTime, setFormBirthTime] = useState('12:00');
  const [formBirthCity, setFormBirthCity] = useState('');
  const [formGender, setFormGender] = useState('feminino');
  const [formUnknownTime, setFormUnknownTime] = useState(false);
  const [formBirthCoords, setFormBirthCoords] = useState<{ latitude?: number; longitude?: number } | null>(null);

  // Active radar view tab: 'radar' | 'linguagem' | 'estrategias' | 'compatibilidade' | 'linhaTempo' | 'fundamentacao' | 'favoritos' | 'ajustes'
  const [activeDashboardTab, setActiveDashboardTab] = useState('radar');
  const [radarData, setRadarData] = useState<any | null>(null);
  const [authUid, setAuthUid] = useState<string>('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Listen to Auth State changes to capture active UID and re-trigger subscriptions safely
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return auth.onAuthStateChanged((firebaseUser) => {
      setAuthUid(firebaseUser ? firebaseUser.uid : '');
    });
  }, []);

  // User's email as key for syncing
  const userEmail = user?.email || 'offline_user';

  // ----------------------------------------------------
  // Sync and Real-Time Subscriptions
  // ----------------------------------------------------
  useEffect(() => {
    if (!userEmail) return;

    // Real-time listener for people list
    const unsubscribePeople = subscribeToCupidoPeople(userEmail, (data) => {
      setPeople(data);
    });

    // Load History, Favorites and Settings
    const loadData = async () => {
      const favs = await loadCupidoFavorites(userEmail);
      setFavorites(favs);

      const hist = await loadCupidoHistory(userEmail);
      setHistory(hist);

      const sets = await loadCupidoSettings(userEmail);
      setSettings(sets);
    };

    loadData();

    return () => {
      unsubscribePeople();
    };
  }, [userEmail, authUid]);

  // Ref to prevent duplicate/concurrent generation loops
  const inFlightRef = useRef<string | null>(null);

  // Load selected person radar from cache/history or generate new
  useEffect(() => {
    if (!selectedPerson) {
      setRadarData(null);
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const targetId = `${selectedPerson.id}_${todayStr}_${lang}`;
    const cachedRadar = history.find(h => 
      h.id === targetId || 
      (lang === 'pt' && h.id === `${selectedPerson.id}_${todayStr}`)
    );

    if (cachedRadar) {
      setRadarData(cachedRadar.radarData);
      setLoading(false);
    } else {
      if (inFlightRef.current !== targetId) {
        handleGenerateRadar(selectedPerson, targetId);
      }
    }
  }, [selectedPerson, history, lang]);

  // ----------------------------------------------------
  // Actions
  // ----------------------------------------------------
  const handleOpenNewForm = () => {
    setEditingPerson(null);
    setFormName('');
    setFormBirthDate('');
    setFormBirthTime('12:00');
    setFormBirthCity('');
    setFormGender('feminino');
    setFormUnknownTime(false);
    setFormBirthCoords(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (person: CupidoPerson) => {
    setEditingPerson(person);
    setFormName(person.name);
    setFormBirthDate(person.birthDate);
    setFormBirthTime(person.birthTime || '12:00');
    setFormBirthCity(person.birthCity);
    setFormGender(person.gender || 'feminino');
    setFormUnknownTime(!!person.isUnknownTime);
    setFormBirthCoords({ latitude: person.latitude, longitude: person.longitude });
    setIsFormOpen(true);
  };

  const handleSavePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formBirthDate || !formBirthCity) {
      alert(t('fill_all_fields', { defaultValue: "Por favor, preencha todos os campos obrigatórios." }));
      return;
    }

    setLoading(true);
    const personId = editingPerson ? editingPerson.id : `person_${Date.now()}`;
    const newPerson: CupidoPerson = {
      id: personId,
      name: formName,
      birthDate: formBirthDate,
      birthTime: formUnknownTime ? undefined : formBirthTime,
      birthCity: formBirthCity,
      gender: formGender,
      isUnknownTime: formUnknownTime,
      latitude: formBirthCoords?.latitude,
      longitude: formBirthCoords?.longitude,
      createdAt: editingPerson ? editingPerson.createdAt : new Date().toISOString()
    };

    await saveCupidoPerson(userEmail, newPerson);
    setLoading(false);
    setIsFormOpen(false);
    setEditingPerson(null);
    
    // Auto-select newly saved person
    setSelectedPerson(newPerson);
  };

  const handleDeletePerson = async (personId: string, name: string) => {
    const confirmation = window.confirm(
      t('delete_person_confirm', { name, defaultValue: `Tem certeza que deseja excluir ${name}? Todos os históricos e análises dela serão perdidos permanentemente.` })
    );
    if (!confirmation) return;

    if (selectedPerson && selectedPerson.id === personId) {
      setSelectedPerson(null);
    }

    await deleteCupidoPerson(userEmail, personId);
  };

  const handleGenerateRadar = async (person: CupidoPerson, forcedTargetId?: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const targetId = forcedTargetId || `${person.id}_${todayStr}_${lang}`;

    if (inFlightRef.current === targetId && loading) return;
    inFlightRef.current = targetId;

    setLoading(true);
    setGeneratingId(person.id);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch("/api/cupido/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          user: {
            name: user.name,
            birthDate: user.birthDate,
            birthTime: user.birthTime || "12:00",
            birthCity: user.birthCity,
            latitude: user.latitude,
            longitude: user.longitude
          },
          person: {
            name: person.name,
            birthDate: person.birthDate,
            birthTime: person.birthTime || "12:00",
            birthCity: person.birthCity,
            gender: person.gender,
            isUnknownTime: person.isUnknownTime,
            latitude: person.latitude,
            longitude: person.longitude
          },
          lang
        })
      });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`API call failed with status ${response.status}`);

      const data = await response.json();
      if (data && data.radar) {
        setRadarData(data.radar);

        // Cache into history
        const newHistoryItem: CupidoHistory = {
          id: targetId,
          personId: person.id,
          date: todayStr,
          radarData: data.radar,
          createdAt: new Date().toISOString()
        };

        await saveCupidoHistory(userEmail, newHistoryItem);
        setHistory(prev => [newHistoryItem, ...prev.filter(h => h.id !== newHistoryItem.id)]);
      } else {
        throw new Error("No radar data in response");
      }
    } catch (err) {
      console.warn("[CupidoRadar] Using localized fallback due to API error or timeout:", err);
      const fallback = getClientCupidoFallback(user, person, lang);
      setRadarData(fallback);

      const fallbackHistoryItem: CupidoHistory = {
        id: targetId,
        personId: person.id,
        date: todayStr,
        radarData: fallback,
        createdAt: new Date().toISOString()
      };

      await saveCupidoHistory(userEmail, fallbackHistoryItem);
      setHistory(prev => [fallbackHistoryItem, ...prev.filter(h => h.id !== fallbackHistoryItem.id)]);
    } finally {
      setLoading(false);
      setGeneratingId(null);
      inFlightRef.current = null;
    }
  };

  const handleToggleFavorite = async (category: string, textContent: string) => {
    if (!selectedPerson) return;

    const existing = favorites.find(
      f => f.personId === selectedPerson.id && f.tipCategory === category && f.tipText === textContent
    );

    if (existing) {
      await deleteCupidoFavorite(userEmail, existing.id);
      setFavorites(prev => prev.filter(f => f.id !== existing.id));
      alert(t('favorite_removed', { defaultValue: "Dica removida dos favoritos!" }));
    } else {
      const newFav: CupidoFavorite = {
        id: `fav_${Date.now()}`,
        personId: selectedPerson.id,
        tipCategory: category,
        tipText: textContent,
        createdAt: new Date().toISOString()
      };
      await saveCupidoFavorite(userEmail, newFav);
      setFavorites(prev => [...prev, newFav]);
      alert(t('favorite_added', { defaultValue: "Dica adicionada aos favoritos!" }));
    }
  };

  const handleUpdateSettings = async (field: keyof CupidoSettings, val: boolean) => {
    const updated = { ...settings, [field]: val };
    setSettings(updated);
    await saveCupidoSettings(userEmail, updated);
  };

  // Helper: Zodiac Sign calculator
  const getZodiacSign = (dateStr: string): string => {
    if (!dateStr) return t('zodiac_unknown', { defaultValue: "Desconhecido" });
    try {
      const date = new Date(dateStr + "T00:00:00");
      const month = date.getMonth() + 1;
      const day = date.getDate();
      if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return t('zodiac_aquarius', { defaultValue: "Aquário" });
      if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return t('zodiac_pisces', { defaultValue: "Peixes" });
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return t('zodiac_aries', { defaultValue: "Áries" });
      if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return t('zodiac_taurus', { defaultValue: "Touro" });
      if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return t('zodiac_gemini', { defaultValue: "Gêmeos" });
      if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return t('zodiac_cancer', { defaultValue: "Câncer" });
      if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return t('zodiac_leo', { defaultValue: "Leão" });
      if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return t('zodiac_virgo', { defaultValue: "Virgem" });
      if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return t('zodiac_libra', { defaultValue: "Libra" });
      if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return t('zodiac_scorpio', { defaultValue: "Escorpião" });
      if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return t('zodiac_sagittarius', { defaultValue: "Sagitário" });
      return t('zodiac_capricorn', { defaultValue: "Capricórnio" });
    } catch {
      return t('zodiac_unknown', { defaultValue: "Desconhecido" });
    }
  };

  // Memoized lists of favorites for current selected person
  const currentPersonFavorites = useMemo(() => {
    if (!selectedPerson) return [];
    return favorites.filter(f => f.personId === selectedPerson.id);
  }, [selectedPerson, favorites]);

  return (
    <div id="cupido-radar-view" className="space-y-6 text-slate-100 max-w-7xl mx-auto font-sans relative">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-950/40 border border-rose-500/15 p-6 rounded-3xl relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="text-center md:text-left space-y-2 relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-400 animate-pulse">
              <Heart className="w-6 h-6 fill-rose-450" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-300 via-pink-400 to-amber-300 tracking-tight uppercase">
                {t('cupido_tab', { defaultValue: "Cupido Astrológico" })}
              </h1>
              <p className="text-xs font-mono font-medium text-rose-400 tracking-wider">
                {t('cupido_subtitle', { defaultValue: "Radar Afetivo & Direcionamento Amoroso" })}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            {t('cupido_intro_desc', { defaultValue: "Sintonize a sinastria dos astros, trânsitos diários e estratégias calculadas sob medida para se conectar de forma mística e profunda com sua pessoa de interesse." })}
          </p>
        </div>

        <button
          onClick={handleOpenNewForm}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-450 hover:to-pink-550 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition duration-300 shadow-[0_5px_15px_rgba(244,63,94,0.3)] hover:scale-102 cursor-pointer relative z-10"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>{t('register_new_person', { defaultValue: "Cadastrar Pessoa" })}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: saved people list & settings */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* People list Box */}
          <div className="p-5 bg-slate-900/80 border border-slate-850/80 rounded-3xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                {t('saved_people', { defaultValue: "Pessoas de Interesse" })}
              </span>
              <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-mono font-bold rounded-full">
                {people.length}
              </span>
            </div>

            {people.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-800 rounded-2xl space-y-3">
                <Heart className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500">
                  {t('no_people_registered', { defaultValue: "Nenhuma pessoa cadastrada ainda. Adicione alguém para iniciar a sintonização do Cupido!" })}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[350px] overflow-y-auto">
                {people.map((p) => {
                  const isSelected = selectedPerson?.id === p.id;
                  const signName = getZodiacSign(p.birthDate);
                  return (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedPerson(p)}
                      className={`group p-3 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-center justify-between ${
                        isSelected 
                          ? 'bg-gradient-to-r from-rose-950/30 to-pink-950/20 border-rose-500/40 shadow-lg' 
                          : 'bg-slate-950/40 border-slate-850/60 hover:border-slate-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-black transition-colors ${isSelected ? 'text-rose-400' : 'text-slate-200 group-hover:text-slate-100'}`}>
                            {p.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded-md font-mono">
                            {signName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {p.birthDate}</span>
                          {p.birthTime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {p.birthTime}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleOpenEditForm(p); }}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition"
                          title={t("Editar")}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePerson(p.id, p.name); }}
                          className="p-1.5 hover:bg-rose-950/50 rounded-lg text-rose-500/80 hover:text-rose-400 transition"
                          title={t("Excluir")}
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Explainer Panel */}
          <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-850 rounded-3xl space-y-3 text-left">
            <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              {t('dynamic_astral_sync', { defaultValue: "Sincronia Astral Dinâmica" })}
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('dynamic_astral_sync_desc', { defaultValue: "O radar afetivo cruza a posição de Vênus, Marte e a Lua de ambos os mapas de nascimento, integrando-os com os trânsitos lunares atuais. Os resultados mudam diariamente de acordo com o ritmo das estrelas." })}
            </p>
          </div>

        </div>

        {/* Right Side: radar details / form */}
        <div className="lg:col-span-8">
          
          {/* A. FORM: ADD/EDIT PERSON */}
          {isFormOpen && (
            <div className="p-6 bg-slate-900/95 border border-rose-500/20 rounded-3xl shadow-2xl space-y-6 text-left animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-sm font-black font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <Heart className="w-4 h-4 fill-rose-500/30 text-rose-400" />
                  {editingPerson ? t('edit_pair_profile', { defaultValue: "Editar Perfil do Par" }) : t('register_new_pair', { defaultValue: "Cadastrar Novo Par Afetivo" })}
                </span>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePerson} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase">{t('full_name', { defaultValue: "Nome Completo" })}</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      required
                      placeholder={t('placeholder_name', { defaultValue: "Ex: Clara Silva" })}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/60 rounded-xl border border-slate-850 focus:border-rose-500/50 outline-none text-xs transition font-sans text-slate-200"
                    />
                  </div>
                </div>

                {/* Birth Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase">{t('birth_date', { defaultValue: "Data de Nascimento" })}</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="date" 
                      required
                      value={formBirthDate}
                      onChange={(e) => setFormBirthDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/60 rounded-xl border border-slate-850 focus:border-rose-500/50 outline-none text-xs transition font-sans text-slate-200"
                    />
                  </div>
                </div>

                {/* Birth Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase flex justify-between">
                    <span>{t('birth_time', { defaultValue: "Hora de Nascimento" })}</span>
                    <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={formUnknownTime}
                        onChange={(e) => setFormUnknownTime(e.target.checked)}
                        className="rounded border-slate-800 text-rose-550 focus:ring-rose-500 bg-slate-950"
                      />
                      <span>{t('unknown_time', { defaultValue: "Não sei" })}</span>
                    </label>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input 
                      type="time" 
                      disabled={formUnknownTime}
                      value={formBirthTime}
                      onChange={(e) => setFormBirthTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-950/60 rounded-xl border border-slate-850 focus:border-rose-500/50 outline-none text-xs transition font-sans text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Birth City Autocomplete */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase">{t('birth_city', { defaultValue: "Cidade de Nascimento" })}</label>
                  <CityAutocomplete 
                    value={formBirthCity}
                    onChange={(val) => setFormBirthCity(val)}
                    onSelectCity={(city) => {
                      setFormBirthCity(city.label);
                      setFormBirthCoords({ latitude: city.latitude, longitude: city.longitude });
                    }}
                    placeholder={t('city_placeholder', { defaultValue: "Cidade e Estado/País..." })}
                    inputClassName="w-full py-3 bg-slate-950/60 rounded-xl border border-slate-850 focus:border-rose-500/50 outline-none text-xs transition text-slate-200"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 font-mono uppercase">{t('gender_profile', { defaultValue: "Gênero / Perfil" })}</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 rounded-xl border border-slate-850 focus:border-rose-500/50 outline-none text-xs transition font-sans text-slate-200"
                  >
                    <option value="feminino">{t('gender_female', { defaultValue: "Feminino" })}</option>
                    <option value="masculino">{t('gender_male', { defaultValue: "Masculino" })}</option>
                    <option value="outro">{t('gender_other', { defaultValue: "Outro / Neutro" })}</option>
                  </select>
                </div>

                {formUnknownTime && (
                  <div className="md:col-span-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2 text-[10.5px] text-amber-300/85">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{t('time_help_text', { defaultValue: "Sem o horário de nascimento, alguns cálculos secundários serão aproximados, mas a compatibilidade continuará altamente relevante." })}</p>
                  </div>
                )}

                <div className="md:col-span-2 pt-4 border-t border-slate-850/60 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    {t('cancel', { defaultValue: "Cancelar" })}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-450 hover:to-pink-550 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{loading ? t('saving', { defaultValue: "Salvando..." }) : t('save_person', { defaultValue: "Salvar Perfil" })}</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* B. MAIN DISPLAY: SELECTED PERSON RADAR PANEL */}
          {!isFormOpen && selectedPerson && (
            <div className="space-y-6 animate-in fade-in duration-300 text-left">
              
              {/* Radar Sub Tabs Bar */}
              <div className="flex flex-wrap gap-1 bg-slate-950/60 p-1 rounded-2xl border border-slate-850/80">
                {[
                  { id: 'radar', label: t('radar_of_the_day', { defaultValue: 'Radar do Dia' }), icon: Activity },
                  { id: 'linguagem', label: t('affective_language', { defaultValue: 'Linguagem Afetiva' }), icon: MessageSquare },
                  { id: 'estrategias', label: t('personalized_strategies', { defaultValue: 'Estratégias' }), icon: Star },
                  { id: 'compatibilidade', label: t('energetic_compatibility', { defaultValue: 'Compatibilidade' }), icon: Compass },
                  { id: 'favoritos', label: t('favorites', { defaultValue: 'Favoritos' }), icon: ShieldCheck },
                  { id: 'ajustes', label: t('notifications_settings', { defaultValue: 'Ajustes' }), icon: Bell }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isTabSelected = activeDashboardTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveDashboardTab(tab.id)}
                      className={`flex-1 min-w-[100px] px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer ${
                        isTabSelected 
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Loader */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-950/30 rounded-3xl border border-slate-850/60 text-slate-500 space-y-4">
                  <Heart className="w-10 h-10 text-rose-500 animate-pulse fill-rose-500/20" />
                  <p className="text-xs font-mono max-w-xs text-center text-rose-400">
                    {t('generating_radar', { defaultValue: "Cupido está sintonizando as frequências e trânsitos de amor hoje..." })}
                  </p>
                </div>
              )}

              {/* Selected Tab Panels */}
              {!loading && radarData && (
                <div className="space-y-6">
                  
                  {/* TAB: RADAR DO DIA */}
                  {activeDashboardTab === 'radar' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* Top stats grid */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Approach potential card */}
                        <div className="md:col-span-4 bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/[0.03] rounded-full blur-2xl pointer-events-none" />
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">{t('approach_potential', { defaultValue: "Potencial de Aproximação" })}</span>
                          <div className="relative">
                            <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-md" />
                            <div className="relative w-24 h-24 rounded-full border-4 border-rose-500/30 flex items-center justify-center">
                              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-500 font-sans tracking-tighter">
                                {radarData.radarDoDia?.potencialAproximacao || "80"}%
                              </span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-rose-400 font-mono uppercase bg-rose-500/5 border border-rose-500/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
                            {t('very_high_today', { defaultValue: "Altíssimo Hoje" })}
                          </span>
                        </div>

                        {/* Ritual bento header */}
                        <div className="md:col-span-8 bg-gradient-to-br from-rose-950/20 to-slate-900/80 border border-slate-850 p-5 rounded-3xl relative overflow-hidden space-y-3 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                                {t('ritual_of_the_day', { defaultValue: "Ritual do Dia de Aproximação" })}
                              </span>
                              <button 
                                onClick={() => handleToggleFavorite('ritual', radarData.radarDoDia?.ritual)}
                                className="p-1.5 bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-750 rounded-xl text-slate-400 transition"
                                title={t('save_tip_favorites', { defaultValue: "Salvar dica nos favoritos" })}
                              >
                                <Star className={`w-3.5 h-3.5 ${favorites.some(f => f.tipText === radarData.radarDoDia?.ritual) ? 'fill-amber-450 text-amber-450' : ''}`} />
                              </button>
                            </div>
                            <p className="text-xs text-slate-200 leading-relaxed italic">
                              "{radarData.radarDoDia?.ritual || "Puxe assunto com leveza..."}"
                            </p>
                          </div>
                          <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-850/60 flex items-start gap-2 text-[10.5px] text-slate-400 font-sans">
                            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <p>{radarData.radarDoDia?.energiaGeral || "Sinergia favorável para conversas leves de harmonia solar."}</p>
                          </div>
                        </div>
                      </div>

                      {/* Details Bento Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Favorable times */}
                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-rose-400" />
                            {t('favorable_times', { defaultValue: "Horários Favoráveis" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.radarDoDia?.momentosFavoraveis}</p>
                        </div>

                        {/* Patience moments */}
                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                            {t('moments_patience', { defaultValue: "Momentos para Paciência" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.radarDoDia?.momentosPaciencia}</p>
                        </div>

                        {/* Harmony Points */}
                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            {t('harmony_points', { defaultValue: "Pontos de Harmonia" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.radarDoDia?.pontosHarmonia}</p>
                        </div>

                        {/* Tension points */}
                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                            <Activity className="w-4 h-4 text-red-400 animate-pulse" />
                            {t('tension_points', { defaultValue: "Fatores de Atenção/Tensão" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.radarDoDia?.pontosTensao}</p>
                        </div>

                        {/* Emotional climate */}
                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <Smile className="w-4 h-4 text-indigo-400" />
                            {t('emotional_climate', { defaultValue: "Clima Emocional Dela(e)" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.radarDoDia?.climaEmocional}</p>
                        </div>

                        {/* Social networks action */}
                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-pink-400 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-pink-400" />
                            {t('social_media_action', { defaultValue: "Redes Sociais (Como Interagir)" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.radarDoDia?.acaoRedesSociais}</p>
                        </div>

                      </div>

                      {/* Best Attitudes & Avoid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Best attitudes */}
                        <div className="p-5 bg-emerald-950/10 border border-emerald-500/15 rounded-3xl space-y-3 text-left">
                          <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            {t('best_attitudes', { defaultValue: "Melhores Atitudes Hoje" })}
                          </span>
                          <ul className="space-y-2 text-xs text-slate-300">
                            {radarData.radarDoDia?.melhoresAtitudes?.map((at: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                                <span>{at}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Avoid attitudes */}
                        <div className="p-5 bg-red-950/10 border border-red-500/15 rounded-3xl space-y-3 text-left">
                          <span className="text-[10px] font-mono font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                            <X className="w-4 h-4 text-red-400" />
                            {t('attitudes_avoid', { defaultValue: "Atitudes a Evitar Hoje" })}
                          </span>
                          <ul className="space-y-2 text-xs text-slate-300">
                            {radarData.radarDoDia?.atitudesEvitar?.map((at: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                                <span>{at}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>

                      {/* Surprise & Invitation Suggestion */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="p-5 bg-slate-900/80 border border-slate-850/80 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-400" />
                            {t('how_to_surprise', { defaultValue: "Como Surpreender" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.radarDoDia?.comoSurpreender}</p>
                        </div>

                        <div className="p-5 bg-slate-900/80 border border-slate-850/80 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                            <Compass className="w-4 h-4 text-rose-400" />
                            {t('invitation_suggestion', { defaultValue: "Sugestão de Convite / Local" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.radarDoDia?.sugestaoConvite}</p>
                        </div>

                      </div>

                      {/* Astrological Explanation Section */}
                      <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-850 rounded-3xl space-y-3">
                        <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-rose-400" />
                          {t('astrological_explanation', { defaultValue: "Fundamentação Astrológica" })}
                        </span>
                        <p className="text-xs text-slate-450 leading-relaxed font-sans italic">
                          {radarData.explicacaoAstrologica?.fundamentacao || "Calculado com base na posição da Lua em relação à Vênus natal."}
                        </p>
                      </div>

                    </div>
                  )}

                  {/* TAB: LINGUAGEM AFETIVA */}
                  {activeDashboardTab === 'linguagem' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                      {[
                        { title: t('how_to_show_affection', { defaultValue: "Como Demonstrar Carinho" }), text: radarData.linguagemAfetiva?.demonstrarCarinho, icon: Heart, color: 'text-rose-400', keyName: 'demonstrarCarinho' },
                        { title: t('conversation_starters', { defaultValue: "Ganchos para Iniciar Conversas" }), text: radarData.linguagemAfetiva?.iniciarConversas, icon: MessageSquare, color: 'text-indigo-400', keyName: 'iniciarConversas' },
                        { title: t('compatible_compliments', { defaultValue: "Elogios mais Compatíveis" }), text: radarData.linguagemAfetiva?.elogiosCompativeis, icon: Smile, color: 'text-amber-400', keyName: 'elogiosCompativeis' },
                        { title: t('preferred_communication_style', { defaultValue: "Estilo de Comunicação Preferido" }), text: radarData.linguagemAfetiva?.estiloComunicacao, icon: Star, color: 'text-cyan-400', keyName: 'estiloComunicacao' },
                        { title: t('ideal_environments_outings', { defaultValue: "Ambientes & Passeios Ideais" }), text: radarData.linguagemAfetiva?.ambientesFavoraveis, icon: Compass, color: 'text-emerald-400', keyName: 'ambientesFavoraveis' },
                        { title: t('activities_for_tuning', { defaultValue: "Atividades para Criar Sintonias" }), text: radarData.linguagemAfetiva?.atividadesComum, icon: Activity, color: 'text-pink-400', keyName: 'atividadesComum' },
                        { title: t('gifts_heart_touching', { defaultValue: "Presentes que Tocam o Coração" }), text: radarData.linguagemAfetiva?.presentesCompativeis, icon: ShieldCheck, color: 'text-purple-400', keyName: 'presentesCompativeis' },
                        { title: t('favorite_romantic_experiences', { defaultValue: "Experiências Românticas Favoritas" }), text: radarData.linguagemAfetiva?.experienciasRomanticas, icon: Sparkles, color: 'text-yellow-450 animate-pulse', keyName: 'experienciasRomanticas' }
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3 relative">
                            <div className="flex justify-between items-start">
                              <span className={`text-[10px] font-mono font-black ${item.color} uppercase tracking-widest flex items-center gap-2`}>
                                <Icon className={`w-4 h-4 ${item.color}`} />
                                {item.title}
                              </span>
                              <button 
                                onClick={() => handleToggleFavorite(item.keyName, item.text)}
                                className="p-1.5 bg-slate-800/80 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-750 rounded-xl text-slate-400 transition"
                              >
                                <Star className={`w-3.5 h-3.5 ${favorites.some(f => f.tipText === item.text) ? 'fill-amber-450 text-amber-450' : ''}`} />
                              </button>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.text}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TAB: ESTRATÉGIAS */}
                  {activeDashboardTab === 'estrategias' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-rose-400" />
                            {t('best_contact_time', { defaultValue: "Melhor Horário de Contato Recorrente" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.estrategiasPersonalizadas?.melhorHorario}</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-purple-400 uppercase tracking-widest flex items-center gap-2">
                            <Star className="w-4 h-4 text-purple-400 animate-pulse" />
                            {t('recommended_posture_energy', { defaultValue: "Postura e Energia do Usuário Recomendada" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.estrategiasPersonalizadas?.melhorEnergia}</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                            <Smile className="w-4 h-4 text-indigo-400" />
                            {t('suggested_presence_formula', { defaultValue: "Fórmula de Presença Sugerida" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.estrategiasPersonalizadas?.posturaRecomendada}</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-cyan-400" />
                            {t('subjects_immediate_spark', { defaultValue: "Assuntos que Geram Faísca Imediata" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.estrategiasPersonalizadas?.assuntosConexao}</p>
                        </div>

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="p-5 bg-emerald-950/10 border border-emerald-500/15 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            {t('long_term_favorable_attitudes', { defaultValue: "Atitudes Favoráveis a Longo Prazo" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.estrategiasPersonalizadas?.atitudesFavoraveis}</p>
                        </div>

                        <div className="p-5 bg-red-950/10 border border-red-500/15 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                            <X className="w-4 h-4 text-red-400" />
                            {t('avoid_friction_behaviors', { defaultValue: "Evite Estes Comportamentos de Atrito" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.estrategiasPersonalizadas?.comportamentosAtrito}</p>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* TAB: COMPATIBILIDADE */}
                  {activeDashboardTab === 'compatibilidade' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        
                        {/* Circle percent */}
                        <div className="md:col-span-4 bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl flex flex-col items-center justify-center text-center space-y-3">
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">{t('compatibility_level', { defaultValue: "Nível de Afinidade" })}</span>
                          <div className="relative">
                            <div className="absolute inset-0 bg-rose-500/15 rounded-full blur-md" />
                            <div className="relative w-28 h-28 rounded-full border-4 border-amber-500/30 flex items-center justify-center">
                              <span className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-rose-500 font-sans tracking-tighter">
                                {radarData.compatibilidadeEnergetica?.nivelAfinidade || "85"}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="md:col-span-8 bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3 flex flex-col justify-center min-h-[160px]">
                          <span className="text-[10px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                            <Compass className="w-4 h-4 text-rose-400" />
                            {t('areas_of_harmony', { defaultValue: "Áreas de Sintonia e Sinergias" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.compatibilidadeEnergetica?.areasSintonia}</p>
                        </div>

                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                            <User className="w-4 h-4 text-amber-500" />
                            {t('important_differences', { defaultValue: "Diferenças Importantes" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.compatibilidadeEnergetica?.diferencasImportantes}</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400" />
                            {t('potential_challenges', { defaultValue: "Potenciais Desafios" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.compatibilidadeEnergetica?.potenciaisDesafios}</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-850/80 p-5 rounded-3xl space-y-3">
                          <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            {t('growth_opportunities', { defaultValue: "Oportunidades de Crescimento" })}
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.compatibilidadeEnergetica?.oportunidadesCrescimento}</p>
                        </div>

                      </div>

                      {/* Timeline */}
                      <div className="bg-slate-900/80 border border-slate-850/80 p-6 rounded-3xl space-y-6">
                        <span className="text-[11px] font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-3">
                          <Calendar className="w-4 h-4 text-rose-400" />
                          {t('astrological_timeline', { defaultValue: "Linha do Tempo de Sintonia" })}
                        </span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          <div className="space-y-2 text-left relative pl-4 border-l-2 border-rose-500/25">
                            <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-wider block">{t('next_24_hours', { defaultValue: "Nas Próximas 24 Horas" })}</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.linhaTempo?.hoje}</p>
                          </div>

                          <div className="space-y-2 text-left relative pl-4 border-l-2 border-pink-500/25">
                            <span className="text-[9px] font-mono font-bold text-pink-400 uppercase tracking-wider block">{t('next_7_days', { defaultValue: "Próximos 7 Dias" })}</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.linhaTempo?.proximos7dias}</p>
                          </div>

                          <div className="space-y-2 text-left relative pl-4 border-l-2 border-amber-500/25">
                            <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-wider block">{t('next_30_days', { defaultValue: "Próximos 30 Dias" })}</span>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans">{radarData.linhaTempo?.proximos30dias}</p>
                          </div>

                        </div>
                      </div>

                    </div>
                  )}

                  {/* TAB: FAVORITOS */}
                  {activeDashboardTab === 'favoritos' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-xs font-mono font-black text-rose-400 uppercase tracking-widest flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-rose-400" />
                          {t('favorite_tips_for', { name: selectedPerson.name, defaultValue: "Dicas Favoritas para {{name}}" })}
                        </span>
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 text-[10px] font-mono rounded-full font-bold">
                          {currentPersonFavorites.length}
                        </span>
                      </div>

                      {currentPersonFavorites.length === 0 ? (
                        <div className="text-center py-12 px-6 border border-slate-850/80 rounded-3xl space-y-3 bg-slate-950/20">
                          <Star className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                          <p className="text-xs text-slate-500 max-w-sm mx-auto">
                            {t('no_favorites_saved', { defaultValue: "Nenhuma dica ou ritual favorito salvo ainda. Clique na estrela ao lado de qualquer sugestão no Radar ou Linguagem Afetiva para guardá-la aqui!" })}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentPersonFavorites.map((fav) => (
                            <div key={fav.id} className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl text-left flex flex-col justify-between gap-3 relative">
                              <div className="space-y-1.5">
                                <span className="text-[8.5px] font-mono font-bold text-amber-400 uppercase tracking-widest px-1.5 py-0.5 bg-slate-850 rounded-md">
                                  {fav.tipCategory}
                                </span>
                                <p className="text-xs text-slate-300 leading-relaxed font-sans italic">"{fav.tipText}"</p>
                              </div>
                              <button
                                onClick={() => handleToggleFavorite(fav.tipCategory, fav.tipText)}
                                className="self-end text-[10px] font-mono font-bold text-rose-500 hover:text-rose-400 transition"
                              >
                                {t('remove_favorite', { defaultValue: "Remover favorito" })}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB: AJUSTES */}
                  {activeDashboardTab === 'ajustes' && (
                    <div className="p-6 bg-slate-900/80 border border-slate-850/80 rounded-3xl space-y-6 text-left animate-in fade-in duration-300">
                      <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-mono font-black text-rose-400 uppercase tracking-widest">
                          {t('cupido_notifications', { defaultValue: "Notificações do Cupido" })}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {[
                          { key: 'notifyNewRadar', title: t('notify_new_radar_title', { defaultValue: "Novo Radar Diário" }), desc: t('notify_new_radar_desc', { defaultValue: "Notificar-me quando um novo Radar Cósmico estiver sintonizado e disponível." }) },
                          { key: 'notifyTransits', title: t('notify_transits_title', { defaultValue: "Flutuações Celestes" }), desc: t('notify_transits_desc', { defaultValue: "Notificar-me quando o humor místico dela(e) sofrer alterações devido a novos trânsitos lunares." }) },
                          { key: 'notifyFavorablePeriods', title: t('notify_favorable_title', { defaultValue: "Janelas Perfeitas de Aproximação" }), desc: t('notify_favorable_desc', { defaultValue: "Avisar-me imediatamente se houver períodos de altíssimo potencial de conexão hoje." }) }
                        ].map((item) => (
                          <div key={item.key} className="flex justify-between items-start gap-4">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-slate-200">{item.title}</span>
                              <p className="text-[10.5px] text-slate-500 leading-normal">{item.desc}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                              <input 
                                type="checkbox" 
                                checked={(settings as any)[item.key]}
                                onChange={(e) => handleUpdateSettings(item.key as any, e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-slate-950 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-450 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500 after:bg-slate-800 peer-checked:after:bg-slate-950" />
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-850/60 p-3 bg-rose-500/5 rounded-2xl border border-rose-500/10 flex items-start gap-2 text-[10.5px] text-rose-355">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        <p>{t('portal_orbita_warning', { defaultValue: "O Portal Órbita utiliza canais de baixa latência e caches offline para garantir que esses alertas rodem com extrema economia de bateria e total conformidade com seu Android." })}</p>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* No selected person / Not generated */}
              {!loading && !radarData && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-950/20 rounded-3xl border border-slate-850/60 text-slate-500 space-y-4">
                  <Heart className="w-10 h-10 text-rose-500/20" />
                  <p className="text-xs text-slate-500">{t('select_person_or_tune', { defaultValue: "Selecione uma pessoa de interesse ou sintonize o radar do dia." })}</p>
                </div>
              )}

            </div>
          )}

          {/* C. EMPTY STATE: NO PERSON SELECTED */}
          {!isFormOpen && !selectedPerson && (
            <div className="p-8 bg-slate-900/60 border border-slate-850/80 rounded-3xl text-center space-y-4 py-16">
              <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 inline-block text-rose-400/80">
                <Heart className="w-8 h-8 fill-rose-500/10" />
              </div>
              <h2 className="text-sm font-black font-mono uppercase tracking-wider text-rose-400">{t('cupido_channel', { defaultValue: "Canal do Cupido Astral" })}</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {t('no_pair_selected_desc', { defaultValue: "Nenhum par amoroso selecionado. Adicione uma pessoa de interesse à sua lista cósmica ou selecione uma existente para abrir o painel." })}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
