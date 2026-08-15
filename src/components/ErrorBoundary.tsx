import * as React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught runtime error:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4 text-xl">
              ✨
            </div>
            <h2 className="text-xl font-bold mb-2 text-amber-300">Órbita 09 - Recarregar Portal</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Sua sessão celestial foi pausada. Clique no botão abaixo para restaurar o aplicativo com segurança.
            </p>
            <button 
              onClick={() => {
                try {
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()));
                  }
                  if ('caches' in window) {
                    caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
                  }
                } catch(e) {}
                window.location.href = window.location.pathname + '?reset=' + Date.now();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all text-sm cursor-pointer"
            >
              Restaurar Conexão Celestial
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
