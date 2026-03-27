import React, { useMemo, useState } from 'react';
import { Card, ProgressBar } from './ui/RetroComponents';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '../context/DataContext';
import { AddTransactionModal } from './Modals';

const PIE_COLORS = ['#ffeebb', '#faedcd', '#fefae0', '#e5e7eb', '#d1d5db', '#e85d04'];

export const Dashboard: React.FC = () => {
    const { transactions, debts, settings, budget } = useData();
    const [addModal, setAddModal] = useState<'income' | 'expense' | null>(null);

    const stats = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
        const totalBalance = income - expenses;

        const expensesByCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        const pieData = Object.entries(expensesByCategory).map(([name, value], index) => ({
            name,
            value,
            color: PIE_COLORS[index % PIE_COLORS.length]
        }));

        const iOwe = Math.abs(
            debts.filter(d => d.amount < 0 && !d.isClosed).reduce((acc, d) => acc + (d.amount + d.paid), 0)
        );

        const totalAllocated = budget.reduce((acc, b) => acc + b.allocated, 0);

        // Savings rate
        const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

        // Health status
        let healthLabel = 'Нет данных';
        let healthColor = 'text-gray-500';
        if (income > 0) {
            if (savingsRate >= 30) { healthLabel = 'Отлично'; healthColor = 'text-accent-green'; }
            else if (savingsRate >= 20) { healthLabel = 'Хорошо'; healthColor = 'text-accent-orange'; }
            else if (savingsRate >= 10) { healthLabel = 'Удовлетворительно'; healthColor = 'text-yellow-600'; }
            else if (savingsRate >= 0) { healthLabel = 'Слабо'; healthColor = 'text-retro-action'; }
            else { healthLabel = 'Критично'; healthColor = 'text-retro-action'; }
        }

        // Emergency fund: target = 4 months of expenses
        const emergencyTarget = expenses * 4;
        const emergencyAmount = Math.max(0, totalBalance);
        const emergencyPercent = emergencyTarget > 0 ? Math.min(100, (emergencyAmount / emergencyTarget) * 100) : 0;

        // Sources net balance from transactions
        const sourceMap: Record<string, number> = {};
        transactions.forEach(t => {
            if (t.source) {
                sourceMap[t.source] = (sourceMap[t.source] || 0) + (t.type === 'income' ? t.amount : -t.amount);
            }
        });
        const sources = Object.entries(sourceMap)
            .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
            .slice(0, 4);

        return { income, expenses, totalBalance, pieData, iOwe, totalAllocated, savingsRate, healthLabel, healthColor, emergencyTarget, emergencyAmount, emergencyPercent, sources };
    }, [transactions, debts, budget]);

    const recentTransactions = transactions.slice(0, 4);

    const renderBudgetRule = () => {
        switch (settings.budgetMethod) {
            case '50/30/20':
                return (
                    <Card className="bg-retro-bg flex flex-col gap-5 h-full">
                        <div>
                            <h3 className="font-bold uppercase text-lg mb-1">Правило 50/30/20</h3>
                            <p className="text-xs uppercase font-medium text-gray-600">50% на нужды, 30% на желания, 20% на сбережения</p>
                        </div>
                        {[
                            { label: 'Нужды (50%)', val: 50, amount: stats.income * 0.5 },
                            { label: 'Желания (30%)', val: 30, amount: stats.income * 0.3 },
                            { label: 'Сбережения (20%)', val: 20, amount: stats.income * 0.2 },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm font-bold uppercase">
                                    <span>{item.label}</span>
                                    <span className="font-mono text-accent-orange">₽{item.amount.toLocaleString()}</span>
                                </div>
                                <ProgressBar value={item.val} max={100} />
                            </div>
                        ))}
                    </Card>
                );
            case '70/20/10':
                return (
                    <Card className="bg-retro-bg flex flex-col gap-5 h-full">
                        <div>
                            <h3 className="font-bold uppercase text-lg mb-1">Метод 70/20/10</h3>
                            <p className="text-xs uppercase font-medium text-gray-600">70% на жизнь, 20% сбережения, 10% инвестиции</p>
                        </div>
                        {[
                            { label: 'Жизнь (70%)', val: 70, amount: stats.income * 0.7 },
                            { label: 'Сбережения (20%)', val: 20, amount: stats.income * 0.2 },
                            { label: 'Инвестиции (10%)', val: 10, amount: stats.income * 0.1 },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-sm font-bold uppercase">
                                    <span>{item.label}</span>
                                    <span className="font-mono text-accent-orange">₽{item.amount.toLocaleString()}</span>
                                </div>
                                <ProgressBar value={item.val} max={100} />
                            </div>
                        ))}
                    </Card>
                );
            case 'babylon':
                return (
                    <Card className="bg-retro-bg flex flex-col gap-5 h-full">
                        <div>
                            <h3 className="font-bold uppercase text-lg mb-1">Вавилонский метод</h3>
                            <p className="text-xs uppercase font-medium text-gray-600">Сначала заплати себе (10%)</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="p-4 border-2 border-retro-border bg-white flex items-center gap-4">
                                <div className="bg-accent-yellow p-2 border-2 border-retro-border rounded-full">
                                    <span className="material-symbols-outlined text-retro-border">savings</span>
                                </div>
                                <div>
                                    <div className="text-sm font-bold uppercase">Сбережения (10%)</div>
                                    <div className="text-2xl font-mono font-bold">₽{(stats.income * 0.1).toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                Оставшиеся <span className="font-bold text-retro-border">90% (₽{(stats.income * 0.9).toLocaleString()})</span> распределите на долги и расходы.
                            </div>
                        </div>
                    </Card>
                );
            case 'zero': {
                const unallocated = stats.income - stats.totalAllocated;
                const isBalanced = Math.abs(unallocated) < 1;
                return (
                    <Card className="bg-retro-bg flex flex-col gap-5 h-full">
                        <div>
                            <h3 className="font-bold uppercase text-lg mb-1">Нулевой бюджет</h3>
                            <p className="text-xs uppercase font-medium text-gray-600">Доход минус расход должен равняться нулю</p>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-between items-center border-b-2 border-retro-border pb-2">
                                <span className="font-bold uppercase text-sm">Доход</span>
                                <span className="font-mono font-bold text-accent-green">+₽{stats.income.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center border-b-2 border-retro-border pb-2">
                                <span className="font-bold uppercase text-sm">Распределено</span>
                                <span className="font-mono font-bold text-retro-action">-₽{stats.totalAllocated.toLocaleString()}</span>
                            </div>
                            <div className={`flex justify-between items-center pt-2 ${isBalanced ? 'text-accent-green' : 'text-retro-action'}`}>
                                <span className="font-bold uppercase text-sm">{isBalanced ? 'Бюджет сошёлся!' : 'Не распределено'}</span>
                                <span className="font-mono font-bold text-xl">₽{unallocated.toLocaleString()}</span>
                            </div>
                        </div>
                    </Card>
                );
            }
            case 'envelopes':
                return (
                    <Card className="bg-retro-bg flex flex-col gap-5 h-full">
                        <div>
                            <h3 className="font-bold uppercase text-lg mb-1">Метод конвертов</h3>
                            <p className="text-xs uppercase font-medium text-gray-600">Следите за лимитами категорий</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="border-2 border-retro-border bg-white p-2 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-accent-orange mb-1">mail</span>
                                <span className="text-[10px] font-bold uppercase">Всего конвертов</span>
                                <span className="text-xl font-bold font-mono">{budget.length}</span>
                            </div>
                            <div className="border-2 border-retro-border bg-white p-2 flex flex-col items-center justify-center text-center">
                                <span className="material-symbols-outlined text-retro-action mb-1">warning</span>
                                <span className="text-[10px] font-bold uppercase">Превышено</span>
                                <span className="text-xl font-bold font-mono text-retro-action">
                                    {budget.filter(b => b.spent > b.allocated).length}
                                </span>
                            </div>
                        </div>
                    </Card>
                );
            default:
                return null;
        }
    };

    const emergencyIsLow = stats.emergencyPercent < 30;

    return (
        <div className="flex flex-col gap-6 md:gap-8">
            {/* Health Status */}
            <Card className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#fdf6e3]">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-left w-full">
                    <div className="font-bold text-sm md:text-base uppercase flex flex-col md:block">
                        Финансовое здоровье: <span className={`mt-1 md:mt-0 ${stats.healthColor}`}>{stats.healthLabel}</span>
                    </div>
                    <div className="hidden md:block w-1.5 h-1.5 bg-retro-border rounded-full"></div>
                    <div className="text-xs md:text-sm uppercase tracking-tight flex flex-col md:block text-gray-600">
                        <span>Свободных средств: ₽{stats.totalBalance.toLocaleString()}</span>
                        <span className="md:hidden">Норма сбережений: {stats.savingsRate.toFixed(1)}%</span>
                    </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto shrink-0 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end border-t-2 md:border-t-0 border-retro-border/10 pt-2 md:pt-0 mt-2 md:mt-0">
                    <div className="text-2xl font-bold">₽{stats.totalBalance.toLocaleString()}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Норма сбережений: {stats.savingsRate.toFixed(1)}%</div>
                </div>
            </Card>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <Card color="beige" className="flex flex-col justify-between min-h-[140px] md:min-h-[160px]">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold uppercase tracking-wider">Общий баланс</span>
                            <div className="border-2 border-retro-border p-1 bg-accent-orange text-white">
                                <span className="material-symbols-outlined text-lg block">account_balance</span>
                            </div>
                        </div>
                        <div>
                            <div className={`text-2xl md:text-3xl font-bold mt-2 ${stats.totalBalance < 0 ? 'text-retro-action' : ''}`}>
                                ₽{stats.totalBalance.toLocaleString()}
                            </div>
                            <div className="text-xs font-medium mt-1 uppercase opacity-70">Доходы − расходы</div>
                        </div>
                    </Card>
                    <Card color="beige" className="flex flex-col justify-between min-h-[140px] md:min-h-[160px]">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold uppercase tracking-wider">Доходы</span>
                            <div className="border-2 border-retro-border p-1 bg-accent-orange text-white">
                                <span className="material-symbols-outlined text-lg block">trending_up</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl md:text-3xl font-bold mt-2">₽{stats.income.toLocaleString()}</div>
                            <div className="text-xs font-medium mt-1 uppercase opacity-70">Всего поступлений</div>
                        </div>
                    </Card>
                    <Card color="pink" className="flex flex-col justify-between min-h-[140px] md:min-h-[160px]">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold uppercase tracking-wider">Расходы</span>
                            <div className="border-2 border-retro-border p-1 bg-accent-orange text-white">
                                <span className="material-symbols-outlined text-lg block">trending_down</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl md:text-3xl font-bold mt-2">₽{stats.expenses.toLocaleString()}</div>
                            <div className="text-xs font-medium mt-1 uppercase opacity-70">
                                {transactions.filter(t => t.type === 'expense').length} транзакций
                            </div>
                        </div>
                    </Card>
                    <Card color="pink" className="flex flex-col justify-between min-h-[140px] md:min-h-[160px]">
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold uppercase tracking-wider">Я должен</span>
                            <div className="border-2 border-retro-border p-1 bg-accent-orange text-white">
                                <span className="material-symbols-outlined text-lg block">history</span>
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl md:text-3xl font-bold mt-2">₽{stats.iOwe.toLocaleString()}</div>
                            <div className="text-xs font-medium mt-1 uppercase opacity-70">Баланс долгов</div>
                        </div>
                    </Card>
                </div>

                {/* Sources */}
                <div className="flex flex-col gap-3">
                    <h3 className="font-bold uppercase text-sm mb-1">Источники</h3>
                    {stats.sources.length > 0 ? stats.sources.map(([source, net]) => (
                        <div key={source} className="bg-white border-2 border-retro-border p-3 flex justify-between items-center shadow-retro-sm hover:translate-x-[2px] transition-transform">
                            <span className="font-medium text-sm truncate max-w-[55%]">{source}</span>
                            <span className={`font-bold font-mono text-sm ${net >= 0 ? 'text-accent-green' : 'text-retro-action'}`}>
                                {net >= 0 ? '+' : ''}₽{net.toLocaleString()}
                            </span>
                        </div>
                    )) : (
                        <div className="flex flex-col gap-3">
                            <div className="bg-white border-2 border-retro-border p-4 text-center text-gray-400 text-xs font-bold uppercase">
                                Нет данных
                            </div>
                            <button
                                onClick={() => setAddModal('income')}
                                className="py-2 border-2 border-dashed border-retro-border text-xs font-bold uppercase hover:bg-gray-50 transition-colors text-gray-500"
                            >
                                + Добавить транзакцию
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Budget Method & Emergency Fund */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {renderBudgetRule()}

                <Card className="flex flex-col justify-between gap-6 h-full">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined">shield</span>
                            <h3 className="font-bold uppercase text-lg">Экстренный фонд</h3>
                        </div>
                        <p className="text-xs uppercase font-medium text-gray-600">
                            Цель: 4 месяца расходов{stats.emergencyTarget > 0 ? ` (₽${stats.emergencyTarget.toLocaleString()})` : ''}
                        </p>
                    </div>

                    {emergencyIsLow && stats.expenses > 0 && (
                        <div className="border-2 border-retro-border bg-red-50 p-3 flex items-start gap-3">
                            <span className="material-symbols-outlined text-red-500 shrink-0">warning</span>
                            <p className="text-xs text-red-600 font-bold uppercase leading-relaxed">
                                {stats.emergencyPercent === 0
                                    ? 'Фонд не сформирован. Начните откладывать прямо сейчас.'
                                    : 'Низкий уровень. Рекомендуется пополнить фонд.'}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-xs font-bold uppercase">Прогресс</span>
                            <span className={`font-bold text-lg ${emergencyIsLow ? 'text-retro-action' : 'text-accent-green'}`}>
                                {stats.emergencyPercent.toFixed(1)}%
                            </span>
                        </div>
                        <ProgressBar
                            value={stats.emergencyPercent}
                            max={100}
                            height="h-4"
                            color={emergencyIsLow ? 'bg-retro-action' : 'bg-accent-green'}
                        />
                    </div>

                    <div className="flex justify-between items-end border-t-2 border-gray-100 pt-4">
                        <div>
                            <div className="text-[10px] uppercase font-bold text-gray-500">Текущая сумма</div>
                            <div className="text-xl font-bold font-mono">₽{stats.emergencyAmount.toLocaleString()}</div>
                        </div>
                        {stats.emergencyTarget > stats.emergencyAmount && stats.emergencyTarget > 0 && (
                            <div className="text-right">
                                <div className="text-[10px] uppercase font-bold text-gray-500">Осталось до цели</div>
                                <div className="text-xl font-bold font-mono text-accent-orange">
                                    ₽{(stats.emergencyTarget - stats.emergencyAmount).toLocaleString()}
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Recent Transactions & Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                <Card className="lg:col-span-2 p-0 flex flex-col gap-0 overflow-hidden">
                    <div className="p-4 border-b-2 border-retro-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-retro-bg">
                        <h3 className="font-bold uppercase">Последние операции</h3>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setAddModal('expense')}
                                className="flex-1 sm:flex-none px-3 py-1 bg-white border-2 border-retro-border text-xs font-bold uppercase hover:bg-red-50 text-red-500 shadow-retro-sm active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                − Расход
                            </button>
                            <button
                                onClick={() => setAddModal('income')}
                                className="flex-1 sm:flex-none px-3 py-1 bg-accent-orange text-white border-2 border-retro-border text-xs font-bold uppercase hover:bg-orange-600 shadow-retro-sm active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                + Доход
                            </button>
                        </div>
                    </div>
                    <div className="divide-y-2 divide-retro-border">
                        {recentTransactions.length > 0 ? recentTransactions.map(t => (
                            <div key={t.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                                <div className="size-10 border-2 border-retro-border flex items-center justify-center bg-card-pink shrink-0 shadow-retro-sm group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                                    <span className="material-symbols-outlined -rotate-45 text-sm">
                                        {t.type === 'income' ? 'arrow_upward' : 'arrow_downward'}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{t.title}</h4>
                                    <p className="text-xs text-gray-600 truncate">{t.category}{t.source ? ` • ${t.source}` : ''}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className={`font-bold font-mono ${t.type === 'income' ? 'text-accent-green' : 'text-retro-action'}`}>
                                        {t.type === 'income' ? '+' : '−'}₽{t.amount.toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-mono">{t.date}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-500 text-sm font-bold uppercase">Операций нет</div>
                        )}
                    </div>
                </Card>

                <Card className="flex flex-col p-0">
                    <div className="p-4 border-b-2 border-retro-border bg-retro-bg">
                        <h3 className="font-bold uppercase">Расходы по категориям</h3>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center flex-1 min-h-[300px]">
                        {stats.pieData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={stats.pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="#111418"
                                            strokeWidth={2}
                                        >
                                            {stats.pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#fff',
                                                border: '2px solid #111418',
                                                borderRadius: '0px',
                                                fontFamily: 'JetBrains Mono',
                                                boxShadow: '4px 4px 0px 0px #111418'
                                            }}
                                            itemStyle={{ color: '#111418' }}
                                            formatter={(value: number) => `₽${value.toLocaleString()}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="w-full flex flex-wrap gap-2 justify-center text-[10px] uppercase font-bold text-gray-600 mt-4">
                                    {stats.pieData.map((d, i) => (
                                        <div key={i} className="flex items-center gap-1">
                                            <div className="size-3 border border-retro-border" style={{ backgroundColor: d.color }}></div>
                                            <span>{d.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-gray-500 font-bold uppercase text-xs">Нет данных о расходах</div>
                        )}
                    </div>
                </Card>
            </div>

            {addModal && (
                <AddTransactionModal isOpen={true} onClose={() => setAddModal(null)} type={addModal} />
            )}
        </div>
    );
};
