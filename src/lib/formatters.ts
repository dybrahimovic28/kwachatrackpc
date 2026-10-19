import { PeriodFilter, Transaction } from '../types';

/**
 * Formats a number into a whole Zambian Kwacha string (e.g. "K 12,450" or "-K 50").
 */
export function formatKwacha(amount: number, prefix: string = 'K '): string {
  const rounded = Math.round(amount);
  const formatted = Math.abs(rounded).toLocaleString('en-US');
  if (rounded < 0) {
    return prefix.endsWith(' ') ? `-${prefix.trim()} ${formatted}` : `-${prefix}${formatted}`;
  }
  return `${prefix}${formatted}`;
}

/**
 * Formats with explicit sign (+K 5,000 or -K 1,200).
 */
export function formatSignedKwacha(amount: number, isIncome: boolean, prefix: string = 'K '): string {
  const sign = isIncome ? '+' : '-';
  const formatted = Math.abs(Math.round(amount)).toLocaleString('en-US');
  return `${sign}${prefix}${formatted}`;
}

/**
 * Extracts a single uppercase initial from the user's given name.
 * Examples: "Henry Svotwa" -> "H", "Brendon Svotwa" -> "B", "Alice Banda" -> "A".
 * Falls back safely to email prefix or "U".
 */
export function getAvatarInitial(fullName?: string | null, email?: string): string {
  if (fullName && fullName.trim()) {
    const parts = fullName.trim().split(/\s+/);
    const firstWord = parts.find((p) => p.length > 0);
    if (firstWord && /^[a-zA-Z]/.test(firstWord)) {
      return firstWord[0].toUpperCase();
    }
  }
  if (email && email.trim()) {
    const prefix = email.split('@')[0];
    const firstChar = prefix.split('').find((c) => /^[a-zA-Z]/.test(c));
    if (firstChar) {
      return firstChar.toUpperCase();
    }
  }
  return 'U';
}

/**
 * Calculates start and end dates (YYYY-MM-DD) for standard periods.
 */
export function getDateRangeForPeriod(period: PeriodFilter): { start: string | null; end: string | null } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  if (period === 'THIS_MONTH') {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
      start: formatDateToIso(start),
      end: formatDateToIso(end)
    };
  }

  if (period === 'LAST_MONTH') {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return {
      start: formatDateToIso(start),
      end: formatDateToIso(end)
    };
  }

  if (period === 'LAST_3_MONTHS') {
    const start = new Date(year, month - 2, 1);
    const end = new Date(year, month + 1, 0);
    return {
      start: formatDateToIso(start),
      end: formatDateToIso(end)
    };
  }

  return { start: null, end: null };
}

function formatDateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats a Date or ISO string into readable format (e.g. "18 Oct 2026").
 */
export function formatDate(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (y && m && d) {
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Generates and downloads a clean CSV file from user transactions.
 */
export function exportTransactionsToCsv(transactions: Transaction[], filename = 'kwachatrack_transactions.csv') {
  const headers = ['Date', 'Title', 'Type', 'Amount (ZMW)', 'Category', 'Payment Method', 'Notes'];
  const rows = transactions.map(t => [
    t.transaction_date,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.type,
    t.amount,
    `"${(t.category_name || '').replace(/"/g, '""')}"`,
    `"${(t.payment_method || '').replace(/"/g, '""')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
