import React, { useState } from "react";
import { User, Shield, Info, LogOut, Globe, Heart, RefreshCw, KeyRound } from "lucide-react";
import { Language, translations } from "../translations";
import { UserProfile } from "../types";
import { useTranslation } from "react-i18next";
import { translateUiText } from "../lib/translations";
import { useIdioma } from "../context/IdiomaContext";

const LOCAL_SETTINGS_TRANSLATIONS: Record<Language, Record<string, string>> = {
  pt: {
    "Inspecione as chaves criptográficas locais de seu mapa astral místico e gerencie as configurações de privacidade.": "Inspecione as chaves criptográficas locais de seu mapa astral místico e gerencie as configurações de privacidade.",
    "Dados de Nascimento e Orbe": "Dados de Nascimento e Orbe",
    "Dados atualizados com êxito! Recalculando coordenadas estelares...": "Dados atualizados com êxito! Recalculando coordenadas estelares...",
    "Data de Nascimento": "Data de Nascimento",
    "Horário exato": "Horário exato",
    "Atualizar e Recalcular Mapa": "Atualizar e Recalcular Mapa",
    "Preferências Globais": "Preferências Globais",
    "Idioma do Oráculo": "Idioma do Oráculo",
    "Autenticação Segura Local": "Autenticação Segura Local",
    "Seus diários de sonhos, oráculos de tarot e configurações são guardadas unicamente na caixa sandbox local do navegador do dispositivo para manter sigilo absoluto.": "Seus diários de sonhos, oráculos de tarot e configurações são guardadas unicamente na caixa sandbox local do navegador do dispositivo para manter sigilo absoluto."
  },
  en: {
    "Inspecione as chaves criptográficas locais de seu mapa astral místico e gerencie as configurações de privacidade.": "Inspect the local cryptographic keys of your mystical birth chart and manage privacy settings.",
    "Dados de Nascimento e Orbe": "Birth Data and Orb",
    "Dados atualizados com êxito! Recalculando coordenadas estelares...": "Data successfully updated! Recalculating stellar coordinates...",
    "Data de Nascimento": "Birth Date",
    "Horário exato": "Exact Time",
    "Atualizar e Recalcular Mapa": "Update and Recalculate Chart",
    "Preferências Globais": "Global Preferences",
    "Idioma do Oráculo": "Oracle Language",
    "Autenticação Segura Local": "Secure Local Authentication",
    "Seus diários de sonhos, oráculos de tarot e configurações são guardadas unicamente na caixa sandbox local do navegador do dispositivo para manter sigilo absoluto.": "Your dream journals, tarot oracles, and settings are saved solely in the device's local browser sandbox to maintain absolute privacy."
  },
  es: {
    "Inspecione as chaves criptográficas locais de seu mapa astral místico e gerencie as configurações de privacidade.": "Inspeccione las claves criptográficas locales de su carta astral mística y gestione la configuración de privacidad.",
    "Dados de Nascimento e Orbe": "Datos de Nacimiento y Orbe",
    "Dados atualizados com êxito! Recalculando coordenadas estelares...": "¡Datos actualizados con éxito! Recalculando coordenadas estelares...",
    "Data de Nascimento": "Fecha de Nacimiento",
    "Horário exato": "Hora exacta",
    "Atualizar e Recalcular Mapa": "Actualizar y Recalcular Carta",
    "Preferências Globais": "Preferencias Globales",
    "Idioma do Oráculo": "Idioma del Oráculo",
    "Autenticação Segura Local": "Autenticación Segura Local",
    "Seus diários de sonhos, oráculos de tarot e configurações são guardadas unicamente na caixa sandbox local do navegador do dispositivo para manter sigilo absoluto.": "Sus diarios de sueños, oráculos de tarot y configuraciones se guardan únicamente en la caja de arena local del navegador del dispositivo para mantener absoluta privacidad."
  },
  de: {
    "Inspecione as chaves criptográficas locais de seu mapa astral místico e gerencie as configurações de privacidade.": "Überprüfen Sie die lokalen kryptografischen Schlüssel Ihres mystischen Geburtshoroskops und verwalten Sie die Datenschutzeinstellungen.",
    "Dados de Nascimento e Orbe": "Geburtsdaten und Orbis",
    "Dados atualizados com êxito! Recalculando coordenadas estelares...": "Daten erfolgreich aktualisiert! Sternenkoordinaten werden neu berechnet...",
    "Data de Nascimento": "Geburtsdatum",
    "Horário exato": "Genaue Uhrzeit",
    "Atualizar e Recalcular Mapa": "Horoskop aktualisieren und neu berechnen",
    "Preferências Globais": "Globale Einstellungen",
    "Idioma do Oráculo": "Sprache des Orakels",
    "Autenticação Segura Local": "Sichere lokale Authentifizierung",
    "Seus diários de sonhos, oráculos de tarot e configurações são guardadas unicamente na caixa sandbox local do navegador do dispositivo para manter sigilo absoluto.": "Ihre Traumtagebücher, Tarot-Orakel und Einstellungen werden ausschließlich in der lokalen Browser-Sandbox des Geräts gespeichert, um absolute Vertraulichkeit zu gewährleisten."
  },
  fr: {
    "Inspecione as chaves criptográficas locais de seu mapa astral místico e gerencie as configurações de privacidade.": "Inspectez les clés cryptographiques locales de votre carte du ciel mystique et gérez les paramètres de confidentialité.",
    "Dados de Nascimento e Orbe": "Données de Naissance et Orbe",
    "Dados atualizados com êxito! Recalculando coordenadas estelares...": "Données mises à jour avec succès ! Recalcul des coordonnées stellaires...",
    "Data de Nascimento": "Date de Naissance",
    "Horário exato": "Heure exacte",
    "Atualizar e Recalcular Mapa": "Mettre à jour et Recalculer la Carte",
    "Preferências Globais": "Préférences Globales",
    "Idioma do Oráculo": "Langue de l'Oracle",
    "Autenticação Segura Local": "Authentification Sécurisée Locale",
    "Seus diários de sonhos, oráculos de tarot e configurações são guardadas unicamente na caixa sandbox local do navegador do dispositivo para manter sigilo absoluto.": "Vos journaux de rêves, oracles de tarot et paramètres sont enregistrés uniquement dans le bac à sable local du navigateur de l'appareil afin de maintenir une confidentialité absolue."
  }
};

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
    const localDict = LOCAL_SETTINGS_TRANSLATIONS[lang];
    if (localDict && localDict[text]) {
      return localDict[text];
    }
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
