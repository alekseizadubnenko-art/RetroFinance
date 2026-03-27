import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('RetroFinance error:', error, info);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-retro-bg flex items-center justify-center p-8">
                    <div className="border-4 border-retro-border bg-white shadow-retro max-w-md w-full p-8 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-retro-action text-4xl">error</span>
                            <h1 className="text-2xl font-black uppercase">Ошибка</h1>
                        </div>
                        <p className="text-sm font-bold uppercase text-gray-600">
                            Что-то пошло не так. Данные сохранены в localStorage — они не потеряны.
                        </p>
                        {this.state.error && (
                            <pre className="bg-gray-100 border-2 border-retro-border p-3 text-xs font-mono overflow-auto max-h-32 text-retro-action">
                                {this.state.error.message}
                            </pre>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={this.handleReset}
                                className="flex-1 py-3 bg-accent-orange text-white font-bold uppercase text-sm border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all"
                            >
                                Попробовать снова
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex-1 py-3 bg-white font-bold uppercase text-sm border-2 border-retro-border hover:bg-gray-100 transition-colors"
                            >
                                Перезагрузить
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
