import React, { useState } from 'react';
import { useData } from '../context/DataContext';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'income' | 'expense';
}

export const AddTransactionModal: React.FC<ModalProps> = ({ isOpen, onClose, type }) => {
    const { addTransaction } = useData();
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [source, setSource] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!amount || !title || !category || !source) {
            alert("Пожалуйста, заполните все поля");
            return;
        }

        addTransaction({
            title,
            amount: parseFloat(amount),
            type: type,
            category,
            source,
            date: 'Сегодня' // In a real app, use new Date().toISOString()
        });
        
        // Reset and close
        setAmount('');
        setTitle('');
        setCategory('');
        setSource('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-retro-border/30 backdrop-blur-sm animate-fade-in">
            <div className="bg-retro-bg w-full max-w-md border-4 border-retro-border rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6">
                    <h2 className="text-2xl font-bold font-mono tracking-tight">{type === 'income' ? 'Новый доход' : 'Новый расход'}</h2>
                    <button onClick={onClose} className="text-retro-border hover:opacity-70 transition-opacity">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>
                <div className="px-6 pb-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold uppercase tracking-wider">Сумма *</label>
                         <div className="relative">
                            <input 
                                className="w-full bg-white border-2 border-accent-orange rounded-lg px-4 py-3 text-lg focus:ring-0 focus:border-accent-orange outline-none font-mono placeholder-gray-400 appearance-none shadow-sm" 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                             <label className="text-sm font-bold uppercase tracking-wider">Категория *</label>
                             <div className="relative">
                                <select 
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none font-sans appearance-none cursor-pointer"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="">Выбрать</option>
                                    <option value="Продукты">Продукты</option>
                                    <option value="Транспорт">Транспорт</option>
                                    <option value="Развлечения">Развлечения</option>
                                    <option value="Здоровье">Здоровье</option>
                                    <option value="Доход">Доход (Зарплата)</option>
                                </select>
                             </div>
                        </div>
                        <div className="flex flex-col gap-2">
                             <label className="text-sm font-bold uppercase tracking-wider">Счёт *</label>
                             <div className="relative">
                                <select 
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none font-sans appearance-none cursor-pointer"
                                    value={source}
                                    onChange={(e) => setSource(e.target.value)}
                                >
                                    <option value="">Выбрать</option>
                                    <option value="Наличные">Наличные</option>
                                    <option value="Карта">Карта</option>
                                </select>
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                         <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold uppercase tracking-wider">Описание *</label>
                            <input 
                                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-1 outline-none" 
                                placeholder="Например: Обед в кафе" 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        className={`w-full text-white font-bold uppercase py-3 rounded-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all mt-2 text-sm tracking-wider shadow-lg ${type === 'income' ? 'bg-accent-orange border-orange-800 hover:bg-orange-600' : 'bg-retro-action border-red-800 hover:bg-red-600'}`}
                    >
                         {type === 'income' ? 'Добавить доход' : 'Добавить расход'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    text: string;
    confirmText?: string;
    isDanger?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, text, confirmText = "Подтвердить", isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-retro-border/30 backdrop-blur-sm animate-fade-in">
            <div className="bg-retro-bg w-full max-w-sm border-4 border-retro-border rounded-xl shadow-retro relative flex flex-col">
                <div className="p-4 border-b-2 border-retro-border flex items-center gap-3">
                    {isDanger && <span className="material-symbols-outlined text-retro-action">warning</span>}
                    <h3 className="font-bold uppercase text-lg">{title}</h3>
                </div>
                <div className="p-6">
                    <p className="font-medium text-sm leading-relaxed">{text}</p>
                </div>
                <div className="p-4 border-t-2 border-retro-border bg-white flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2 font-bold border-2 border-retro-border uppercase hover:bg-gray-100 text-sm"
                    >
                        Отмена
                    </button>
                    <button 
                        onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 py-2 font-bold border-2 border-retro-border uppercase text-white shadow-retro-sm active:translate-y-[2px] active:shadow-none transition-all text-sm ${isDanger ? 'bg-retro-action' : 'bg-accent-orange'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};
