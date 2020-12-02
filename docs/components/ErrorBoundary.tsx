import * as React from 'react';

class ErrorBoundary extends React.PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    return this.props.onDidCatch?.(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    const { children, renderError } = this.props;

    if (hasError) {
      return renderError ? renderError({ error }) : null;
    }
    return children;
  }
}

interface ErrorBoundaryProps {
  onDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
  children?: React.ReactElement<any, any> | null;
  renderError?(props: { error: any }): React.ReactElement<any, any> | null;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: any;
}

export { ErrorBoundary };
export type { ErrorBoundaryProps };
