import React from 'react';
import { Card, Button, ProgressBar } from './ui/RetroComponents';
import { useData } from '../context/DataContext';

export const Budget: React.FC = () => {
    const { budget } = useData();

    const totalAllocated = budget.reduce((acc, c) => acc + c.allocated, 0);
    const totalSpent = budget.reduce((acc, c) => acc + c.spent, 0);
    const totalRemaining = totalAllocated - totalSpent;
    const totalPercent = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-12">
            <Card className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">Бюджет на Декабрь 2025</h2>
                    <p className="text-sm font-bold uppercase tracking-wider mt-1 text-gray-600">{budget.length} категорий • Осталось дней: 28</p>
                </div>
                <Button variant="primary" icon="add">Добавить категорию</Button>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-retro-border">target</span>
                        <span className="text-xs font-bold uppercase">Запланировано</span>
                    </div>
                    <div className="text-3xl font-bold mt-4">₽{totalAllocated.toLocaleString()}</div>
                </Card>
                <Card>
                    <div className="flex items-center gap-2 text-retro-action">
                        <span className="material-symbols-outlined">trending_down</span>
                        <span className="text-xs font-bold uppercase text-retro-border">Потрачено</span>
                    </div>
                    <div className="text-3xl font-bold text-retro-action mt-4">₽{totalSpent.toLocaleString()}</div>
                </Card>
                 <Card>
                    <div className="flex items-center gap-2 text-accent-orange">
                        <span className="material-symbols-outlined">trending_up</span>
                        <span className="text-xs font-bold uppercase text-retro-border">Остаток</span>
                    </div>
                    <div className="text-3xl font-bold text-accent-orange mt-4">₽{totalRemaining.toLocaleString()}</div>
                </Card>
                 <Card>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined">pie_chart</span>
                        <span className="text-xs font-bold uppercase">Использовано</span>
                    </div>
                    <div className="text-3xl font-bold mt-4">{totalPercent.toFixed(1)}%</div>
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-end mb-2">
                    <h3 className="font-bold uppercase text-sm">Общий прогресс</h3>
                    <div className="font-mono text-xs font-bold">₽{totalSpent.toLocaleString()} / ₽{totalAllocated.toLocaleString()}</div>
                </div>
                <div className="w-full h-4 bg-gray-100 border-2 border-retro-border relative">
                     <div className="absolute left-0 top-0 h-full bg-retro-border" style={{width: `${Math.min(100, totalPercent)}%`}}></div>
                </div>
            </Card>

            <div className="border-2 border-retro-border bg-white p-3 flex justify-between items-center shadow-retro-sm mt-2">
                <h2 className="font-bold uppercase text-lg">Категории бюджета</h2>
                <span className="text-xs font-bold uppercase">{budget.length} категорий</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budget.length > 0 ? budget.map((c, i) => (
                    <div key={i} className="bg-white border-2 border-retro-border p-5 shadow-retro hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer">
                        <div className="flex justify-between items-baseline mb-3">
                            <h4 className="font-bold uppercase text-sm">{c.name}</h4>
                            <div className="font-mono text-sm">₽{c.spent.toLocaleString()} / ₽{c.allocated.toLocaleString()}</div>
                        </div>
                        <ProgressBar value={c.spent} max={c.allocated} color="bg-retro-border" />
                        <div className="flex justify-between items-center text-xs font-bold mt-4 mb-4">
                            <span className="text-gray-500 font-medium lowercase truncate max-w-[200px]">{c.details}</span>
                            <span className="text-accent-yellow">Осталось: ₽{(c.allocated - c.spent).toLocaleString()}</span>
                        </div>
                        <div className="border-t-2 border-dashed border-gray-200 pt-3 flex justify-between items-center text-xs">
                             <div className="flex flex-col gap-1">
                                <span className="font-medium">Транзакций:</span>
                                <span className="font-medium">Использовано:</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right font-mono">
                                <span>{c.spent > 0 ? 1 : 0}</span>
                                <span>{((c.spent/c.allocated)*100).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full p-8 text-center text-gray-500 font-bold uppercase">Категории не заданы</div>
                )}
            </div>
        </div>
    );
};