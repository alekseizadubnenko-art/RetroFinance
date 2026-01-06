import React from 'react';
import { Card, Button, ProgressBar } from './ui/RetroComponents';
import { useData } from '../context/DataContext';

export const Debts: React.FC = () => {
    const { debts } = useData();

    // Positive = They owe me
    const theyOweMe = debts.filter(d => d.amount > 0 && !d.isClosed).reduce((acc, d) => acc + (d.amount - d.paid), 0);
    // Negative = I owe them (stored as negative in mock, so we abs it for display)
    const iOweThem = Math.abs(debts.filter(d => d.amount < 0 && !d.isClosed).reduce((acc, d) => acc + (d.amount + d.paid), 0));
    
    const balance = theyOweMe - iOweThem;

    return (
        <div className="flex flex-col gap-6 md:gap-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-accent-orange rotate-45">arrow_downward</span>
                            <h3 className="font-bold text-sm uppercase">Мне должны</h3>
                        </div>
                    </div>
                    <div className="z-10 relative">
                        <div className="text-3xl font-bold text-accent-orange">+₽{theyOweMe.toLocaleString()}</div>
                    </div>
                </Card>
                <Card className="flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                         <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-retro-action rotate-45">arrow_upward</span>
                            <h3 className="font-bold text-sm uppercase">Я должен</h3>
                        </div>
                    </div>
                    <div className="z-10 relative">
                        <div className="text-3xl font-bold text-retro-action">-₽{iOweThem.toLocaleString()}</div>
                    </div>
                </Card>
                 <Card className="flex flex-col justify-between h-32 relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10 relative">
                         <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-retro-border">history</span>
                            <h3 className="font-bold text-sm uppercase">Баланс долгов</h3>
                        </div>
                    </div>
                    <div className="z-10 relative">
                        <div className={`text-3xl font-bold ${balance >= 0 ? 'text-accent-green' : 'text-retro-action'}`}>
                            {balance >= 0 ? '+' : ''}₽{balance.toLocaleString()}
                        </div>
                    </div>
                </Card>
             </div>
             <div className="flex justify-end">
                <Button variant="primary" icon="add">Добавить долг</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="min-h-[400px]">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-accent-orange rotate-45">arrow_downward</span>
                        <h2 className="text-2xl font-bold uppercase">Мне должны</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        {debts.filter(d => d.amount > 0).map(d => (
                            <div key={d.id} className={`border-2 border-retro-border ${d.isClosed ? 'bg-gray-200 opacity-70' : 'bg-retro-bg'} p-4 flex flex-col gap-4 hover:shadow-retro-sm transition-all`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg">{d.person}</h3>
                                            {d.isClosed && (
                                                <div className="border border-accent-orange text-accent-orange text-[10px] px-2 py-0.5 rounded-full uppercase font-bold bg-orange-50 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">check</span> Закрыто
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">{d.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-accent-orange text-lg">₽{d.amount.toLocaleString()}</div>
                                        {!d.isClosed && <div className="text-xs text-gray-500 font-mono mt-1">осталось: ₽{(d.amount - d.paid).toLocaleString()}</div>}
                                    </div>
                                </div>
                                {!d.isClosed ? (
                                    <div className="flex flex-col gap-1">
                                        <ProgressBar value={d.paid} max={d.amount} color="bg-accent-orange" />
                                        <div className="flex justify-between text-xs font-mono font-bold uppercase">
                                            <span>Выплачено: ₽{d.paid.toLocaleString()}</span>
                                            <span>{Math.round((d.paid/d.amount)*100)}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div><p className="text-sm text-gray-600">Долг закрыт</p></div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="min-h-[400px]">
                     <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-retro-action rotate-45">arrow_upward</span>
                        <h2 className="text-2xl font-bold uppercase">Я должен</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                         {debts.filter(d => d.amount < 0).map(d => {
                             const totalDebt = Math.abs(d.amount);
                             const remaining = totalDebt - d.paid;
                             return (
                                <div key={d.id} className="border-2 border-retro-border bg-retro-bg p-4 flex flex-col gap-4 hover:shadow-retro-sm transition-all cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{d.person}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{d.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-retro-action text-lg">₽{totalDebt.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-1">осталось: ₽{remaining.toLocaleString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <ProgressBar value={d.paid} max={totalDebt} color="bg-retro-border" />
                                        <div className="flex justify-between text-xs font-mono font-bold uppercase">
                                            <span>Выплачено: ₽{d.paid.toLocaleString()}</span>
                                            <span>{Math.round((d.paid/totalDebt)*100)}%</span>
                                        </div>
                                    </div>
                                     <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500 mt-1">
                                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                                        {d.dueDate}
                                    </div>
                                </div>
                             )
                         })}
                    </div>
                </Card>
            </div>
        </div>
    );
};