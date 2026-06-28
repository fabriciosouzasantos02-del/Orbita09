import React, { useState } from "react";
import { Sparkles, Star, Globe, Clock, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { Language, translations } from "./translations";
import { BirthDetails, UserProfile } from "./types";
import { useTranslation } from "react-i18next";

interface WelcomeScreenProps {
  onAuthenticate: (profile: UserProfile) => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export default function WelcomeScreen({ onAuthenticate, lang, setLang }: WelcomeScreenProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[lang];
  const { t: tI18n } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg(t.invalidFields);
      return;
    }

    if (isSignUp && (!name || !birthDate || !birthTime || !birthCity)) {
      setErrorMsg(t.invalidFields);
      return;
    }

    setIsLoading(true);

    // Simulate authentic profile structure (and automatically calculate chart)
    setTimeout(() => {
      const birthDetails: BirthDetails = {
        name: isSignUp ? name : name || email.split("@")[0],
        birthDate: isSignUp ? birthDate : "1995-04-12", // generic fallback if signin
        birthTime: isSignUp ? birthTime : "12:00",
        birthCity: isSignUp ? birthCity : "São Paulo",
      };

      const mockUserProfile: UserProfile = {
        uid: "user_" + Math.random().toString(36).substr(2, 9),
        email,
        name: birthDetails.name,
        birthDetails,
        createdAt: new Date().toISOString()
      };

      setIsLoading(false);
      onAuthenticate(mockUserProfile);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const birthDetails: BirthDetails = {
        name: "Google Explorador",
        birthDate: "1994-08-25",
        birthTime: "08:30",
        birthCity: "Rio de Janeiro",
      };

      const mockUserProfile: UserProfile = {
        uid: "google_" + Math.random().toString(36).substr(2, 9),
        email: "google.user@gmail.com",
        name: birthDetails.name,
        birthDetails,
        createdAt: new Date().toISOString()
      };

      setIsLoading(false);
      onAuthenticate(mockUserProfile);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
      
      {/* Background Starry Particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-24 left-1/4 w-1.5 h-1.5 bg-violet-400 rounded-full animate-ping opacity-60" />
      <div className="absolute top-48 right-1/4 w-1 h-1 bg-teal-300 rounded-full animate-pulse opacity-70" />
      <div className="absolute bottom-36 left-1/3 w-0.5 h-0.5 bg-amber-200 rounded-full opacity-50" />

      <div className="relative w-full max-w-xl bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl transition hover:border-white/15">
        
        {/* Language Selection Header */}
        <div className="flex justify-end gap-2 mb-6 text-xs text-slate-400">
          {(["pt", "en", "de", "es", "fr"] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 rounded-md uppercase font-bold transition hover:text-white ${
                lang === l ? "bg-white/10 text-white" : ""
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Brand Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 mb-4"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </motion.div>
          
          <h1 className="text-3xl font-display font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h1>
          <p className="text-indigo-300/80 text-xs tracking-widest uppercase font-semibold mt-1">
            Orbita Next
          </p>
          <p className="text-slate-400 text-sm max-w-md mx-auto mt-3">
            {t.subtitle}
          </p>
        </div>

        {/* Normal Login/Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/20 text-rose-200 rounded-xl text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {isSignUp ? (
            /* Sign Up fields */
            <div className="space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.name}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder-slate-500 transition"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.email}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder-slate-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                    <Globe className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={birthCity}
                    onChange={(e) => setBirthCity(e.target.value)}
                    placeholder={t.birthCity}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder-slate-500 transition"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                    <Star className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder-slate-500 transition focus:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                    <Clock className="w-4 h-4" />
                  </span>
                  <input
                    type="time"
                    required
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder-slate-500 transition focus:text-white"
                  />
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.password}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder-slate-500 transition"
                  />
                </div>
              </div>

            </div>
          ) : (
            /* Sign In fields */
            <div className="space-y-3.5">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.email}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder-slate-500 transition"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.password}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 placeholder-slate-500 transition"
                />
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-indigo-600 font-semibold hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.signUp}</span>
              </>
            ) : (
              <span>{t.signIn}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center justify-between text-xs text-slate-500">
          <div className="w-full h-px bg-white/5" />
          <span className="px-3 whitespace-nowrap">{tI18n("ou")}</span>
          <div className="w-full h-px bg-white/5" />
        </div>

        {/* Google Authentication Button */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={isLoading}
          className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl text-xs transition flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
        >
          {/* Custom vector-looking G icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.743-.079-1.3-.176-1.857H12.24z" />
          </svg>
          <span>{t.googleLogin}</span>
        </button>

        {/* Switch Auth mode toggler */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition cursor-pointer"
          >
            {isSignUp ? t.haveAccount : t.needAccount}
          </button>
        </div>

        {/* Security / Terms reassurance badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400/60" />
          <span>{tI18n("Calculado 100% no próprio dispositivo de maneira privada e anônima.")}</span>
        </div>

      </div>
    </div>
  );
}
