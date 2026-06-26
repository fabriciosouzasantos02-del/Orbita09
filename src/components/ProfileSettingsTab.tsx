import React, { useState } from "react";
import { User, Shield, Info, LogOut, Globe, Heart, RefreshCw, KeyRound } from "lucide-react";
import { Language, translations } from "../translations";
import { UserProfile } from "../types";
import { useTranslation } from "react-i18next";
import { translateUiText } from "../lib/translations";
import { useIdioma } from "../context/IdiomaContext";

interface ProfileSettingsTabProps {
  userProfile: UserProfile;
  lang: Language;
  setLang: (l: Language) => void;
  onLogout: () => void;
}

export default function ProfileSettingsTab({ userProfile, lang, setLang, onLogout }: ProfileSettingsTabProps) {
  const { mudarIdioma } = useIdioma();
  const [name, setName] = useState(userProfile.name);
  const [birthCity, setBirthCity] = useState(userProfile.birthDetails.birthCity);
  const [birthTime, setBirthTime] = useState(userProfile.birthDetails.birthTime);
  const [birthDate, setBirthDate] = useState(userProfile.birthDetails.birthDate);
  const [success, setSuccess] = useState(false);

  const t = translations[lang];
  const { t: tI18nRaw } = useTranslation();

  const tI18n = (text: string) => {
    if (!text) return "";
    const res = tI18nRaw(text);
    if (res === text || !res) {
      return translateUiText(text, lang || 'pt');
    }
    return res;
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    
    // Simulate updating profile in database/localStorage
    const updatedDetails = {
      ...userProfile,
      name,
      birthDetails: {
        name,
        birthDate,
        birthTime,
        birthCity
      }
    };
    
    localStorage.setItem("orbitanext_profile", JSON.stringify(updatedDetails));
    
    // Smooth reload to recalculate astro systems instantly across tabs!
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Description header */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-display font-semibold text-neutral-900">{t.profile}</h2>
        <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
          {tI18n("Inspecione as chaves criptográficas locais de seu mapa astral místico e gerencie as configurações de privacidade.")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Grid: Modify Born configurations */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-2">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-display font-semibold text-neutral-900 text-sm">{tI18n("Dados de Nascimento e Orbe")}</h3>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs sm:text-sm">
            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 font-semibold rounded-xl text-center">
                {tI18n("Dados atualizados com êxito! Recalculando coordenadas estelares...")}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-500">{t.name}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-500">{t.birthCity}</label>
                <input
                  type="text"
                  required
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition font-sans"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-500">{tI18n("Data de Nascimento")}</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-neutral-500">{tI18n("Horário exato")}</label>
                <input
                  type="time"
                  required
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3.5 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-900 border border-transparent hover:bg-neutral-800 text-white rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition shadow flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>{tI18n("Atualizar e Recalcular Mapa")}</span>
              </button>
            </div>
          </form>
        </section>

        {/* Right Grid: System controls, Theme selectors, Log out */}
        <section className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-sm md:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Theme language options cards */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-50 pb-2">{tI18n("Preferências Globais")}</h3>
            
            {/* Lang toggler widget */}
            <div className="space-y-1.5Col space-y-2">
              <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 block">{tI18n("Idioma do Oráculo")}</span>
              <div className="grid grid-cols-5 gap-1.5 text-xs">
                {(["pt", "en", "de", "es", "fr"] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      mudarIdioma(l as any);
                    }}
                    className={`py-1.5 border rounded-lg uppercase font-bold text-center transition cursor-pointer ${
                      lang === l 
                        ? "bg-neutral-900 text-white border-neutral-900" 
                        : "bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Security & Offline data disclaimer */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-100 flex gap-2.5 items-start">
            <Shield className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold text-[11px] text-neutral-800 block">{tI18n("Autenticação Segura Local")}</span>
              <p className="text-[10px] text-neutral-500">
                {tI18n("Seus diários de sonhos, oráculos de tarot e configurações são guardadas unicamente na caixa sandbox local do navegador do dispositivo para manter sigilo absoluto.")}
              </p>
            </div>
          </div>

          {/* Log out system button */}
          <div className="pt-4 border-t border-neutral-100">
            <button
              onClick={onLogout}
              className="w-full py-2 px-4 border border-rose-200/80 hover:bg-rose-50/50 text-rose-700 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>

        </section>

      </div>
    </div>
  );
}
