import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Transaction, Category, TransactionType } from '../../types';
import { formatKwacha } from '../../lib/formatters';
import { X, Check, AlertTriangle } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  isDemoMode?: boolean;
  categories: Category[];
  editingTransaction?: Transaction | null;
  initialType?: TransactionType;
  availableBalance: number;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  userId,
  isDemoMode = false,
  categories,
  editingTransaction,
  initialType = 'EXPENSE',
  availableBalance
}) => {
  const [txType, setTxType] = useState<TransactionType>(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setTxType(editingTransaction.type);
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount.toString());
      setCategoryId(editingTransaction.category_id || '');
      setTransactionDate(editingTransaction.transaction_date);
      setPaymentMethod(editingTransaction.payment_method || 'Cash');
      setNotes(editingTransaction.notes || '');
    } else {
      setTxType(initialType);
      setTitle('');
      setAmount('');
      setCategoryId('');
      setTransactionDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('Cash');
      setNotes('');
    }
    setValidationError(null);
  }, [editingTransaction, initialType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const parsedAmount = parseFloat(amount);
    if (!title.trim()) {
      setValidationError('Please enter a transaction title');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Amount must be greater than zero');
      return;
    }

    // STRICT NON-NEGATIVE BALANCE VALIDATION
    if (txType === 'EXPENSE') {
      const effectiveAvailable = editingTransaction && editingTransaction.type === 'EXPENSE'
        ? availableBalance + editingTransaction.amount
        : availableBalance;

      if (parsedAmount > effectiveAvailable) {
        const formatted = formatKwacha(effectiveAvailable, 'K');
        setValidationError(`Insufficient funds. Your available balance is ${formatted}.`);
        return;
      }
    } else if (editingTransaction && editingTransaction.type === 'INCOME') {
      const netWithoutOldIncome = availableBalance - editingTransaction.amount;
      if (netWithoutOldIncome + parsedAmount < 0) {
        const formatted = formatKwacha(Math.max(0, netWithoutOldIncome), 'K');
        setValidationError(`Cannot update income: resulting balance would be negative (${formatted}).`);
        return;
      }
    }

    setIsSubmitting(true);
    setValidationError(null);

    try {
      const payload = {
        user_id: userId,
        category_id: categoryId || null,
        title: title.trim(),
        amount: Math.round(parsedAmount),
        type: txType,
        transaction_date: transactionDate,
        payment_method: paymentMethod,
        notes: notes.trim() || null
      };

      if (!isDemoMode) {
        if (editingTransaction) {
          const { error } = await supabase
            .from('transactions')
            .update(payload)
            .eq('id', editingTransaction.id)
            .eq('user_id', userId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('transactions')
            .insert(payload);
          if (error) throw error;
        }
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(c => c.type === txType);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(23, 36, 58, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px'
    }}>
      <div 
        className="white-card"
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '30px',
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          maxHeight: '92vh',
          overflowY: 'auto'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: '#F1EFEA',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '16px' }}>
          {editingTransaction ? 'Edit Transaction' : 'Record Transaction'}
        </h3>

        {/* Type Toggle: Expense vs Income */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => { setTxType('EXPENSE'); setValidationError(null); }}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: txType === 'EXPENSE' ? '1px solid #FECDD3' : '1px solid var(--border-subtle)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: txType === 'EXPENSE' ? '#FFE4E6' : '#FFFFFF',
              color: txType === 'EXPENSE' ? '#E11D48' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => { setTxType('INCOME'); setValidationError(null); }}
            style={{
              padding: '10px',
              borderRadius: '10px',
              border: txType === 'INCOME' ? '1px solid #A7F3D0' : '1px solid var(--border-subtle)',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              background: txType === 'INCOME' ? '#D1FAE5' : '#FFFFFF',
              color: txType === 'INCOME' ? '#059669' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Income (+)
          </button>
        </div>

        {/* Insufficient Funds / Validation Error Banner (Black text on #ffd8d8 pink container) */}
        {validationError && (
          <div style={{
            backgroundColor: '#ffd8d8',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid #fecaca'
          }}>
            <AlertTriangle size={18} color="#000000" style={{ flexShrink: 0 }} />
            <span style={{ color: '#000000', fontWeight: 600, fontSize: '0.86rem' }}>
              {validationError}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Amount in Zambian Kwacha (ZMW)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '12px',
                fontWeight: 800,
                color: txType === 'INCOME' ? '#059669' : '#E11D48'
              }}>K</span>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="e.g. 350"
                className="input-field"
                style={{ paddingLeft: '36px' }}
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setValidationError(null); }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Description / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Groceries at Shoprite, Net Salary"
              className="input-field"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setValidationError(null); }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Category
            </label>
            <select
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category (Optional)</option>
              {filteredCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Payment Method
            </label>
            <select
              className="input-field"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="Zamtel Kwacha">Zamtel Kwacha</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Debit/Credit Card">Debit/Credit Card</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Date
            </label>
            <input
              type="date"
              className="input-field"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Additional notes or references..."
              className="input-field"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', marginTop: '6px', padding: '13px' }}
          >
            <Check size={18} />
            {isSubmitting ? 'Saving...' : editingTransaction ? 'Save Changes' : 'Record Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};
