import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Budget } from './components/Budget';
import { Debts } from './components/Debts';
import { Investments } from './components/Investments';
import { Settings } from './components/Settings';
import { Welcome } from './components/Welcome';
import { AddTransactionModal } from './components/Modals';
import { ViewState } from './types';
import { useData } from './context/DataContext';

const App: React.FC = () => {
    const { isWelcomeScreen } = useData();
    const [currentView, setCurrentView] = useState<ViewState>('dashboard');
    const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

    if (isWelcomeScreen) {
        return <Welcome />;
    }

    const navItems: { id: ViewState, label: string, isPrimary?: boolean }[] = [
        { id: 'dashboard', label: 'Дашборд', isPrimary: true },
        { id: 'transactions', label: 'Транзакции' },
        { id: 'budget', label: 'Бюджет' },
        { id: 'debts', label: 'Долги' },
        { id: 'investments', label: 'Инвестиции' },
    ];

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <Dashboard />;
            case 'transactions': return <Transactions />;
            case 'budget': return <Budget />;
            case 'debts': return <Debts />;
            case 'investments': return <Investments />;
            case 'settings': return <Settings />;
            default: return <Dashboard />;
        }
    };

    return (
        <>
            <nav className="flex flex-col gap-4 p-4 md:px-6 md:py-4 border-b-4 border-retro-border bg-white sticky top-0 z-40 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                    <div className="flex items-center justify-between w-full md:w-auto gap-4 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
                        <div className="flex items-center gap-4">
                            <div className="bg-accent-orange text-white flex items-center justify-center border-2 border-retro-border size-12 shrink-0 shadow-retro-sm">
                                <span className="material-symbols-outlined" style={{fontSize: '28px'}}>account_balance_wallet</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold uppercase tracking-tight">Финансы</h1>
                                <p className="text-xs font-bold uppercase tracking-wider">6 ЯНВАРЯ 2026 Г.</p>
                            </div>
                        </div>
                        {/* Mobile Settings Icon */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setCurrentView('settings'); }}
                            className={`md:hidden size-10 flex items-center justify-center border-2 border-retro-border shadow-retro-sm active:translate-y-[2px] active:shadow-none transition-all ${currentView === 'settings' ? 'bg-accent-orange text-white' : 'bg-white'}`}
                        >
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>

                    <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
                         <div className="flex items-center gap-3 min-w-max">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`px-4 md:px-6 py-2 font-bold border-2 border-retro-border shadow-retro-sm hover:translate-y-[2px] hover:shadow-none transition-all uppercase text-sm md:text-base ${
                                        currentView === item.id 
                                        ? 'bg-accent-orange text-white' 
                                        : 'bg-white text-retro-border'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            {/* Desktop Settings Icon */}
                            <button 
                                onClick={() => setCurrentView('settings')}
                                className={`hidden md:flex size-10 items-center justify-center border-2 border-retro-border shadow-retro-sm hover:translate-y-[2px] hover:shadow-none transition-all ${currentView === 'settings' ? 'bg-accent-orange text-white' : 'bg-white'}`}
                            >
                                <span className="material-symbols-outlined">settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="p-4 md:p-6 max-w-[1600px] mx-auto min-h-[calc(100vh-140px)] pb-32 md:pb-6">
                 {renderView()}
            </main>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 flex flex-col gap-4 z-30">
                 <button 
                    onClick={() => setExpenseModalOpen(true)}
                    className="size-12 md:size-14 bg-retro-action text-white rounded-full border-2 border-retro-border shadow-retro flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                    title="Add Expense"
                >
                    <span className="material-symbols-outlined text-2xl md:text-3xl">remove</span>
                </button>
                 <button 
                    onClick={() => setIncomeModalOpen(true)}
                    className="size-12 md:size-14 bg-accent-orange text-white rounded-full border-2 border-retro-border shadow-retro flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
                    title="Add Income"
                >
                    <span className="material-symbols-outlined text-2xl md:text-3xl">add</span>
                </button>
            </div>

            <AddTransactionModal isOpen={isIncomeModalOpen} onClose={() => setIncomeModalOpen(false)} type="income" />
            <AddTransactionModal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)} type="expense" />
        </>
    );
};

export default App;