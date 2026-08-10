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
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs text-center my-2">
          Módulo carregado com fallback seguro.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
