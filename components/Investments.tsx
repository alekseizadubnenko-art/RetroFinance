import React, { useState } from 'react';
import { Card, Button } from './ui/RetroComponents';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';
import { AddInvestmentModal, ConfirmationModal } from './Modals';
import { Investment } from '../types';

export const Investments: React.FC = () => {
    const { investments, deleteInvestment } = useData();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const totalInvested = investments.reduce((acc, i) => acc + i.invested, 0);
    const totalCurrent = investments.reduce((acc, i) => acc + i.currentValue, 0);
    const totalProfit = totalCurrent - totalInvested;
    const profitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    const openAdd = () => { setEditingInvestment(null); setModalOpen(true); };
    const openEdit = (inv: Investment) => { setEditingInvestment(inv); setModalOpen(true); };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Инвестиции</h2>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1 text-gray-600">Отслеживание портфелей и прибыли</p>
                </div>
                <Button variant="primary" icon="add" onClick={openAdd}>Добавить портфель</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Всего вложено</span>
                    <div className="text-3xl font-bold mt-2 font-mono">₽{totalInvested.toLocaleString()}</div>
                </Card>
                <Card className="flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Текущая стоимость</span>
                    <div className="text-3xl font-bold mt-2 font-mono">₽{totalCurrent.toLocaleString()}</div>
                </Card>
                <Card color="retro" className="flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Прибыль / Убыток</span>
                    <div className={`text-3xl font-bold mt-2 font-mono ${totalProfit >= 0 ? 'text-accent-orange' : 'text-retro-action'}`}>
                        {totalProfit >= 0 ? '+' : ''}₽{totalProfit.toLocaleString()}
                    </div>
                </Card>
                <Card color="retro" className="flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Доходность</span>
                    <div className={`text-3xl font-bold mt-2 font-mono ${profitPercent >= 0 ? 'text-accent-orange' : 'text-retro-action'}`}>
                        {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                    </div>
                </Card>
            </div>

            <Card className="mb-8">
                <div className="border-b-2 border-retro-border flex justify-between items-center mb-6 pb-4">
                    <h3 className="font-bold uppercase text-lg">Портфели</h3>
                    <span className="text-xs font-bold text-gray-500 uppercase">{investments.length} позиций</span>
                </div>

                {investments.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <span className="material-symbols-outlined text-5xl block mb-3 opacity-30">show_chart</span>
                        <p className="font-bold uppercase text-sm">Нет портфелей</p>
                        <p className="text-xs mt-1">Нажмите «Добавить портфель» чтобы начать</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {investments.map(inv => (
                            <div key={inv.id} className="border-2 border-retro-border p-4 bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-lg uppercase">{inv.name}</h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEdit(inv)}
                                            className="flex items-center gap-1 text-xs font-bold uppercase text-gray-600 hover:text-retro-border px-2 py-1 border border-gray-200 hover:border-retro-border transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(inv.id)}
                                            className="flex items-center gap-1 text-xs font-bold uppercase text-retro-action hover:text-red-700 px-2 py-1 border border-red-200 hover:border-retro-action transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="border-2 border-retro-border p-3 bg-retro-bg">
                                        <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-70">Вложено</span>
                                        <span className="text-xl font-bold font-mono">₽{inv.invested.toLocaleString()}</span>
                                    </div>
                                    <div className="border-2 border-retro-border p-3 bg-retro-bg">
                                        <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-70">Текущий баланс</span>
                                        <span className="text-xl font-bold font-mono">₽{inv.currentValue.toLocaleString()}</span>
                                    </div>
                                    <div className="border-2 border-retro-border p-3 bg-card-retro">
                                        <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-70">Прибыль</span>
                                        <span className={`text-xl font-bold font-mono ${inv.profit >= 0 ? 'text-accent-orange' : 'text-retro-action'}`}>
                                            {inv.profit >= 0 ? '+' : ''}₽{inv.profit.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="border-2 border-retro-border p-3 bg-card-retro">
                                        <span className="text-xs font-bold uppercase tracking-wider block mb-1 opacity-70">Доходность</span>
                                        <span className={`text-xl font-bold font-mono ${inv.percent >= 0 ? 'text-accent-orange' : 'text-retro-action'}`}>
                                            {inv.percent >= 0 ? '+' : ''}{inv.percent}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Сводный график */}
                        {investments.length > 0 && (
                            <div className="border-2 border-retro-border p-6 bg-white relative min-h-[300px]">
                                <h4 className="font-bold uppercase text-xs mb-6">Распределение портфеля</h4>
                                <div className="h-[220px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={investments.map((inv, i) => ({ name: inv.name, invested: inv.invested, current: inv.currentValue }))}>
                                            <XAxis
                                                dataKey="name"
                                                stroke="#111418"
                                                tick={{ fill: '#111418', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                stroke="#111418"
                                                tick={{ fill: '#111418', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#fff',
                                                    border: '2px solid #111418',
                                                    boxShadow: '4px 4px 0px 0px #111418',
                                                    fontFamily: 'JetBrains Mono',
                                                    fontSize: 12,
                                                }}
                                                formatter={(value: number) => `₽${value.toLocaleString()}`}
                                            />
                                            <Line type="monotone" dataKey="invested" stroke="#9ca3af" strokeWidth={2} dot={{ fill: 'white', stroke: '#9ca3af', strokeWidth: 2, r: 4 }} name="Вложено" />
                                            <Line type="monotone" dataKey="current" stroke="#e85d04" strokeWidth={3} dot={{ fill: 'white', stroke: '#e85d04', strokeWidth: 2, r: 4 }} name="Текущая стоимость" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            <AddInvestmentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                investment={editingInvestment}
            />
            <ConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => { if (deleteConfirm) deleteInvestment(deleteConfirm); }}
                title="Удалить портфель"
                message="Портфель будет удалён безвозвратно. Продолжить?"
                isDanger
            />
        </div>
    );
};
