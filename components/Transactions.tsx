import React from 'react';
import { Card, Button } from './ui/RetroComponents';
import { useData } from '../context/DataContext';

export const Transactions: React.FC = () => {
    const { transactions } = useData();
    
    const totalAmount = transactions.reduce((acc, t) => t.type === 'expense' ? acc - t.amount : acc + t.amount, 0);

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase mb-1">Транзакции</h2>
                    <p className="text-xs md:text-sm font-bold opacity-80 uppercase">{transactions.length} операций • Итого: {totalAmount > 0 ? '+' : ''}₽{totalAmount.toLocaleString()}</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Button variant="secondary" icon="remove" className="flex-1 md:flex-none">Расход</Button>
                    <Button variant="primary" icon="add" className="flex-1 md:flex-none">Доход</Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-2 flex flex-col lg:flex-row gap-2 !shadow-retro-sm">
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined opacity-50">search</span>
                    <input 
                        className="w-full pl-12 pr-4 py-3 bg-retro-bg border-2 border-retro-border font-bold text-sm focus:ring-0 focus:border-retro-border focus:outline-none placeholder:text-gray-500 placeholder:uppercase rounded-none appearance-none" 
                        placeholder="Поиск..." 
                        type="text"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <div className="relative w-full lg:w-64">
                        <select className="w-full pl-10 pr-8 py-3 bg-retro-bg border-2 border-retro-border font-bold text-sm focus:ring-0 focus:border-retro-border focus:outline-none appearance-none uppercase rounded-none cursor-pointer">
                            <option>Все категории</option>
                            <option>Еда и напитки</option>
                            <option>Транспорт</option>
                        </select>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">filter_list</span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">expand_more</span>
                    </div>
                    <div className="relative w-full lg:w-64">
                         <select className="w-full pl-10 pr-8 py-3 bg-retro-bg border-2 border-retro-border font-bold text-sm focus:ring-0 focus:border-retro-border focus:outline-none appearance-none uppercase rounded-none cursor-pointer">
                            <option>Сначала новые</option>
                            <option>По сумме</option>
                        </select>
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">swap_vert</span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">expand_more</span>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                <div className="lg:col-span-3 flex flex-col border-2 border-retro-border bg-white shadow-retro h-fit">
                    <div className="p-4 border-b-2 border-retro-border bg-retro-bg">
                        <h3 className="font-bold uppercase">Список операций</h3>
                    </div>
                    <div className="divide-y-2 divide-retro-border">
                        {transactions.length > 0 ? transactions.map(t => (
                            <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="size-12 border-2 border-retro-border flex items-center justify-center bg-card-pink shrink-0 shadow-retro-sm group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                                        <span className="material-symbols-outlined -rotate-45">{t.type === 'income' ? 'arrow_upward' : 'arrow_downward'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0 sm:hidden">
                                         <h4 className="font-bold text-base truncate">{t.title}</h4>
                                         <span className={`text-xl font-bold font-mono block mt-1 ${t.type === 'income' ? 'text-accent-green' : 'text-retro-action'}`}>
                                             {t.type === 'income' ? '+' : '-'} {t.amount} ₽
                                         </span>
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0 hidden sm:block">
                                    <h4 className="font-bold text-base">{t.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium uppercase text-gray-600 bg-gray-100 px-2 py-0.5 border border-retro-border">{t.category}</span>
                                        <span className="text-xs text-gray-500">•</span>
                                        <span className="text-xs text-gray-600">{t.source}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 hidden sm:block">
                                    <div className={`text-xl font-bold font-mono ${t.type === 'income' ? 'text-accent-green' : 'text-retro-action'}`}>
                                        {t.type === 'income' ? '+' : '-'} {t.amount} ₽
                                    </div>
                                </div>

                                {/* Mobile Only Details Row */}
                                <div className="sm:hidden flex items-center justify-between gap-2 w-full pt-2 border-t border-dashed border-gray-300">
                                     <span className="text-xs font-medium uppercase text-gray-600 bg-gray-100 px-2 py-0.5 border border-retro-border truncate max-w-[50%]">{t.category}</span>
                                     <span className="text-xs text-gray-600">{t.source}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-500 font-bold uppercase">Нет транзакций</div>
                        )}
                    </div>
                    {transactions.length > 5 && (
                        <div className="p-4 border-t-2 border-retro-border bg-retro-bg flex justify-center">
                            <button className="text-xs font-bold uppercase hover:underline">Показать еще</button>
                        </div>
                    )}
                </div>

                {/* Sidebar Stats */}
                <div className="flex flex-col gap-6">
                    <Card className="p-0">
                        <div className="p-4 border-b-2 border-retro-border bg-retro-bg">
                            <h3 className="font-bold uppercase">Статистика</h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            <div className="flex justify-between items-end border-b-2 border-gray-100 pb-2">
                                <span className="text-xs font-bold uppercase text-gray-500">Всего расходов:</span>
                                <span className="font-bold font-mono text-retro-action">₽{transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end border-b-2 border-retro-border/10 pb-2">
                                <span className="text-xs font-bold uppercase text-gray-500">Доходы:</span>
                                <span className="font-bold font-mono text-accent-green">₽{transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};