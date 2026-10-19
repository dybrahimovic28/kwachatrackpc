import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { SavingsGoal } from '../../types';
import { X, Check, AlertCircle } from 'lucide-react';

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  isDemoMode?: boolean;
  editingGoal?: SavingsGoal | null;
}

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  userId,
  isDemoMode = false,
  editingGoal
}) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setTargetAmount(editingGoal.target_amount.toString());
      setCurrentAmount(editingGoal.current_amount.toString());
      setTargetDate(editingGoal.target_date || '');
      setNotes(editingGoal.notes || '');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate('');
      setNotes('');
    }
    setErrorMsg(null);
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const parsedTarget = parseFloat(targetAmount);
    const parsedCurrent = parseFloat(currentAmount || '0');

    if (!title.trim()) {
      setErrorMsg('Please enter a goal title');
      return;
    }
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setErrorMsg('Target amount must be greater than zero');
      return;
    }
    if (isNaN(parsedCurrent) || parsedCurrent < 0) {
      setErrorMsg('Current saved amount cannot be negative');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = {
        user_id: userId,
        title: title.trim(),
        target_amount: Math.round(parsedTarget),
        current_amount: Math.round(parsedCurrent),
        target_date: targetDate || null,
        notes: notes.trim() || null
      };

      if (!isDemoMode) {
        if (editingGoal) {
          const { error } = await supabase
            .from('savings_goals')
            .update(payload)
            .eq('id', editingGoal.id)
            .eq('user_id', userId);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('savings_goals')
            .insert(payload);
          if (error) throw error;
        }
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save savings goal');
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
          {editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          Set a financial milestone and track your accumulation towards it in Zambian Kwacha.
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Goal Name
            </label>
            <input
              type="text"
              placeholder="e.g. Emergency Fund, Chongwe Plot Deposit"
              className="input-field"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrorMsg(null); }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Target Amount in Kwacha (ZMW)
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
                placeholder="e.g. 25000"
                className="input-field"
                style={{ paddingLeft: '36px' }}
                value={targetAmount}
                onChange={(e) => { setTargetAmount(e.target.value); setErrorMsg(null); }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Currently Saved (ZMW)
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
                min="0"
                placeholder="0"
                className="input-field"
                style={{ paddingLeft: '36px' }}
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Target Date (Optional)
            </label>
            <input
              type="date"
              className="input-field"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Notes / Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Target savings for next semester"
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
            {isSubmitting ? 'Saving...' : editingGoal ? 'Save Changes' : 'Create Goal'}
          </button>
        </form>
      </div>
    </div>
  );
};
