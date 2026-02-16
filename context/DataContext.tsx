import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppData, DataContextType, Transaction, BudgetCategory, Debt, Investment, AppSettings, Category } from '../types';

// --- MOCK DATA ---
const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', title: 'Пицца, Лук кольца...', category: 'Фаст-фуд', source: 'Тик-Тайм', amount: 1278, type: 'expense', date: 'Сегодня' },
    { id: '2', title: 'Магний, д3 к12, цинк...', category: 'Здоровье', source: 'Озон', amount: 2032, type: 'expense', date: 'Сегодня' },
    { id: '3', title: 'Кофе', category: 'Кофейни', source: 'Кахви', amount: 140, type: 'expense', date: 'Вчера' },
    { id: '4', title: 'Кофе', category: 'Кофейни', source: 'Кофессор', amount: 150, type: 'expense', date: 'Вчера' },
    { id: '5', title: 'Чапман', category: 'Сигареты и прочее', source: 'Табачка', amount: 265, type: 'expense', date: 'Вчера' },
    { id: '6', title: 'Зарплата', category: 'Доход', source: 'Альфа', amount: 73000, type: 'income', date: '01.01.2026' },
    { id: '7', title: 'Проезд', category: 'Транспорт', source: 'Маршрутка', amount: 50, type: 'expense', date: 'Вчера' },
];

const MOCK_BUDGET: BudgetCategory[] = [
    { id: '1', name: 'Коммунальные услуги', spent: 0, allocated: 16000, details: 'за октябрь и ноябрь' },
    { id: '2', name: 'Хобби', spent: 0, allocated: 8000, details: 'вокал 4 занятия' },
    { id: '3', name: 'Здоровье', spent: 2032, allocated: 6300, details: 'баня 4 раза, сессия...' },
    { id: '4', name: 'Подарки', spent: 0, allocated: 15000, details: 'просчитать подарки' },
    { id: '5', name: 'Еда вне дома', spent: 1278, allocated: 10000, details: 'кафе и рестораны' },
];

const MOCK_DEBTS: Debt[] = [
    { id: '1', person: 'Иван', description: 'За билеты на концерт', amount: 5000, paid: 0, dueDate: 'Бессрочно' },
    { id: '2', person: 'Аренда студии', description: 'Декабрь', amount: -12000, paid: 4000, dueDate: 'до 25 декабря' },
    { id: '3', person: 'Петр', description: 'Вернул', amount: 3000, paid: 3000, isClosed: true },
];

const MOCK_INVESTMENTS: Investment[] = [
    { id: '1', name: 'Инвесткопилка', invested: 7000, currentValue: 7953.76, profit: 953.76, percent: 13.63 },
];

const DEFAULT_SETTINGS: AppSettings = {
    currency: 'RUB',
    budgetMethod: '50/30/20'
};

const DEFAULT_CATEGORIES: Category[] = [
    // Expenses
    { id: 'e1', name: 'Подарки', type: 'expense', isStandard: true },
    { id: 'e2', name: 'Для дома', type: 'expense', isStandard: true },
    { id: 'e3', name: 'Услуги связи', type: 'expense', isStandard: true },
    { id: 'e4', name: 'Инвестиции', type: 'expense', isStandard: true },
    { id: 'e5', name: 'Коммунальные услуги', type: 'expense', isStandard: true },
    { id: 'e6', name: 'Разное', type: 'expense', isStandard: true },
    { id: 'e7', name: 'Фаст-фуд', type: 'expense', isStandard: false },
    { id: 'e8', name: 'Здоровье', type: 'expense', isStandard: false },
    { id: 'e9', name: 'Кофейни', type: 'expense', isStandard: false },
    { id: 'e10', name: 'Транспорт', type: 'expense', isStandard: false },
    
    // Income
    { id: 'i1', name: 'Зарплата', type: 'income', isStandard: true },
    { id: 'i2', name: 'Продажи', type: 'income', isStandard: true },
    { id: 'i3', name: 'Проекты', type: 'income', isStandard: true },
    { id: 'i4', name: 'Дивиденды', type: 'income', isStandard: true },
    { id: 'i5', name: 'Фриланс', type: 'income', isStandard: true },
    { id: 'i6', name: 'Прочее', type: 'income', isStandard: true },
];

