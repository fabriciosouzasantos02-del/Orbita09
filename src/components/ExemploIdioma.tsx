import React from 'react';
import { useIdioma, Idioma } from '../context/IdiomaContext';
import { translateUiText, Language } from '../lib/translations';

/**
 * Exemplo prático de como consumir a estrutura de internacionalização (i18n)
 * centralizada via Context API em qualquer componente funcional com React Hooks.
 */
export default function ExemploIdioma() {
  // Consumindo os valores e funções do IdiomaContext
  const { idioma, mudarIdioma, t } = useIdioma();

  const handleMudarIdioma = (novoIdioma: Idioma) => {
    // Atualiza o estado global de idioma instantaneamente para todo o app
    mudarIdioma(novoIdioma);
  };

  const tI18n = (text: string) => {
    return translateUiText(text, (idioma as Language) || 'pt');
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl max-w-md mx-auto space-y-6 text-slate-200 shadow-xl font-sans">
      {/* Título traduzido utilizando chaves fortemente tipadas do dicionário */}
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-amber-500 tracking-tight">
          {t('appName')}
        </h2>
        <p className="text-xs text-slate-400">
          {t('appSubtitle')}
        </p>
      </div>

      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {tI18n("Informações Ativas do Contexto:")}
        </p>
        <div className="text-xs space-y-1 font-mono text-amber-400/80">
          <p>{tI18n("• Idioma Ativo:")} <span className="text-white font-bold">{idioma.toUpperCase()}</span></p>
          <p>{tI18n("• Texto Traduzido:")} <span className="text-white font-bold">{t('welcomeBuscador')}</span></p>
        </div>
      </div>

      {/* Botões de Troca de Idioma demonstrando o uso da função mudarIdioma */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-slate-400">
          {t('languageSelectLabel')} (mudarIdioma)
        </label>
        
        <div className="grid grid-cols-5 gap-1">
          {(['pt', 'en', 'es', 'de', 'fr'] as Idioma[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleMudarIdioma(lang)}
              className={`py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                idioma === lang
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Exemplo de botão traduzido usando a função t */}
      <div className="pt-2 border-t border-slate-850 flex justify-between gap-2">
        <button className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-750 rounded-xl text-xs font-semibold text-slate-300 transition">
          {t('btnCancel')}
        </button>
        <button className="flex-1 py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-semibold transition">
          {t('btnSave')}
        </button>
      </div>
    </div>
  );
}
