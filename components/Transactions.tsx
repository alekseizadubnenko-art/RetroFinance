import React, { useState, useMemo } from 'react';
import { Card, Button } from './ui/RetroComponents';
import { useData } from '../context/DataContext';
import { AddTransactionModal, EditTransactionModal, ConfirmationModal } from './Modals';
import { Transaction } from '../types';

const PAGE_SIZE = 15;

type SortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export const Transactions: React.FC = () => {
    const { transactions, categories, deleteTransaction } = useData();

    // Modals
    const [addModal, setAddModal] = useState<'income' | 'expense' | null>(null);
    const [editingTx, setEditingTx] = useState<Transaction | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState<'' | 'income' | 'expense'>('');
    const [sort, setSort] = useState<SortOption>('date_desc');
    const [page, setPage] = useState(1);

    const allCategories = useMemo(() => {
        const names = new Set(transactions.map(t => t.category));
        return Array.from(names).sort();
    }, [transactions]);

    const filtered = useMemo(() => {
        let list = [...transactions];

        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.category.toLowerCase().includes(q) ||
                (t.source || '').toLowerCase().includes(q)
            );
        }
        if (filterCategory) list = list.filter(t => t.category === filterCategory);
        if (filterType) list = list.filter(t => t.type === filterType);

        list.sort((a, b) => {
            if (sort === 'amount_desc') return b.amount - a.amount;
            if (sort === 'amount_asc') return a.amount - b.amount;
            // date sort — treat string dates (newest first by default order)
            if (sort === 'date_asc') return a.id.localeCompare(b.id);
            return b.id.localeCompare(a.id); // date_desc
        });

        return list;
    }, [transactions, search, filterCategory, filterType, sort]);

    const paginated = filtered.slice(0, page * PAGE_SIZE);
    const hasMore = paginated.length < filtered.length;

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const resetFilters = () => { setSearch(''); setFilterCategory(''); setFilterType(''); setSort('date_desc'); setPage(1); };
    const hasFilters = search || filterCategory || filterType;

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black uppercase mb-1">Транзакции</h2>
                    <p className="text-xs md:text-sm font-bold opacity-80 uppercase">
                        {filtered.length} из {transactions.length} операций
                        {balance !== 0 && <> • {balance > 0 ? '+' : ''}₽{balance.toLocaleString()}</>}
                    </p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Button variant="secondary" icon="remove" className="flex-1 md:flex-none" onClick={() => setAddModal('expense')}>Расход</Button>
                    <Button variant="primary" icon="add" className="flex-1 md:flex-none" onClick={() => setAddModal('income')}>Доход</Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="p-3 flex flex-col lg:flex-row gap-2 !shadow-retro-sm">
                <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined opacity-50 text-lg">search</span>
                    <input
                        className="w-full pl-12 pr-4 py-3 bg-retro-bg border-2 border-retro-border font-bold text-sm focus:border-accent-orange focus:outline-none placeholder:text-gray-400 placeholder:uppercase rounded-none appearance-none"
                        placeholder="Поиск..."
                        type="text"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <div className="relative w-full lg:w-52">
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-retro-bg border-2 border-retro-border font-bold text-sm focus:border-accent-orange focus:outline-none appearance-none uppercase rounded-none cursor-pointer"
                            value={filterCategory}
                            onChange={e => { setFilterCategory(e.target.value); setPage(1); }}
                        >
                            <option value="">Все категории</option>
                            {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">filter_list</span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">expand_more</span>
                    </div>
                    <div className="relative w-full lg:w-44">
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-retro-bg border-2 border-retro-border font-bold text-sm focus:border-accent-orange focus:outline-none appearance-none uppercase rounded-none cursor-pointer"
                            value={filterType}
                            onChange={e => { setFilterType(e.target.value as '' | 'income' | 'expense'); setPage(1); }}
                        >
                            <option value="">Все типы</option>
                            <option value="income">Доходы</option>
                            <option value="expense">Расходы</option>
                        </select>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">swap_horiz</span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">expand_more</span>
                    </div>
                    <div className="relative w-full lg:w-52">
                        <select
                            className="w-full pl-10 pr-8 py-3 bg-retro-bg border-2 border-retro-border font-bold text-sm focus:border-accent-orange focus:outline-none appearance-none uppercase rounded-none cursor-pointer"
                            value={sort}
                            onChange={e => setSort(e.target.value as SortOption)}
                        >
                            <option value="date_desc">Сначала новые</option>
                            <option value="date_asc">Сначала старые</option>
                            <option value="amount_desc">По сумме ↓</option>
                            <option value="amount_asc">По сумме ↑</option>
                        </select>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">swap_vert</span>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg pointer-events-none">expand_more</span>
                    </div>
                    {hasFilters && (
                        <button
                            onClick={resetFilters}
                            className="px-4 py-3 border-2 border-retro-border font-bold text-xs uppercase hover:bg-gray-100 transition-colors whitespace-nowrap"
                        >
                            Сбросить
                        </button>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
                {/* List */}
                <div className="lg:col-span-3 flex flex-col border-2 border-retro-border bg-white shadow-retro h-fit">
                    <div className="p-4 border-b-2 border-retro-border bg-retro-bg">
                        <h3 className="font-bold uppercase">Список операций</h3>
                    </div>
                    <div className="divide-y-2 divide-retro-border">
                        {paginated.length > 0 ? paginated.map(t => (
                            <div key={t.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="size-12 border-2 border-retro-border flex items-center justify-center bg-card-pink shrink-0 shadow-retro-sm group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                                        <span className="material-symbols-outlined -rotate-45">{t.type === 'income' ? 'arrow_upward' : 'arrow_downward'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0 sm:hidden">
                                        <h4 className="font-bold text-base truncate">{t.title}</h4>
                                        <span className={`text-xl font-bold font-mono block mt-1 ${t.type === 'income' ? 'text-accent-green' : 'text-retro-action'}`}>
                                            {t.type === 'income' ? '+' : '-'}₽{t.amount.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 hidden sm:block">
                                    <h4 className="font-bold text-base">{t.title}</h4>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <span className="text-xs font-medium uppercase text-gray-600 bg-gray-100 px-2 py-0.5 border border-retro-border">{t.category}</span>
                                        {t.source && <><span className="text-xs text-gray-400">•</span><span className="text-xs text-gray-600">{t.source}</span></>}
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500 font-mono">{t.date}</span>
                                    </div>
                                </div>

                                <div className="hidden sm:flex items-center gap-3 shrink-0">
                                    <div className={`text-xl font-bold font-mono ${t.type === 'income' ? 'text-accent-green' : 'text-retro-action'}`}>
                                        {t.type === 'income' ? '+' : '-'}₽{t.amount.toLocaleString()}
                                    </div>
                                    {/* Actions */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setEditingTx(t)}
                                            className="p-1.5 border border-gray-200 hover:border-retro-border text-gray-500 hover:text-retro-border transition-colors"
                                            title="Редактировать"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(t.id)}
                                            className="p-1.5 border border-red-100 hover:border-retro-action text-gray-400 hover:text-retro-action transition-colors"
                                            title="Удалить"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Mobile details row */}
                                <div className="sm:hidden flex items-center justify-between gap-2 w-full pt-2 border-t border-dashed border-gray-300">
                                    <span className="text-xs font-medium uppercase text-gray-600 bg-gray-100 px-2 py-0.5 border border-retro-border truncate max-w-[50%]">{t.category}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingTx(t)} className="p-1 border border-gray-200 hover:border-retro-border transition-colors">
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                        <button onClick={() => setDeleteConfirm(t.id)} className="p-1 border border-red-100 hover:border-retro-action text-retro-action transition-colors">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-gray-500">
                                <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">receipt_long</span>
                                <p className="font-bold uppercase text-sm">{transactions.length === 0 ? 'Нет транзакций' : 'Ничего не найдено'}</p>
                                {hasFilters && <button onClick={resetFilters} className="mt-2 text-xs underline">Сбросить фильтры</button>}
                            </div>
                        )}
                    </div>
                    {hasMore && (
                        <div className="p-4 border-t-2 border-retro-border bg-retro-bg flex justify-center">
                            <button
                                onClick={() => setPage(p => p + 1)}
                                className="text-xs font-bold uppercase hover:underline"
                            >
                                Показать ещё ({filtered.length - paginated.length})
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <Card className="p-0">
                        <div className="p-4 border-b-2 border-retro-border bg-retro-bg">
                            <h3 className="font-bold uppercase">Статистика</h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                                <span className="text-xs font-bold uppercase text-gray-500">Расходы:</span>
                                <span className="font-bold font-mono text-retro-action">-₽{totalExpense.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                                <span className="text-xs font-bold uppercase text-gray-500">Доходы:</span>
                                <span className="font-bold font-mono text-accent-green">+₽{totalIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-bold uppercase text-gray-500">Итого:</span>
                                <span className={`font-bold font-mono ${balance >= 0 ? 'text-accent-green' : 'text-retro-action'}`}>
                                    {balance >= 0 ? '+' : ''}₽{balance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Top categories */}
                    {transactions.length > 0 && (() => {
                        const catMap: Record<string, number> = {};
                        transactions.filter(t => t.type === 'expense').forEach(t => {
                            catMap[t.category] = (catMap[t.category] || 0) + t.amount;
                        });
                        const top = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
                        if (top.length === 0) return null;
                        return (
                            <Card className="p-0">
                                <div className="p-4 border-b-2 border-retro-border bg-retro-bg">
                                    <h3 className="font-bold uppercase text-sm">Топ расходов</h3>
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                    {top.map(([cat, amt]) => (
                                        <div key={cat} className="flex justify-between items-center">
                                            <span
                                                className="text-xs font-bold uppercase text-gray-600 cursor-pointer hover:text-retro-border transition-colors truncate max-w-[60%]"
                                                onClick={() => { setFilterCategory(cat); setPage(1); }}
                                                title="Фильтровать по категории"
                                            >
                                                {cat}
                                            </span>
                                            <span className="text-xs font-mono font-bold text-retro-action">₽{amt.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        );
                    })()}
                </div>
            </div>

            {/* Modals */}
            {addModal && (
                <AddTransactionModal isOpen={true} onClose={() => setAddModal(null)} type={addModal} />
            )}
            <EditTransactionModal isOpen={!!editingTx} onClose={() => setEditingTx(null)} transaction={editingTx} />
            <ConfirmationModal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                onConfirm={() => { if (deleteConfirm) deleteTransaction(deleteConfirm); }}
                title="Удалить транзакцию"
                message="Транзакция будет удалена безвозвратно. Продолжить?"
                isDanger
            />
        </div>
    );
};
