
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            Please refresh the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
