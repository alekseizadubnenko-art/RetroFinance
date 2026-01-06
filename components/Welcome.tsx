import React from 'react';
import { useData } from '../context/DataContext';

export const Welcome: React.FC = () => {
    const { resetToMock, startFresh } = useData();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-retro-bg">
            {/* Background Decorations */}
            <div className="absolute top-10 left-10 size-24 border-4 border-retro-border rounded-full opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-10 right-10 size-48 bg-accent-orange opacity-10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/2 left-[-50px] w-[200px] h-[20px] bg-retro-border -rotate-45 opacity-5 pointer-events-none"></div>

            <div className="max-w-md w-full flex flex-col gap-8 relative z-10">
                <div className="text-center">
                    <div className="inline-block bg-accent-orange border-4 border-retro-border p-4 mb-6 shadow-retro rotate-3 hover:rotate-6 transition-transform">
                        <span className="material-symbols-outlined text-white text-6xl">account_balance_wallet</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2">Retro<br/>Finance</h1>
                    <p className="font-bold uppercase tracking-widest text-gray-500">Персональный трекер бюджета</p>
                </div>

                <div className="border-4 border-retro-border bg-white p-6 shadow-retro flex flex-col gap-4">
                    <p className="text-sm font-medium text-center mb-2">Выберите режим запуска:</p>
                    
                    <button 
                        onClick={resetToMock}
                        className="w-full py-4 bg-card-retro border-2 border-retro-border font-bold uppercase hover:bg-accent-yellow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-retro-sm transition-all flex items-center justify-center gap-3 group"
                    >
                        <span className="material-symbols-outlined group-hover:animate-bounce">science</span>
                        <span>Демо режим</span>
                    </button>
                    
                    <div className="text-center text-xs font-bold text-gray-400 uppercase">- или -</div>

                    <button 
                        onClick={startFresh}
                        className="w-full py-4 bg-retro-border text-white border-2 border-retro-border font-bold uppercase hover:bg-gray-800 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-retro-sm transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined">edit_square</span>
                        <span>Начать с нуля</span>
                    </button>
                </div>

                <div className="text-center text-[10px] uppercase font-bold text-gray-400">
                    <p>Данные хранятся локально на устройстве.</p>
                    <p>v1.0.0 • Neo-Brutalist Design</p>
                </div>
            </div>
        </div>
    );
};
