import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-20 bg-white">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-600">Something Went Wrong</h3>
            <p className="text-sm font-bold text-slate-400 max-w-sm">
              Don't worry! Click below to get back on track.
            </p>
          </div>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.hash = '';
              window.location.reload();
            }}
            className="px-8 py-4 bg-cyan-400 text-white font-black rounded-2xl shadow-lg hover:bg-cyan-500 transition-all"
          >
            Restart App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
