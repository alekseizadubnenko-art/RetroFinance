
import React, { useState } from 'react';
import { Button } from './ui/RetroComponents';
import { useData } from '../context/DataContext';
import { ConfirmationModal } from './Modals';
import { Category, BudgetMethod } from '../types';

export const Settings: React.FC = () => {
    const { clearAllData, resetToMock, settings, updateSettings, categories, addCategory, updateCategory, deleteCategory } = useData();
    const [isClearModalOpen, setClearModalOpen] = useState(false);
    const [isResetModalOpen, setResetModalOpen] = useState(false);
    
    // UI States
    const [newIncomeCat, setNewIncomeCat] = useState('');
    const [newExpenseCat, setNewExpenseCat] = useState('');
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [editCatName, setEditCatName] = useState('');

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        planning: true,
        incomeCategories: true,
        expenseCategories: true,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
    };

    const handleBudgetMethodChange = (method: BudgetMethod) => {
        updateSettings({ budgetMethod: method });
    };

    const handleAddCategory = (type: 'income' | 'expense') => {
        const name = type === 'income' ? newIncomeCat : newExpenseCat;
        if (!name.trim()) return;
        
        addCategory({
            name: name.trim(),
            type,
            isStandard: false
        });

        if (type === 'income') setNewIncomeCat('');
        else setNewExpenseCat('');
    };

    const handleStartEdit = (cat: Category) => {
        setEditingCatId(cat.id);
        setEditCatName(cat.name);
    };

    const handleSaveEdit = () => {
        if (editingCatId && editCatName.trim()) {
            updateCategory(editingCatId, { name: editCatName.trim() });
            setEditingCatId(null);
            setEditCatName('');
        }
    };

    const deleteCat = (id: string) => {
        deleteCategory(id);
    };

    const CategoryList = ({ type }: { type: 'income' | 'expense' }) => {
        const typeCats = categories.filter(c => c.type === type);
        const standardCats = typeCats.filter(c => c.isStandard);
        const customCats = typeCats.filter(c => !c.isStandard);

        return (
            <div className="flex flex-col gap-6">
                {/* Standard Categories */}
                <div className="border-2 border-retro-border p-0 bg-white">
                    <div className="p-4 border-b-2 border-retro-border bg-white">
                         <h4 className="font-bold uppercase text-xs text-retro-border tracking-wider">Штатные категории (Редактируемые)</h4>
                    </div>
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {standardCats.map(cat => (
                            <div key={cat.id} className="flex justify-between items-center group border-2 border-retro-border p-3 hover:shadow-retro-sm transition-all bg-white">
                                {editingCatId === cat.id ? (
                                    <div className="flex items-center gap-2 w-full">
                                        <input 
                                            className="flex-1 border-b-2 border-retro-border bg-transparent font-bold text-sm focus:outline-none"
                                            value={editCatName}
                                            onChange={(e) => setEditCatName(e.target.value)}
                                            autoFocus
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                        />
                                        <button onClick={handleSaveEdit} className="text-accent-green hover:bg-green-50 p-1 rounded">
                                            <span className="material-symbols-outlined text-lg">check</span>
                                        </button>
                                        <button onClick={() => setEditingCatId(null)} className="text-retro-action hover:bg-red-50 p-1 rounded">
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-bold text-sm">{cat.name}</span>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleStartEdit(cat)} className="text-gray-500 hover:text-retro-border p-1">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Categories */}
                <div className="border-2 border-retro-border p-0 bg-white">
                    <div className="p-4 border-b-2 border-retro-border bg-white flex justify-between items-center">
                         <h4 className="font-bold uppercase text-xs text-retro-border tracking-wider">Пользовательские категории</h4>
                         <span className="text-[10px] font-bold uppercase text-gray-500">{customCats.length} всего</span>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                         <div className="flex gap-2">
                            <input 
                                className="flex-1 px-4 py-2 border-2 border-retro-border font-bold text-sm bg-white focus:outline-none"
                                placeholder="Новая категория..."
                                value={type === 'income' ? newIncomeCat : newExpenseCat}
                                onChange={(e) => type === 'income' ? setNewIncomeCat(e.target.value) : setNewExpenseCat(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCategory(type)}
                            />
                            <button 
                                onClick={() => handleAddCategory(type)}
                                className="bg-retro-border text-white px-4 py-2 border-2 border-retro-border hover:bg-gray-800 transition-colors flex items-center gap-2 font-bold uppercase text-xs"
                            >
                                <span className="material-symbols-outlined text-lg leading-none">add</span>
                                Добавить
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {customCats.map(cat => (
                                <div key={cat.id} className="flex justify-between items-center group border-2 border-retro-border p-3 hover:shadow-retro-sm transition-all bg-white">
                                    {editingCatId === cat.id ? (
                                        <div className="flex items-center gap-2 w-full">
                                            <input 
                                                className="flex-1 border-b-2 border-retro-border bg-transparent font-bold text-sm focus:outline-none"
                                                value={editCatName}
                                                onChange={(e) => setEditCatName(e.target.value)}
                                                autoFocus
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                            />
                                            <button onClick={handleSaveEdit} className="text-accent-green p-1">
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-bold text-sm">{cat.name}</span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleStartEdit(cat)} className="text-gray-500 p-1">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button onClick={() => deleteCat(cat.id)} className="text-gray-400 hover:text-retro-action p-1">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-8 pb-20">
            <h2 className="text-3xl font-black uppercase tracking-tight">Настройки</h2>

            {/* Planning Section */}
            <div className="border-4 border-retro-border bg-white shadow-retro">
                <button 
                    onClick={() => toggleSection('planning')}
                    className="w-full p-4 flex justify-between items-center border-b-4 border-retro-border hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">analytics</span>
                        <h3 className="font-bold uppercase">Планирование и Методы</h3>
                    </div>
                    <span className="material-symbols-outlined transform transition-transform duration-300" style={{ transform: expandedSections.planning ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                </button>
                {expandedSections.planning && (
                    <div className="p-6 flex flex-col gap-6 bg-retro-bg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { id: '50/30/20', name: 'Правило 50/30/20', desc: '50% Нужды, 30% Желания, 20% Сбережения' },
                                { id: '70/20/10', name: 'Метод 70/20/10', desc: '70% Жизнь, 20% Копилка, 10% Инвест' },
                                { id: 'babylon', name: 'Самый богатый человек в Вавилоне', desc: 'Сначала заплати себе (минимум 10%)' },
                                { id: 'envelopes', name: 'Метод конвертов', desc: 'Лимиты по категориям на месяц' },
                                { id: 'zero', name: 'Нулевой бюджет', desc: 'Доход - Расход = 0 (планирование каждой копейки)' }
                            ].map((method) => (
                                <div 
                                    key={method.id} 
                                    onClick={() => handleBudgetMethodChange(method.id as BudgetMethod)}
                                    className={`p-4 border-2 border-retro-border cursor-pointer transition-all ${settings.budgetMethod === method.id ? 'bg-accent-orange text-white shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-white shadow-retro-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]'}`}
                                >
                                    <h4 className="font-bold text-sm uppercase mb-1">{method.name}</h4>
                                    <p className={`text-[10px] leading-tight font-medium uppercase ${settings.budgetMethod === method.id ? 'text-white/80' : 'text-gray-500'}`}>{method.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Categories Sections */}
            <div className="border-4 border-retro-border bg-white shadow-retro">
                 <button 
                    onClick={() => toggleSection('incomeCategories')}
                    className="w-full p-4 flex justify-between items-center border-b-4 border-retro-border hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-accent-green">trending_up</span>
                        <h3 className="font-bold uppercase">Категории доходов</h3>
                    </div>
                    <span className="material-symbols-outlined transform transition-transform duration-300" style={{ transform: expandedSections.incomeCategories ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                </button>
                {expandedSections.incomeCategories && (
                    <div className="p-6 bg-retro-bg">
                        <CategoryList type="income" />
                    </div>
                )}
            </div>

            <div className="border-4 border-retro-border bg-white shadow-retro">
                 <button 
                    onClick={() => toggleSection('expenseCategories')}
                    className="w-full p-4 flex justify-between items-center border-b-4 border-retro-border hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-retro-action">trending_down</span>
                        <h3 className="font-bold uppercase">Категории расходов</h3>
                    </div>
                    <span className="material-symbols-outlined transform transition-transform duration-300" style={{ transform: expandedSections.expenseCategories ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                </button>
                {expandedSections.expenseCategories && (
                    <div className="p-6 bg-retro-bg">
                        <CategoryList type="expense" />
                    </div>
                )}
            </div>

            {/* Data Management Section */}
            <div className="border-4 border-retro-border bg-white shadow-retro">
                <div className="p-4 flex items-center gap-3 border-b-4 border-retro-border bg-white">
                    <span className="material-symbols-outlined">database</span>
                    <h3 className="font-bold uppercase">Управление данными</h3>
                </div>
                <div className="p-6 bg-retro-bg flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={() => setResetModalOpen(true)}
                        className="flex-1 py-4 px-6 border-2 border-retro-border bg-card-retro font-bold uppercase hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all shadow-retro-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">restart_alt</span>
                        Сбросить к демо-данным
                    </button>
                    <button 
                        onClick={() => setClearModalOpen(true)}
                        className="flex-1 py-4 px-6 border-2 border-retro-border bg-retro-action text-white font-bold uppercase hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all shadow-retro-sm flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined">delete_forever</span>
                        Очистить всё хранилище
                    </button>
                </div>
            </div>

            <ConfirmationModal 
                isOpen={isClearModalOpen}
                onClose={() => setClearModalOpen(false)}
                onConfirm={clearAllData}
                title="Очистить данные?"
                message="Это действие удалит абсолютно все ваши транзакции, бюджеты и настройки без возможности восстановления. Вы уверены?"
                isDanger
            />

            <ConfirmationModal 
                isOpen={isResetModalOpen}
                onClose={() => setResetModalOpen(false)}
                onConfirm={resetToMock}
                title="Загрузить демо?"
                message="Текущие данные будут заменены на демонстрационный набор. Вы уверены?"
            />
        </div>
    );
};
