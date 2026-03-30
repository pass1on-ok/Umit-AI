import * as React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled error caught by ErrorBoundary:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] w-full max-w-4xl mx-auto flex items-center justify-center px-6 py-12">
          <Alert className="w-full" variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              <p>We encountered an unexpected error while loading this page.</p>
              <p>Please try again or refresh the page. If the issue continues, contact support.</p>
            </AlertDescription>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" onClick={this.resetError}>
                Try again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh page
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
