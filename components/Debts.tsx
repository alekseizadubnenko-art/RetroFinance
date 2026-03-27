import React, { useState } from 'react';
import { Card, Button, ProgressBar } from './ui/RetroComponents';
import { useData } from '../context/DataContext';
import { AddDebtModal, ConfirmationModal } from './Modals';
import { Debt } from '../types';

export const Debts: React.FC = () => {
    const { debts, updateDebt, deleteDebt } = useData();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const theyOweMe = debts.filter(d => d.amount > 0 && !d.isClosed).reduce((acc, d) => acc + (d.amount - d.paid), 0);
    const iOweThem = Math.abs(debts.filter(d => d.amount < 0 && !d.isClosed).reduce((acc, d) => acc + (d.amount + d.paid), 0));
    const balance = theyOweMe - iOweThem;

    const openAdd = () => { setEditingDebt(null); setModalOpen(true); };
    const openEdit = (d: Debt) => { setEditingDebt(d); setModalOpen(true); };

    const DebtCard: React.FC<{ d: Debt }> = ({ d }) => {
        const isPositive = d.amount > 0;
        const total = Math.abs(d.amount);
        const remaining = total - d.paid;
        const color = isPositive ? 'text-accent-orange' : 'text-retro-action';
        const barColor = isPositive ? 'bg-accent-orange' : 'bg-retro-border';

        return (
            <div className={`border-2 border-retro-border ${d.isClosed ? 'bg-gray-100 opacity-70' : 'bg-retro-bg'} p-4 flex flex-col gap-4 hover:shadow-retro-sm transition-all`}>
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-lg">{d.person}</h3>
                            {d.isClosed && (
                                <span className="border border-accent-orange text-accent-orange text-[10px] px-2 py-0.5 rounded-full uppercase font-bold bg-orange-50 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-xs">check</span> Закрыто
                                </span>
                            )}
                        </div>
                        {d.description && <p className="text-sm text-gray-600 mt-1 truncate">{d.description}</p>}
                    </div>
                    <div className="text-right shrink-0">
                        <div className={`font-bold ${color} text-lg`}>₽{total.toLocaleString()}</div>
                        {!d.isClosed && <div className="text-xs text-gray-500 font-mono mt-1">осталось: ₽{remaining.toLocaleString()}</div>}
                    </div>
                </div>

                {!d.isClosed ? (
                    <div className="flex flex-col gap-1">
                        <ProgressBar value={d.paid} max={total} color={barColor} />
                        <div className="flex justify-between text-xs font-mono font-bold uppercase">
                            <span>Выплачено: ₽{d.paid.toLocaleString()}</span>
                            <span>{total > 0 ? Math.round((d.paid / total) * 100) : 0}%</span>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">Долг закрыт</p>
                )}

                {d.dueDate && !d.isClosed && (
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-500">
                        <span className="material-symbols-outlined text-sm">calendar_today</span>
                        {d.dueDate}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-1 border-t border-dashed border-gray-200">
                    <button
                        onClick={() => openEdit(d)}
                        className="flex items-center gap-1 text-xs font-bold uppercase text-gray-600 hover:text-retro-border transition-colors px-2 py-1 border border-gray-200 hover:border-retro-border"
                    >
                        <span className="material-symbols-outlined text-sm">edit</span> Изменить
                    </button>
                    {!d.isClosed && (
                        <button
                            onClick={() => updateDebt(d.id, { isClosed: true, paid: total })}
                            className="flex items-center gap-1 text-xs font-bold uppercase text-accent-orange hover:text-orange-700 transition-colors px-2 py-1 border border-orange-200 hover:border-accent-orange"
                        >
                            <span className="material-symbols-outlined text-sm">check_circle</span> Закрыть
                        </button>
                    )}
                    <button
                        onClick={() => setDeleteConfirm(d.id)}
                        className="ml-auto flex items-center gap-1 text-xs font-bold uppercase text-retro-action hover:text-red-700 transition-colors px-2 py-1 border border-red-200 hover:border-retro-action"
                    >
                        <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex flex-col justify-between h-32 relative overflow-hidden">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-accent-orange rotate-45">arrow_downward</span>
                        <h3 className="font-bold text-sm uppercase">Мне должны</h3>
                    </div>
                    <div className="text-3xl font-bold text-accent-orange">+₽{theyOweMe.toLocaleString()}</div>
                </Card>
                <Card className="flex flex-col justify-between h-32 relative overflow-hidden">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-retro-action rotate-45">arrow_upward</span>
                        <h3 className="font-bold text-sm uppercase">Я должен</h3>
                    </div>
                    <div className="text-3xl font-bold text-retro-action">-₽{iOweThem.toLocaleString()}</div>
                </Card>
                <Card className="flex flex-col justify-between h-32 relative overflow-hidden">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-retro-border">history</span>
                        <h3 className="font-bold text-sm uppercase">Баланс долгов</h3>
                    </div>
                    <div className={`text-3xl font-bold ${balance >= 0 ? 'text-accent-green' : 'text-retro-action'}`}>
                        {balance >= 0 ? '+' : ''}₽{balance.toLocaleString()}
                    </div>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button variant="primary" icon="add" onClick={openAdd}>Добавить долг</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="min-h-[400px]">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-accent-orange rotate-45">arrow_downward</span>
                        <h2 className="text-2xl font-bold uppercase">Мне должны</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        {debts.filter(d => d.amount > 0).length === 0 && (
                            <p className="text-center text-gray-500 font-bold uppercase py-8">Нет записей</p>
                        )}
                        {debts.filter(d => d.amount > 0).map(d => <DebtCard key={d.id} d={d} />)}
                    </div>
                </Card>

                <Card className="min-h-[400px]">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-retro-action rotate-45">arrow_upward</span>
                        <h2 className="text-2xl font-bold uppercase">Я должен</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                        {debts.filter(d => d.amount < 0).length === 0 && (
                            <p className="text-center text-gray-500 font-bold uppercase py-8">Нет записей</p>
                        )}
                        {debts.filter(d => d.amount < 0).map(d => <DebtCard key={d.id} d={d} />)}
                    </div>
                </Card>
            </div>

            <AddDebtModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                debt={editingDebt}
            />
            <ConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => { if (deleteConfirm) deleteDebt(deleteConfirm); }}
                title="Удалить долг"
                message="Запись о долге будет удалена безвозвратно. Продолжить?"
                isDanger
            />
        </div>
    );
};
