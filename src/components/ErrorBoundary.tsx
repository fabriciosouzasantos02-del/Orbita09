import * as React from 'react';
import { AlertTriangle, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled runtime error:", error, errorInfo);
  }

  private handleResetAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        // Clear Orbi specific state to avoid deleting unrelated user data, but resolving any local corrupt states
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('orbi_') || key.startsWith('tarot_') || key === 'orbi_natal_chart_data' || key === 'orbi_numerology_data') {
            localStorage.removeItem(key);
          }
        });
        sessionStorage.clear();
        window.location.reload();
      }
    } catch (e) {
      window.location.reload();
    }
  };

  private handleReloadOnly = () => {
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-red-900/10 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-amber-900/10 blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-2xl w-full bg-[#0a1124]/90 border border-red-500/30 p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-300 uppercase font-sans">
                  Sinal Estelar Interrompido
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5 uppercase tracking-widest">
                  FALHA CRÍTICA DE RENDERIZAÇÃO / DETECTOR DE ERROS ÓRBITA
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-sans">
              Ocorreu uma instabilidade na recepção das efemérides ou no alinhamento do banco de dados local. 
              Isso pode ser causado por cache de tradução conflitante ou variáveis estatais corrompidas no navegador.
            </p>

            {this.state.error && (
              <div className="mb-6 p-4 bg-black/60 border border-slate-800 rounded-2xl font-mono text-xs text-red-300 max-h-60 overflow-y-auto leading-relaxed text-left">
                <p className="font-bold text-red-400 mb-2">Erro: {this.state.error.toString()}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={this.handleReloadOnly}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-black uppercase tracking-wider text-white rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-slate-400" />
                Recarregar Página
              </button>

              <button
                onClick={this.handleResetAndReload}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-amber-600 hover:from-red-400 hover:to-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Cache & Resetar Aplicativo
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono font-bold">
              <span className="flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                ORBITA-SHIELD V1.0
              </span>
              <span>UTC TIMESTICK ALIGNED</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