const DEFAULT_DATA: AppData = {
    transactions: [],
    budget: [],
    debts: [],
    investments: [],
    settings: DEFAULT_SETTINGS,
    categories: DEFAULT_CATEGORIES,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isWelcomeScreen, setIsWelcomeScreen] = useState<boolean>(true);
    const [data, setData] = useState<AppData>(DEFAULT_DATA);

    // Initial Load
    useEffect(() => {
        const saved = localStorage.getItem('retro_finance_data');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure new fields exist
                setData({
                    ...DEFAULT_DATA,
                    ...parsed,
                    settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
                    categories: parsed.categories?.length > 0 ? parsed.categories : DEFAULT_CATEGORIES
                });
                setIsWelcomeScreen(false);
            } catch (e) {
                console.error("Failed to parse data", e);
                setIsWelcomeScreen(true);
            }
        } else {
            setIsWelcomeScreen(true);
        }
    }, []);

    // Save on Change
    useEffect(() => {
        if (!isWelcomeScreen) {
            localStorage.setItem('retro_finance_data', JSON.stringify(data));
        }
    }, [data, isWelcomeScreen]);

    const addTransaction = (t: Omit<Transaction, 'id'>) => {
        const newTransaction = { ...t, id: Date.now().toString() };
        setData(prev => ({
            ...prev,
            transactions: [newTransaction, ...prev.transactions]
        }));
    };

    const updateTransaction = (id: string, updates: Partial<Transaction>) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.map(t => t.id === id ? { ...t, ...updates } : t)
        }));
    };

    const deleteTransaction = (id: string) => {
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== id)
        }));
    };

    const addDebt = (d: Omit<Debt, 'id'>) => {
        const newDebt = { ...d, id: Date.now().toString() };
        setData(prev => ({ ...prev, debts: [newDebt, ...prev.debts] }));
    };

    const updateDebt = (id: string, updates: Partial<Debt>) => {
        setData(prev => ({
            ...prev,
            debts: prev.debts.map(d => d.id === id ? { ...d, ...updates } : d)
        }));
    };

    const deleteDebt = (id: string) => {
        setData(prev => ({ ...prev, debts: prev.debts.filter(d => d.id !== id) }));
    };

    const addInvestment = (i: Omit<Investment, 'id'>) => {
        const newInvestment = { ...i, id: Date.now().toString() };
        setData(prev => ({ ...prev, investments: [newInvestment, ...prev.investments] }));
    };

    const updateInvestment = (id: string, updates: Partial<Investment>) => {
        setData(prev => ({
            ...prev,
            investments: prev.investments.map(i => i.id === id ? { ...i, ...updates } : i)
        }));
    };

    const deleteInvestment = (id: string) => {
        setData(prev => ({ ...prev, investments: prev.investments.filter(i => i.id !== id) }));
    };

    const updateSettings = (newSettings: Partial<AppSettings>) => {
        setData(prev => ({
            ...prev,
            settings: { ...prev.settings, ...newSettings }
        }));
    };

    const addCategory = (category: Omit<Category, 'id'>) => {
        const newCategory = { ...category, id: Date.now().toString() };
        setData(prev => ({
            ...prev,
            categories: [...prev.categories, newCategory]
        }));
    };

    const updateCategory = (id: string, updates: Partial<Category>) => {
        setData(prev => ({
            ...prev,
            categories: prev.categories.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
    };

    const deleteCategory = (id: string) => {
        setData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c.id !== id)
        }));
    };

    const resetToMock = () => {
        setData({
            transactions: MOCK_TRANSACTIONS,
            budget: MOCK_BUDGET,
            debts: MOCK_DEBTS,
            investments: MOCK_INVESTMENTS,
            settings: DEFAULT_SETTINGS,
            categories: DEFAULT_CATEGORIES,
        });
        setIsWelcomeScreen(false);
    };

    const startFresh = () => {
        setData(DEFAULT_DATA);
        setIsWelcomeScreen(false);
    };

    const clearAllData = () => {
        localStorage.removeItem('retro_finance_data');
        setData(DEFAULT_DATA);
        setIsWelcomeScreen(true);
    };

    return (
        <DataContext.Provider value={{
            ...data,
            isWelcomeScreen,
            addTransaction,
            updateTransaction,
            deleteTransaction,
            addDebt,
            updateDebt,
            deleteDebt,
            addInvestment,
            updateInvestment,
            deleteInvestment,
            resetToMock,
            startFresh,
            clearAllData,
            updateSettings,
            addCategory,
            updateCategory,
            deleteCategory
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};