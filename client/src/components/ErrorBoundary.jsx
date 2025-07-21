import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-primaryRed text-center mt-16 p-8">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;