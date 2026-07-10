import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

// Wraps the routed pages so that if one page throws (e.g. a missing config
// value, a bad import, a bug in a modal), the user sees a small recoverable
// error screen instead of a frozen/blank app with no way forward.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // eslint-disable-next-line no-console
    console.error("[Otechy MW] Page crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-3">
          <p className="font-black text-lg">Something went wrong</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            This page hit an error and couldn't load. Try again, or go back home.
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => this.setState({ error: null })}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-red-500/30 active:scale-95"
            >
              Try again
            </button>
            <button
              onClick={() => { this.setState({ error: null }); window.location.assign("/"); }}
              className="border border-border text-sm font-bold px-4 py-2 rounded-xl active:scale-95"
            >
              Go home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
