import React, { useMemo } from 'react';
import { SavingsGoal } from '../../types';
import { formatKwacha, formatDate } from '../../lib/formatters';
import { 
  Target, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  PlusCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';

interface SavingsGoalsTabProps {
  savingsGoals: SavingsGoal[];
  onOpenCreateGoal: () => void;
  onOpenEditGoal: (goal: SavingsGoal) => void;
  onOpenDepositModal: (goal: SavingsGoal) => void;
  onDeleteGoal: (id: string) => void;
}

export const SavingsGoalsTab: React.FC<SavingsGoalsTabProps> = ({
  savingsGoals,
  onOpenCreateGoal,
  onOpenEditGoal,
  onOpenDepositModal,
  onDeleteGoal
}) => {
  // Compute overall savings goals aggregate
  const summary = useMemo(() => {
    const totalTarget = savingsGoals.reduce((sum, g) => sum + g.target_amount, 0);
    const totalSaved = savingsGoals.reduce((sum, g) => sum + g.current_amount, 0);
    const totalRemaining = Math.max(0, totalTarget - totalSaved);
    const overallPercentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;
    const completedGoals = savingsGoals.filter(g => g.current_amount >= g.target_amount).length;

    return { totalTarget, totalSaved, totalRemaining, overallPercentage, completedGoals };
  }, [savingsGoals]);

  return (
    <div>
      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Savings Goals
          </h2>
          <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Track and accumulate funds for your key milestones and financial security in Zambian Kwacha.
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenCreateGoal}
          className="btn-primary"
          style={{ padding: '9px 18px', fontSize: '0.9rem' }}
        >
          <Plus size={16} /> Create Goal
        </button>
      </div>

      {/* Top Aggregated Summary Card */}
      {savingsGoals.length > 0 && (
        <div className="white-card" style={{ padding: '24px 28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-navy)' }}>
              Overall Savings Progress ({summary.completedGoals} of {savingsGoals.length} completed)
            </span>
            <span style={{
              fontSize: '0.84rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: summary.overallPercentage >= 100 ? '#D1FAE5' : 'var(--color-mint)',
              color: summary.overallPercentage >= 100 ? '#059669' : 'var(--color-emerald)'
            }}>
              {summary.overallPercentage}% Completed
            </span>
          </div>

          <div style={{ height: '10px', backgroundColor: '#F1EFEA', borderRadius: '5px', overflow: 'hidden', marginBottom: '18px' }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, summary.overallPercentage)}%`,
              background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
              borderRadius: '5px',
              transition: 'width 0.3s ease'
            }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>Total Saved</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>{formatKwacha(summary.totalSaved)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>Total Target</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-navy)' }}>{formatKwacha(summary.totalTarget)}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '3px' }}>Remaining to Target</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-secondary)' }}>{formatKwacha(summary.totalRemaining)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Savings Goals Grid / Empty State */}
      {savingsGoals.length === 0 ? (
        <div className="white-card" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Target size={44} color="var(--border-subtle)" style={{ margin: '0 auto 14px auto' }} />
          <h3 style={{ color: 'var(--color-navy)', fontSize: '1.2rem', marginBottom: '6px' }}>
            No Savings Goals Set Yet
          </h3>
          <p style={{ fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            Create savings goals for building an emergency reserve, purchasing property, funding school fees, or holiday milestones.
          </p>
          <button
            type="button"
            onClick={onOpenCreateGoal}
            className="btn-primary"
            style={{ fontSize: '0.9rem', padding: '10px 22px' }}
          >
            <Plus size={16} /> Create Your First Goal
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {savingsGoals.map(g => {
            const percentage = g.target_amount > 0 ? Math.min(100, Math.round((g.current_amount / g.target_amount) * 100)) : 0;
            const remaining = Math.max(0, g.target_amount - g.current_amount);
            const isDone = g.current_amount >= g.target_amount;

            return (
              <div key={g.id} className="white-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: isDone ? '#D1FAE5' : 'var(--color-mint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isDone ? '#059669' : 'var(--color-emerald)'
                      }}>
                        {isDone ? <CheckCircle2 size={20} /> : <Target size={20} />}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                          {g.title}
                        </h4>
                        {g.target_date && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Calendar size={13} /> Target: {formatDate(g.target_date)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => onOpenEditGoal(g)}
                        title="Edit goal"
                        style={{
                          background: '#F1EFEA',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '6px'
                        }}
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteGoal(g.id)}
                        title="Delete goal"
                        style={{
                          background: '#FEE2E2',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#DC2626',
                          cursor: 'pointer',
                          padding: '6px'
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Goal Notes */}
                  {g.notes && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.4 }}>
                      {g.notes}
                    </p>
                  )}

                  {/* Progress Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Progress
                    </span>
                    <span style={{ fontWeight: 800, color: isDone ? '#059669' : 'var(--color-emerald)' }}>
                      {percentage}% {isDone ? '• Goal Achieved!' : ''}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ height: '8px', backgroundColor: '#F1EFEA', borderRadius: '4px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: isDone 
                        ? 'linear-gradient(90deg, #10B981, #059669)' 
                        : 'linear-gradient(90deg, #10B981, #00897B)',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>

                {/* Card Footer: Saved & Action */}
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderTop: '1px solid var(--border-subtle)',
                    fontSize: '0.86rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Saved</span>
                      <div style={{ fontWeight: 800, color: '#059669' }}>{formatKwacha(g.current_amount)}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Target</span>
                      <div style={{ fontWeight: 800, color: 'var(--color-navy)' }}>{formatKwacha(g.target_amount)}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenDepositModal(g)}
                    className="btn-secondary"
                    style={{
                      width: '100%',
                      marginTop: '6px',
                      justifyContent: 'center',
                      fontSize: '0.86rem',
                      padding: '9px'
                    }}
                  >
                    <PlusCircle size={15} color="var(--color-emerald)" /> Add Deposit Funds
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
