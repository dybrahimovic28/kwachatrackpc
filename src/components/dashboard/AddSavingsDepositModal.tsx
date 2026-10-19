import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { SavingsGoal } from '../../types';
import { formatKwacha } from '../../lib/formatters';
import { X, Check, AlertCircle, PlusCircle } from 'lucide-react';

interface AddSavingsDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
  isDemoMode?: boolean;
  goal: SavingsGoal | null;
}

export const AddSavingsDepositModal: React.FC<AddSavingsDepositModalProps> = ({
  isOpen,
  onClose,
  onSaved,
  userId,
  isDemoMode = false,
  goal
}) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg('Deposit amount must be greater than zero');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const updatedAmount = Math.round(goal.current_amount + amount);

      if (!isDemoMode) {
        const { error } = await supabase
          .from('savings_goals')
          .update({ current_amount: updatedAmount })
          .eq('id', goal.id)
          .eq('user_id', userId);
        if (error) throw error;
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to deposit savings funds');
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
          maxWidth: '420px',
          width: '100%',
          padding: '28px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--color-mint)',
            color: 'var(--color-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <PlusCircle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
              Add Savings Deposit
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {goal.title}
            </span>
          </div>
        </div>

        <div style={{
          background: '#F8F7F3',
          borderRadius: '12px',
          padding: '12px 14px',
          margin: '14px 0 18px 0',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.86rem'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>Currently Saved:</span>
          <strong style={{ color: 'var(--color-navy)' }}>{formatKwacha(goal.current_amount)}</strong>
        </div>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Deposit Amount in Kwacha (ZMW)
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
                placeholder="e.g. 500"
                className="input-field"
                style={{ paddingLeft: '36px' }}
                value={depositAmount}
                onChange={(e) => { setDepositAmount(e.target.value); setErrorMsg(null); }}
                autoFocus
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            style={{ width: '100%', marginTop: '6px', padding: '12px' }}
          >
            <Check size={18} />
            {isSubmitting ? 'Recording...' : 'Add to Goal'}
          </button>
        </form>
      </div>
    </div>
  );
};
