import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <AlertTriangle size={40} />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black uppercase tracking-tighter italic italic italic italic">Something went wrong</h1>
              <p className="text-muted-foreground italic font-medium">
                Our AI concierge encountered an unexpected turbulence. We apologize for the inconvenience.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-muted rounded-xl text-left overflow-auto max-h-32">
                <code className="text-xs text-destructive font-mono">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={this.handleReset}
                className="flex-1 h-12 rounded-full font-bold uppercase tracking-widest text-xs gap-2"
              >
                <RefreshCcw size={16} /> Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="flex-1 h-12 rounded-full font-bold uppercase tracking-widest text-xs gap-2 border-2"
              >
                <Home size={16} /> Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
