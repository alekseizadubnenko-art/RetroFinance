import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Transaction, Debt, Investment } from '../types';

// ─── Shared helpers ────────────────────────────────────────────────────────────

const ModalOverlay: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
    <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-retro-border/30 backdrop-blur-sm animate-fade-in"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
        {children}
    </div>
);

const ModalBox: React.FC<{ children: React.ReactNode; wide?: boolean }> = ({ children, wide }) => (
    <div className={`bg-retro-bg w-full ${wide ? 'max-w-lg' : 'max-w-md'} border-4 border-retro-border rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto`}>
        {children}
    </div>
);

const ModalHeader: React.FC<{ title: string; onClose: () => void }> = ({ title, onClose }) => (
    <div className="flex items-center justify-between p-6 border-b-2 border-retro-border">
        <h2 className="text-xl font-bold font-mono tracking-tight uppercase">{title}</h2>
        <button onClick={onClose} className="text-retro-border hover:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-2xl">close</span>
        </button>
    </div>
);

interface FieldProps {
    label: string;
    children: React.ReactNode;
}
const Field: React.FC<FieldProps> = ({ label, children }) => (
    <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full bg-white border-2 border-retro-border px-4 py-3 text-sm focus:ring-0 focus:border-accent-orange outline-none font-mono rounded-none appearance-none";
const selectCls = `${inputCls} cursor-pointer`;

// ─── Add Transaction Modal ──────────────────────────────────────────────────────

interface AddTransactionProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'income' | 'expense';
}

export const AddTransactionModal: React.FC<AddTransactionProps> = ({ isOpen, onClose, type }) => {
    const { addTransaction, categories } = useData();
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [source, setSource] = useState('');

    const filteredCategories = categories.filter(c => c.type === type);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!amount || !title || !category || !source) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        addTransaction({
            title,
            amount: parseFloat(amount),
            type,
            category,
            source,
            date: new Date().toLocaleDateString('ru-RU'),
        });
        setAmount(''); setTitle(''); setCategory(''); setSource('');
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <ModalBox>
                <ModalHeader title={type === 'income' ? 'Новый доход' : 'Новый расход'} onClose={onClose} />
                <div className="px-6 py-6 flex flex-col gap-5">
                    <Field label="Сумма *">
                        <input className={inputCls} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" />
                    </Field>
                    <Field label="Описание *">
                        <input className={inputCls} type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: Обед в кафе" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Категория *">
                            <select className={selectCls} value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="">Выбрать</option>
                                {filteredCategories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Счёт *">
                            <input className={inputCls} type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="Наличные" />
                        </Field>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className={`w-full text-white font-bold uppercase py-3 border-b-4 active:border-b-0 active:translate-y-1 transition-all mt-2 text-sm tracking-wider shadow-lg ${type === 'income' ? 'bg-accent-orange border-orange-800 hover:bg-orange-600' : 'bg-retro-action border-red-800 hover:bg-red-600'}`}
                    >
                        {type === 'income' ? 'Добавить доход' : 'Добавить расход'}
                    </button>
                </div>
            </ModalBox>
        </ModalOverlay>
    );
};

// ─── Edit Transaction Modal ─────────────────────────────────────────────────────

interface EditTransactionProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export const EditTransactionModal: React.FC<EditTransactionProps> = ({ isOpen, onClose, transaction }) => {
    const { updateTransaction, categories } = useData();
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [source, setSource] = useState('');

    useEffect(() => {
        if (transaction) {
            setAmount(String(transaction.amount));
            setTitle(transaction.title);
            setCategory(transaction.category);
            setSource(transaction.source || '');
        }
    }, [transaction]);

    if (!isOpen || !transaction) return null;

    const filteredCategories = categories.filter(c => c.type === transaction.type);

