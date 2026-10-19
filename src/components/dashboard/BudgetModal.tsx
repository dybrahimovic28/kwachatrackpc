import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Budget, Category } from '../../types';
import { X, Check, AlertCircle } from 'lucide-react';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  isDemoMode?: boolean;
  categories: Category[];
  editingBudget?: Budget | null;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  userId,
  isDemoMode = false,
  categories,
  editingBudget
}) => {
  const [categoryId, setCategoryId] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [monthYear, setMonthYear] = useState(new Date().toISOString().substring(0, 7));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseCategories = categories.filter(c => c.type === 'EXPENSE');

  useEffect(() => {
    if (editingBudget) {
      setCategoryId(editingBudget.category_id);
      setMonthlyLimit(editingBudget.monthly_limit.toString());
      setMonthYear(editingBudget.month_year);
    } else {
      setCategoryId(expenseCategories[0]?.id || '');
      setMonthlyLimit('');
      setMonthYear(new Date().toISOString().substring(0, 7));
    }
    setErrorMsg(null);
  }, [editingBudget, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const limit = parseFloat(monthlyLimit);
    if (!categoryId) {
      setErrorMsg('Please select a category for this budget');
      return;
    }
    if (isNaN(limit) || limit <= 0) {
      setErrorMsg('Monthly limit must be greater than zero');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        user_id: userId,
        category_id: categoryId,
        monthly_limit: Math.round(limit),
        month_year: monthYear
      };

      if (!isDemoMode) {
        if (editingBudget) {
          const { error } = await supabase
            .from('budgets')
            .update({ monthly_limit: Math.round(limit) })
            .eq('id', editingBudget.id)
            .eq('user_id', userId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('budgets')
            .insert(payload);
          if (error) {
            if (error.code === '23505') {
              throw new Error('A budget for this category and month already exists. You can edit the existing budget instead.');
            }
            throw error;
          }
        }
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save budget');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          maxWidth: '460px',
          width: '100%',
          padding: '30px',
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
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

        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
          {editingBudget ? 'Edit Category Budget' : 'Create Category Budget'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Set a maximum monthly spending threshold for this expense category in Zambian Kwacha.
        </p>

        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '16px',
            color: '#991B1B',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Expense Category
            </label>
            <select
              className="input-field"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={Boolean(editingBudget)}
              required
            >
              <option value="">Select Category</option>
              {expenseCategories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Monthly Spending Limit in Kwacha (ZMW)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '14px',
                top: '12px',
                fontWeight: 800,
                color: 'var(--color-emerald)'
              }}>K</span>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="e.g. 3500"
                className="input-field"
                style={{ paddingLeft: '36px' }}
                value={monthlyLimit}
                onChange={(e) => { setMonthlyLimit(e.target.value); setErrorMsg(null); }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '6px' }}>
              Budget Month (YYYY-MM)
            </label>
            <input
              type="month"
              className="input-field"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              disabled={Boolean(editingBudget)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', marginTop: '6px', padding: '13px' }}
          >
            <Check size={18} />
            {isSubmitting ? 'Saving...' : editingBudget ? 'Update Budget' : 'Create Budget'}
          </button>
        </form>
      </div>
    </div>
  );
};
