// client/src/components/ErrorBoundary.jsx

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState(prevState => ({
            error,
            errorInfo,
            errorCount: prevState.errorCount + 1
        }));

        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Prevent infinite error loops
            if (this.state.errorCount > 3) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                Critical Error
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Multiple errors detected. Please refresh the page or contact support.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                );
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                    Oops! Something went wrong
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    We encountered an unexpected error. Don't worry, your data is safe.
                                </p>
                            </div>
                        </div>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                                <summary className="cursor-pointer font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Error Details (Development Mode)
                                </summary>
                                <div className="mt-2 space-y-2">
                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                            Error Message:
                                        </p>
                                        <pre className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded overflow-x-auto">
                                            {this.state.error.toString()}
                                        </pre>
                                    </div>
                                    {this.state.errorInfo && (
                                        <div>
                                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                                Component Stack:
                                            </p>
                                            <pre className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded overflow-x-auto max-h-40">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-xl transition"
                            >
                                <Home className="w-4 h-4" />
                                Go Home
                            </button>
                        </div>

                        {/* Help Text */}
                        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">
                            If this problem persists, please contact support or try refreshing the page.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