    const handleSubmit = () => {
        if (!amount || !title || !category || !source) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        updateTransaction(transaction.id, { title, amount: parseFloat(amount), category, source });
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <ModalBox>
                <ModalHeader title="Редактировать" onClose={onClose} />
                <div className="px-6 py-6 flex flex-col gap-5">
                    <Field label="Сумма *">
                        <input className={inputCls} type="number" value={amount} onChange={e => setAmount(e.target.value)} />
                    </Field>
                    <Field label="Описание *">
                        <input className={inputCls} type="text" value={title} onChange={e => setTitle(e.target.value)} />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Категория *">
                            <select className={selectCls} value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="">Выбрать</option>
                                {filteredCategories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Счёт *">
                            <input className={inputCls} type="text" value={source} onChange={e => setSource(e.target.value)} />
                        </Field>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-retro-border text-white font-bold uppercase py-3 border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all mt-2 text-sm tracking-wider"
                    >
                        Сохранить
                    </button>
                </div>
            </ModalBox>
        </ModalOverlay>
    );
};

// ─── Add / Edit Debt Modal ──────────────────────────────────────────────────────

interface AddDebtProps {
    isOpen: boolean;
    onClose: () => void;
    debt?: Debt | null;
}

export const AddDebtModal: React.FC<AddDebtProps> = ({ isOpen, onClose, debt }) => {
    const { addDebt, updateDebt } = useData();
    const [person, setPerson] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paid, setPaid] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [direction, setDirection] = useState<'owe_me' | 'i_owe'>('owe_me');

    const isEdit = !!debt;

    useEffect(() => {
        if (debt) {
            setPerson(debt.person);
            setDescription(debt.description);
            setAmount(String(Math.abs(debt.amount)));
            setPaid(String(debt.paid));
            setDueDate(debt.dueDate || '');
            setDirection(debt.amount > 0 ? 'owe_me' : 'i_owe');
        } else {
            setPerson(''); setDescription(''); setAmount(''); setPaid('0'); setDueDate(''); setDirection('owe_me');
        }
    }, [debt, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!person || !amount) { alert('Заполните имя и сумму'); return; }
        const absAmount = parseFloat(amount);
        const finalAmount = direction === 'i_owe' ? -absAmount : absAmount;
        const payload: Omit<Debt, 'id'> = {
            person,
            description,
            amount: finalAmount,
            paid: parseFloat(paid) || 0,
            dueDate: dueDate || 'Бессрочно',
        };
        if (isEdit && debt) {
            updateDebt(debt.id, payload);
        } else {
            addDebt(payload);
        }
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <ModalBox>
                <ModalHeader title={isEdit ? 'Редактировать долг' : 'Добавить долг'} onClose={onClose} />
                <div className="px-6 py-6 flex flex-col gap-5">
                    <Field label="Направление">
                        <div className="grid grid-cols-2 gap-2">
                            {(['owe_me', 'i_owe'] as const).map(d => (
                                <button
                                    key={d}
                                    onClick={() => setDirection(d)}
                                    className={`py-2 font-bold uppercase text-sm border-2 transition-all ${direction === d ? 'bg-retro-border text-white border-retro-border' : 'bg-white border-retro-border hover:bg-gray-100'}`}
                                >
                                    {d === 'owe_me' ? 'Мне должны' : 'Я должен'}
                                </button>
                            ))}
                        </div>
                    </Field>
                    <Field label="Имя / Название *">
                        <input className={inputCls} type="text" value={person} onChange={e => setPerson(e.target.value)} placeholder="Иван" />
                    </Field>
                    <Field label="Описание">
                        <input className={inputCls} type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="За билеты на концерт" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Сумма *">
                            <input className={inputCls} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="5000" />
                        </Field>
                        <Field label="Уже выплачено">
                            <input className={inputCls} type="number" value={paid} onChange={e => setPaid(e.target.value)} placeholder="0" />
                        </Field>
                    </div>
                    <Field label="Срок погашения">
                        <input className={inputCls} type="text" value={dueDate} onChange={e => setDueDate(e.target.value)} placeholder="до 25 декабря" />
                    </Field>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-accent-orange text-white font-bold uppercase py-3 border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all mt-2 text-sm tracking-wider"
                    >
                        {isEdit ? 'Сохранить' : 'Добавить долг'}
                    </button>
                </div>
            </ModalBox>
        </ModalOverlay>
    );
};

