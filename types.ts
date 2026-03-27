export type ViewState = 'dashboard' | 'transactions' | 'budget' | 'debts' | 'investments' | 'settings';

export interface Transaction {
    id: string;
    title: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    source?: string;
}

export interface Debt {
    id: string;
    person: string;
    description: string;
    amount: number; // Positive = they owe me, Negative = I owe them
    paid: number;
    dueDate?: string;
    isClosed?: boolean;
}

export interface BudgetCategory {
    id: string;
    name: string;
    allocated: number;
    spent: number;
    details?: string;
}

export interface Investment {
    id: string;
    name: string;
    invested: number;
    currentValue: number;
    profit: number;
    percent: number;
}

export type BudgetMethod = '50/30/20' | '70/20/10' | 'babylon' | 'envelopes' | 'zero';

export interface AppSettings {
    currency: string;
    budgetMethod: BudgetMethod;
}

export interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense';
    isStandard: boolean;
}

export interface AppData {
    transactions: Transaction[];
    budget: BudgetCategory[];
    debts: Debt[];
    investments: Investment[];
    settings: AppSettings;
    categories: Category[];
}

export interface DataContextType extends AppData {
    isWelcomeScreen: boolean;
    addTransaction: (t: Omit<Transaction, 'id'>) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;
    deleteTransaction: (id: string) => void;
    addDebt: (d: Omit<Debt, 'id'>) => void;
    updateDebt: (id: string, updates: Partial<Debt>) => void;
    deleteDebt: (id: string) => void;
    addInvestment: (i: Omit<Investment, 'id'>) => void;
    updateInvestment: (id: string, updates: Partial<Investment>) => void;
    deleteInvestment: (id: string) => void;
    resetToMock: () => void;
    startFresh: () => void;
    clearAllData: () => void;
    updateSettings: (settings: Partial<AppSettings>) => void;
    addCategory: (category: Omit<Category, 'id'>) => void;
    updateCategory: (id: string, updates: Partial<Category>) => void;
    deleteCategory: (id: string) => void;
}