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
                                        <button onClick={() => setEditing