// ─── Add / Edit Investment Modal ────────────────────────────────────────────────

interface AddInvestmentProps {
    isOpen: boolean;
    onClose: () => void;
    investment?: Investment | null;
}

export const AddInvestmentModal: React.FC<AddInvestmentProps> = ({ isOpen, onClose, investment }) => {
    const { addInvestment, updateInvestment } = useData();
    const [name, setName] = useState('');
    const [invested, setInvested] = useState('');
    const [currentValue, setCurrentValue] = useState('');

    const isEdit = !!investment;

    useEffect(() => {
        if (investment) {
            setName(investment.name);
            setInvested(String(investment.invested));
            setCurrentValue(String(investment.currentValue));
        } else {
            setName(''); setInvested(''); setCurrentValue('');
        }
    }, [investment, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name || !invested || !currentValue) { alert('Заполните все поля'); return; }
        const inv = parseFloat(invested);
        const cur = parseFloat(currentValue);
        const profit = cur - inv;
        const percent = inv > 0 ? parseFloat(((profit / inv) * 100).toFixed(2)) : 0;
        const payload: Omit<Investment, 'id'> = { name, invested: inv, currentValue: cur, profit, percent };
        if (isEdit && investment) {
            updateInvestment(investment.id, payload);
        } else {
            addInvestment(payload);
        }
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <ModalBox>
                <ModalHeader title={isEdit ? 'Редактировать портфель' : 'Добавить портфель'} onClose={onClose} />
                <div className="px-6 py-6 flex flex-col gap-5">
                    <Field label="Название *">
                        <input className={inputCls} type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Инвесткопилка" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Вложено *">
                            <input className={inputCls} type="number" value={invested} onChange={e => setInvested(e.target.value)} placeholder="10000" />
                        </Field>
                        <Field label="Текущая стоимость *">
                            <input className={inputCls} type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)} placeholder="11500" />
                        </Field>
                    </div>
                    {invested && currentValue && (
                        <div className="bg-card-retro border-2 border-retro-border p-4 font-mono text-sm">
                            <span className="font-bold uppercase text-xs block mb-1">Прибыль / Доходность</span>
                            <span className={parseFloat(currentValue) >= parseFloat(invested) ? 'text-accent-orange font-bold' : 'text-retro-action font-bold'}>
                                {(parseFloat(currentValue) - parseFloat(invested)).toLocaleString()} ₽ &nbsp;/&nbsp;
                                {invested ? (((parseFloat(currentValue) - parseFloat(invested)) / parseFloat(invested)) * 100).toFixed(2) : 0}%
                            </span>
                        </div>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-accent-orange text-white font-bold uppercase py-3 border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all mt-2 text-sm tracking-wider"
                    >
                        {isEdit ? 'Сохранить' : 'Добавить портфель'}
                    </button>
                </div>
            </ModalBox>
        </ModalOverlay>
    );
};

// ─── Confirmation Modal ─────────────────────────────────────────────────────────

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    isDanger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <ModalOverlay onClose={onClose}>
            <div className="bg-retro-bg w-full max-w-sm border-4 border-retro-border rounded-xl shadow-retro relative flex flex-col">
                <div className="p-4 border-b-2 border-retro-border flex items-center gap-3">
                    {isDanger && <span className="material-symbols-outlined text-retro-action">warning</span>}
                    <h3 className="font-bold uppercase text-lg">{title}</h3>
                </div>
                <div className="p-6">
                    <p className="font-medium text-sm leading-relaxed">{message}</p>
                </div>
                <div className="p-4 border-t-2 border-retro-border bg-white flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2 font-bold border-2 border-retro-border uppercase hover:bg-gray-100 text-sm">
                        Отмена
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 py-2 font-bold border-2 border-retro-border uppercase text-white shadow-retro-sm active:translate-y-[2px] active:shadow-none transition-all text-sm ${isDanger ? 'bg-retro-action' : 'bg-accent-orange'}`}
                    >
                        Подтвердить
                    </button>
                </div>
            </div>
        </ModalOverlay>
    );
};
