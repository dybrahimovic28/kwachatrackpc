import React from 'react';
import { 
  ArrowRight, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  Sparkles, 
  Target,
  Smartphone, 
  Monitor, 
  Globe,
  Tag
} from 'lucide-react';

interface LandingHeroProps {
  onGoToApp: () => void;
  onExploreFeatures: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onGoToApp, onExploreFeatures }) => {
  return (
    <section style={{
      padding: '70px 0 90px 0',
      backgroundColor: 'var(--bg-page)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="responsive-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '54px',
          alignItems: 'center'
        }}>
          {/* Left Column: Headlines & Call to Actions */}
          <div>
            <div className="feature-pill feature-pill-emerald" style={{ marginBottom: '24px' }}>
              <Sparkles size={14} /> Personal Finance for Zambia
            </div>

            <h1 style={{
              fontSize: 'clamp(2.6rem, 5.2vw, 4.1rem)',
              lineHeight: 1.12,
              fontWeight: 800,
              marginBottom: '22px',
              color: 'var(--color-navy)',
              letterSpacing: '-0.03em'
            }}>
              Take Control of Your Money in Kwacha.
            </h1>

            <p style={{
              fontSize: '1.18rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '36px',
              maxWidth: '520px'
            }}>
              Track your spending, understand your habits, manage your budgets, and work towards your savings goals — all in one place.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '38px' }}>
              <button
                onClick={onGoToApp}
                className="btn-primary"
                style={{ padding: '15px 32px', fontSize: '1.02rem' }}
              >
                Get Started <ArrowRight size={18} />
              </button>

              <button
                onClick={onExploreFeatures}
                className="btn-secondary"
                style={{ padding: '15px 30px', fontSize: '1.02rem' }}
              >
                Explore Features
              </button>
            </div>

            {/* Supported platforms tag strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                <Smartphone size={16} color="var(--color-emerald)" /> Android
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                <Monitor size={16} color="var(--color-emerald)" /> Windows
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
                <Globe size={16} color="var(--color-emerald)" /> Web Browser
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Mockup (White elevated card with soft pastels) */}
          <div style={{ position: 'relative' }}>
            <div className="white-card" style={{
              padding: '30px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}>
              {/* Card Header & Sample Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img 
                    src="./images/kwachatrack-logo.png" 
                    alt="Logo" 
                    style={{ width: '28px', height: '28px', borderRadius: '6px' }} 
                  />
                  <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-navy)' }}>
                    KwachaTrack Dashboard
                  </span>
                </div>
                <span style={{
                  fontSize: '0.74rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'var(--color-lavender)',
                  color: 'var(--color-lavender-text)',
                  fontWeight: 700
                }}>
                  Sample Data Preview
                </span>
              </div>

              {/* Net Available Balance Display */}
              <div style={{
                background: 'linear-gradient(135deg, #17243A 0%, #202A38 100%)',
                borderRadius: '16px',
                padding: '24px',
                color: '#FFFFFF',
                marginBottom: '18px',
                boxShadow: '0 8px 24px rgba(23, 36, 58, 0.25)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 500 }}>
                    Total Available Balance
                  </span>
                  <Wallet size={18} color="#64FFDA" />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', margin: '4px 0 10px 0' }}>
                  K 14,250
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '10px' }}>
                  <span style={{ color: '#CBD5E1' }}>Period: <strong>October 2026</strong></span>
                  <span style={{ color: '#64FFDA', fontWeight: 700 }}>+K 8,000 Net Cashflow</span>
                </div>
              </div>

              {/* Income & Expense Summaries in Soft Mint and Soft Peach Pills */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                  background: 'var(--color-mint)',
                  borderRadius: '12px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-mint-text)', fontWeight: 600 }}>Period Income</span>
                    <ArrowUpRight size={16} color="var(--color-mint-text)" />
                  </div>
                  <div style={{ fontSize: '1.28rem', fontWeight: 800, color: 'var(--color-mint-text)' }}>
                    +K 18,500
                  </div>
                </div>

                <div style={{
                  background: 'var(--color-peach)',
                  borderRadius: '12px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-peach-text)', fontWeight: 600 }}>Period Expenses</span>
                    <ArrowDownRight size={16} color="var(--color-peach-text)" />
                  </div>
                  <div style={{ fontSize: '1.28rem', fontWeight: 800, color: 'var(--color-peach-text)' }}>
                    -K 6,250
                  </div>
                </div>
              </div>

              {/* Spending Breakdown Pastel Bar */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                  <span>Spending Distribution</span>
                  <span>K 6,250 Total</span>
                </div>
                <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden', gap: '2px' }}>
                  <div style={{ width: '42%', background: '#F59E0B' }} title="Food & Groceries (42%)" />
                  <div style={{ width: '26%', background: '#3B82F6' }} title="Utilities & ZESCO (26%)" />
                  <div style={{ width: '18%', background: '#8B5CF6' }} title="Fuel & Commute (18%)" />
                  <div style={{ width: '14%', background: '#10B981' }} title="Savings & Other (14%)" />
                </div>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} /> Food 42%
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} /> Utilities 26%
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8B5CF6' }} /> Fuel 18%
                  </span>
                </div>
              </div>

              {/* Monthly Category Budget Mini-Card */}
              <div style={{
                background: 'var(--color-sky-subtle)',
                border: '1px solid var(--color-sky)',
                borderRadius: '12px',
                padding: '14px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={14} color="var(--color-sky-text)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy)' }}>Food & Groceries Budget</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-sky-text)' }}>64% used</span>
                </div>
                <div style={{ background: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ width: '64%', height: '100%', background: 'var(--color-emerald)', borderRadius: '3px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  <span>Spent: <strong style={{ color: 'var(--color-navy)' }}>K 3,200</strong></span>
                  <span>Limit: <strong style={{ color: 'var(--color-navy)' }}>K 5,000</strong></span>
                </div>
              </div>

              {/* Savings Goal Progress */}
              <div style={{
                background: 'var(--color-mint-subtle)',
                border: '1px solid var(--color-mint)',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Target size={14} color="var(--color-mint-text)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy)' }}>Emergency Buffer</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-mint-text)' }}>60% saved</span>
                </div>
                <div style={{ background: '#E2E8F0', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{ width: '60%', height: '100%', background: '#10B981', borderRadius: '3px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  <span>Saved: <strong style={{ color: 'var(--color-navy)' }}>K 12,000</strong></span>
                  <span>Target: <strong style={{ color: 'var(--color-navy)' }}>K 20,000</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
