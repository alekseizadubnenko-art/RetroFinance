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
    const [converterAmount, setConverterAmount] = useState('0.00');
    const [newIncomeCat, setNewIncomeCat] = useState('');
    const [newExpenseCat, setNewExpenseCat] = useState('');
    const [editingCatId, setEditingCatId] = useState<string | null>(null);
    const [editCatName, setEditCatName] = useState('');

    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        currency: true,
        planning: true,
        storage: true,
        incomeCategories: true,
        expenseCategories: true,
        management: true
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({...prev, [section]: !prev[section]}));
    };

    const handleBudgetMethodChange = (method: BudgetMethod) => {
        updateSettings({ budgetMethod: method });
    };

    const handleAddCategory = (type: 'income' | 'expense', isStandard = false) => {
        const name = type === 'income' ? newIncomeCat : newExpenseCat;
        if (!isStandard && !name.trim()) return;
        
        const catName = isStandard ? "Новая категория" : name.trim();

        addCategory({
            name: catName,
            type,
            isStandard
        });

        if (!isStandard) {
            if (type === 'income') setNewIncomeCat('');
            else setNewExpenseCat('');
        }
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
        // Confirmation could be added here
        deleteCategory(id);
    }

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
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') handleSaveEdit();
                                            }}
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
                                        <span className="font-bold text-sm flex-1 truncate">{cat.name}</span>
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleStartEdit(cat)} className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </button>
                                            {!cat.isStandard && (
                                                <button onClick={() => deleteCat(cat.id)} className="text-retro-action hover:bg-red-50 p-1 rounded">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            )}
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
                        <button onClick={() => handleAddCategory(type, false)} className="text-accent-orange hover:bg-orange-50 p-1 rounded">
                            <span className="material-symbols-outlined text-lg">add</span>
                        </button>
                    </div>
                    <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {customCats.map(cat => (
                            <div key={cat.id} className="flex justify-between items-center group border-2 border-retro-border p-3 hover:shadow-retro-sm transition-all bg-white">
                                <span className="font-bold text-sm flex-1 truncate">{cat.name}</span>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => deleteCat(cat.id)} className="text-retro-action hover:bg-red-50 p-1 rounded">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t-2 border-retro-border bg-gray-50">
                        <input
                            className="w-full bg-white border-2 border-retro-border font-bold text-sm focus:ring-0 focus:border-retro-border focus:outline-none placeholder:text-gray-500 placeholder:uppercase rounded-none appearance-none p-3"
                            placeholder="Новая категория..."
                            value={type === 'income' ? newIncomeCat : newExpenseCat}
                            onChange={(e) => type === 'income' ? setNewIncomeCat(e.target.value) : setNewExpenseCat(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter') handleAddCategory(type, false);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-black uppercase">Настройки</h2>

            {/* Currency & Planning */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="flex flex-col gap-8">
                    {/* Currency Settings */}
                    <div className="border-2 border-retro-border bg-white shadow-retro">
                        <button onClick={() => toggleSection('currency')} className="p-4 w-full flex justify-between items-center border-b-2 border-retro-border bg-retro-bg">
                            <h3 className="font-bold uppercase">Валюта и форматы</h3>
                            <span className="material-symbols-outlined transition-transform">{expandedSections.currency ? 'expand_less' : 'expand_more'}</span>
                        </button>
                        {expandedSections.currency && (
                            <div className="p-4 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => updateSettings({ currency: e.target.value })}
                                        className="w-full p-3 bg-white border-2 border-retro-border font-bold text-sm uppercase cursor-pointer"
                                    >
                                        <option>RUB</option>
                                        <option>USD</option>
                                        <option>EUR</option>
                                    </select>
                                    <span className="font-bold text-gray-400">Основная</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Planning Method */}
                    <div className="border-2 border-retro-border bg-white shadow-retro">
                        <button onClick={() => toggleSection('planning')} className="p-4 w-full flex justify-between items-center border-b-2 border-retro-border bg-retro-bg">
                            <h3 className="font-bold uppercase">Метод планирования</h3>
                            <span className="material-symbols-outlined transition-transform">{expandedSections.planning ? 'expand_less' : 'expand_more'}</span>
                        </button>
                        {expandedSections.planning && (
                            <div className="p-4 grid grid-cols-2 gap-3">
                                {(['50/30/20', '70/20/10', 'babylon', 'zero', 'envelopes'] as BudgetMethod[]).map(method => (
                                    <button
                                        key={method}
                                        onClick={() => handleBudgetMethodChange(method)}
                                        className={`p-3 border-2 border-retro-border font-bold text-sm uppercase text-center ${settings.budgetMethod === method ? 'bg-accent-orange text-white' : 'bg-white hover:bg-gray-50'}`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Data Management */}
                <div className="border-2 border-retro-border bg-white shadow-retro h-fit">
                    <button onClick={() => toggleSection('management')} className="p-4 w-full flex justify-between items-center border-b-2 border-retro-border bg-retro-bg">
                        <h3 className="font-bold uppercase">Управление данными</h3>
                        <span className="material-symbols-outlined transition-transform">{expandedSections.management ? 'expand_less' : 'expand_more'}</span>
                    </button>
                    {expandedSections.management && (
                         <div className="p-4 flex flex-col gap-4">
                            <Button variant="secondary" icon="science_t" onClick={() => setResetModalOpen(true)}>Загрузить демо-данные</Button>
                            <Button variant="danger" icon="delete_forever" onClick={() => setClearModalOpen(true)}>Удалить все данные</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Management */}
            <div className="border-2 border-retro-border bg-white shadow-retro">
                <button onClick={() => toggleSection('incomeCategories')} className="p-4 w-full flex justify-between items-center border-b-2 border-retro-border bg-retro-bg">
                    <h3 className="font-bold uppercase">Категории доходов</h3>
                    <span className="material-symbols-outlined transition-transform">{expandedSections.incomeCategories ? 'expand_less' : 'expand_more'}</span>
                </button>
                {expandedSections.incomeCategories && (
                    <div className="p-4">
                        <CategoryList type="income" />
                    </div>
                )}
            </div>
             <div className="border-2 border-retro-border bg-white shadow-retro">
                <button onClick={() => toggleSection('expenseCategories')} className="p-4 w-full flex justify-between items-center border-b-2 border-retro-border bg-retro-bg">
                    <h3 className="font-bold uppercase">Категории расходов</h3>
                    <span className="material-symbols-outlined transition-transform">{expandedSections.expenseCategories ? 'expand_less' : 'expand_more'}</span>
                </button>
                {expandedSections.expenseCategories && (
                    <div className="p-4">
                        <CategoryList type="expense" />
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isClearModalOpen}
                onClose={() => setClearModalOpen(false)}
                onConfirm={clearAllData}
                title="Удалить все данные?"
                text="Это действие необратимо. Вся ваша финансовая информация будет стерта."
                confirmText="Да, удалить"
            />
            <ConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setResetModalOpen(false)}
                onConfirm={resetToMock}
                title="Загрузить демо-данные?"
                text="Текущие данные будут заменены на демонстрационный набор. Вы сможете их удалить в любой момент."
                confirmText="Да, загрузить"
            />
        </div>
    );
};
