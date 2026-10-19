export type TransactionType = 'INCOME' | 'EXPENSE';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string | null;
  currency: string;
  created_at?: string | null;
}

export interface Category {
  id: string;
  user_id?: string | null;
  name: string;
  type: TransactionType;
  icon: string;
  color_hex: string;
  is_default: boolean;
  created_at?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id?: string | null;
  title: string;
  amount: number;
  type: TransactionType;
  transaction_date: string; // YYYY-MM-DD
  payment_method: string;
  notes?: string | null;
  created_at?: string;
  // Joined or client helper fields
  category_name?: string;
  category_color?: string;
  category_icon?: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  monthly_limit: number;
  month_year: string; // YYYY-MM
  created_at?: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  spent?: number;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  target_date?: string | null;
  notes?: string | null;
  created_at?: string;
}

export type PeriodFilter = 'THIS_MONTH' | 'LAST_MONTH' | 'LAST_3_MONTHS' | 'ALL_TIME';

export interface FinancialSummary {
  totalCurrentBalance: number;
  periodIncome: number;
  periodExpenses: number;
  openingBalance: number;
  netCashflow: number;
  budgetLimit: number;
  budgetSpent: number;
  savingsTarget: number;
  savingsCurrent: number;
}

declare global {
  interface Window {
    electronAPI?: {
      isDesktop: boolean;
      platform: string;
      version: string;
    };
  }
}
