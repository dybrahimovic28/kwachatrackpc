import React, { useState, useMemo } from 'react';
import { Transaction, Category, TransactionType } from '../../types';
import { formatKwacha, formatSignedKwacha, formatDate } from '../../lib/formatters';
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit3, 
  Trash2, 
  Receipt,
  ArrowUpDown,
  Download
} from 'lucide-react';

interface TransactionsTabProps {
  transactions: Transaction[];
  categories: Category[];
  onOpenAddModal: (type?: TransactionType) => void;
  onOpenEditModal: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onExportCsv?: () => void;
}

export const TransactionsTab: React.FC<TransactionsTabProps> = ({
  transactions,
  categories,
  onOpenAddModal,
  onOpenEditModal,
  onDeleteTransaction,
  onExportCsv
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'ALL' || t.category_id === categoryFilter;
      const matchesPayment = paymentFilter === 'ALL' || t.payment_method === paymentFilter;

      return matchesSearch && matchesType && matchesCategory && matchesPayment;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') return b.transaction_date.localeCompare(a.transaction_date);
      if (sortBy === 'date_asc') return a.transaction_date.localeCompare(b.transaction_date);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      return 0;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter, paymentFilter, sortBy]);

  // Aggregate stats for current filter
  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach(t => {
      if (t.type === 'INCOME') income += t.amount;
      else expense += t.amount;
    });
    return {
      count: filteredTransactions.length,
      income,
      expense,
      net: income - expense
    };
  }, [filteredTransactions]);

  return (
    <div className="white-card" style={{ padding: '28px' }}>
      {/* Top Controls: Search, Filters & Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Transactions
          </h2>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Record, search, and manage all your income and expenses in Zambian Kwacha.
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {onExportCsv && (
            <button
              type="button"
              onClick={onExportCsv}
              className="btn-secondary"
              style={{ padding: '9px 16px', fontSize: '0.88rem' }}
              title="Export visible records to CSV file"
            >
              <Download size={15} /> Export CSV
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenAddModal('EXPENSE')}
            className="btn-primary"
            style={{ padding: '9px 18px', fontSize: '0.88rem' }}
          >
            <Plus size={16} /> Record Transaction
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        background: '#F8F7F3',
        padding: '16px',
        borderRadius: '14px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '20px'
      }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search by title or notes..."
            className="input-field"
            style={{ paddingLeft: '36px', height: '40px', fontSize: '0.86rem', background: '#FFFFFF' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <select
          className="input-field"
          style={{ height: '40px', fontSize: '0.86rem', background: '#FFFFFF' }}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
        >
          <option value="ALL">All Types (Income & Expense)</option>
          <option value="EXPENSE">Expense Only (-)</option>
          <option value="INCOME">Income Only (+)</option>
        </select>

        {/* Category Filter */}
        <select
          className="input-field"
          style={{ height: '40px', fontSize: '0.86rem', background: '#FFFFFF' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
          ))}
        </select>

        {/* Payment Method Filter */}
        <select
          className="input-field"
          style={{ height: '40px', fontSize: '0.86rem', background: '#FFFFFF' }}
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="ALL">All Payment Methods</option>
          <option value="Cash">Cash</option>
          <option value="MTN Mobile Money">MTN Mobile Money</option>
          <option value="Airtel Money">Airtel Money</option>
          <option value="Zamtel Kwacha">Zamtel Kwacha</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Debit/Credit Card">Debit/Credit Card</option>
        </select>

        {/* Sorting */}
        <select
          className="input-field"
          style={{ height: '40px', fontSize: '0.86rem', background: '#FFFFFF' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="date_desc">Date (Newest first)</option>
          <option value="date_asc">Date (Oldest first)</option>
          <option value="amount_desc">Amount (Highest first)</option>
          <option value="amount_asc">Amount (Lowest first)</option>
        </select>
      </div>

      {/* Aggregate Stats Summary Strip */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        marginBottom: '20px',
        fontSize: '0.86rem'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>
          Showing <strong>{stats.count}</strong> transactions
        </div>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Filtered Income: </span>
            <strong style={{ color: '#059669' }}>{formatKwacha(stats.income)}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Filtered Expenses: </span>
            <strong style={{ color: '#E11D48' }}>{formatKwacha(stats.expense)}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-secondary)' }}>Filtered Net: </span>
            <strong style={{ color: stats.net >= 0 ? '#059669' : '#E11D48' }}>
              {formatSignedKwacha(stats.net, stats.net >= 0)}
            </strong>
          </div>
        </div>
      </div>

      {/* Transactions Table / Empty State */}
      {filteredTransactions.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Receipt size={42} color="var(--border-subtle)" style={{ margin: '0 auto 14px auto' }} />
          <h4 style={{ color: 'var(--color-navy)', fontSize: '1.15rem', marginBottom: '6px' }}>
            No transactions found
          </h4>
          <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 18px auto' }}>
            {transactions.length === 0 
              ? 'Start tracking your spending by recording your first transaction in Kwacha.' 
              : 'No transactions match the selected filters. Try adjusting your search query or filter options.'}
          </p>
          <button
            type="button"
            onClick={() => onOpenAddModal('EXPENSE')}
            className="btn-primary"
            style={{ fontSize: '0.88rem', padding: '9px 20px' }}
          >
            <Plus size={16} /> Record Transaction
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 14px' }}>Transaction</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px' }}>Payment Method</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(tx => {
                const isIncome = tx.type === 'INCOME';
                const cat = categories.find(c => c.id === tx.category_id);
                return (
                  <tr 
                    key={tx.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F7F3')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{tx.title}</div>
                      {tx.notes && <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{tx.notes}</div>}
                    </td>

                    <td style={{ padding: '14px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        backgroundColor: '#F1EFEA',
                        color: 'var(--color-navy)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: cat?.color_hex || '#00796B'
                        }} />
                        {cat?.name || 'General'}
                      </span>
                    </td>

                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {tx.payment_method}
                    </td>

                    <td style={{ padding: '14px', color: 'var(--text-secondary)' }}>
                      {formatDate(tx.transaction_date)}
                    </td>

                    <td style={{
                      padding: '14px',
                      textAlign: 'right',
                      fontWeight: 800,
                      color: isIncome ? '#059669' : '#E11D48'
                    }}>
                      {formatSignedKwacha(tx.amount, isIncome)}
                    </td>

                    <td style={{ padding: '14px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(tx)}
                          title="Edit transaction"
                          style={{
                            background: '#F1EFEA',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTransaction(tx.id)}
                          title="Delete transaction"
                          style={{
                            background: '#FEE2E2',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#DC2626',
                            cursor: 'pointer',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
