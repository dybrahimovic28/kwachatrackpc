import React from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  Target, 
  ShieldCheck, 
  Tag,
  CreditCard,
  Check,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const ProductShowcase: React.FC = () => {
  return (
    <section id="features" style={{ padding: '96px 0', backgroundColor: 'var(--bg-page)' }}>
      <div className="responsive-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 72px auto' }}>
          <div className="feature-pill feature-pill-emerald" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} /> Product Features
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--color-navy)', marginBottom: '16px' }}>
            Clarity for Every Part of Your Finances
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Designed to help you build confident spending habits, monitor your cash flow, and achieve your financial targets in Zambian Kwacha.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
          {/* Showcase A: See Your Financial Picture (Sky Blue Theme) */}
          <div className="showcase-grid">
            <div>
              <div className="feature-pill feature-pill-sky" style={{ marginBottom: '16px' }}>
                <Wallet size={14} /> Total Balance Overview
              </div>
              <h3 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', color: 'var(--color-navy)', marginBottom: '16px', lineHeight: 1.25 }}>
                See your entire financial picture at a glance
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                Know exactly where you stand at all times. KwachaTrack summarizes your net available balance, opening period funds, and monthly cash flow so you never have to guess what you can safely spend.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Instant period views: This Month, Last Month, or All Time</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Real-time calculation of net inflows versus outflows</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Whole Zambian Kwacha figures for clean readability</span>
                </li>
              </ul>
            </div>

            {/* Visual Card A */}
            <div className="white-card" style={{ padding: '32px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Net Period Balance</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--color-sky-text)', background: 'var(--color-sky)', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>October 2026</span>
              </div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '8px' }}>
                K 14,250
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--color-emerald)', marginBottom: '24px', fontWeight: 600 }}>
                +K 8,000 Net Cashflow this Month
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ background: 'var(--color-mint-subtle)', padding: '16px', borderRadius: '14px', border: '1px solid var(--color-mint)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-mint-text)', fontWeight: 600 }}>Income Received</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-mint-text)', marginTop: '4px' }}>+K 18,500</div>
                </div>
                <div style={{ background: 'var(--color-peach-subtle)', padding: '16px', borderRadius: '14px', border: '1px solid var(--color-peach)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-peach-text)', fontWeight: 600 }}>Total Expenses</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-peach-text)', marginTop: '4px' }}>-K 6,250</div>
                </div>
              </div>
            </div>
          </div>

          {/* Showcase B: Understand Every Transaction (Lavender Theme) */}
          <div className="showcase-grid reverse">
            <div>
              <div className="feature-pill feature-pill-lavender" style={{ marginBottom: '16px' }}>
                <CreditCard size={14} /> Clear Activity History
              </div>
              <h3 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', color: 'var(--color-navy)', marginBottom: '16px', lineHeight: 1.25 }}>
                Understand every transaction across local payment methods
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                From everyday grocery runs to consulting income, record transactions with the actual payment channels used in Zambia — MTN Mobile Money, Airtel Money, bank transfers, and cash.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Pre-set payment channels: MTN MoMo, Airtel Money, Bank Transfer, Visa, Cash</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Sensible categories: Food, Utilities, Transport, Health, Education</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Quick search and filter by income or expense</span>
                </li>
              </ul>
            </div>

            {/* Visual Card B */}
            <div className="white-card" style={{ padding: '28px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.95rem' }}>Recent Records</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>Chronological view</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { title: "ZESCO Token Purchase", cat: "Utilities", method: "MTN MoMo", amount: "-K 450", isIncome: false, date: "Today" },
                  { title: "Consulting Fee Deposit", cat: "Business", method: "Airtel Money", amount: "+K 12,500", isIncome: true, date: "Yesterday" },
                  { title: "Shoprite Manda Hill", cat: "Groceries", method: "Visa / Bank", amount: "-K 1,250", isIncome: false, date: "16 Oct" },
                  { title: "Puma Fuel Station", cat: "Transport", method: "Cash", amount: "-K 600", isIncome: false, date: "15 Oct" }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-navy)' }}>{item.title}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {item.cat} • {item.method} • {item.date}
                      </div>
                    </div>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: item.isIncome ? 'var(--color-emerald)' : '#DC2626'
                    }}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Showcase C: Build Smarter Budgets (Peach Theme) */}
          <div className="showcase-grid">
            <div>
              <div className="feature-pill feature-pill-peach" style={{ marginBottom: '16px' }}>
                <PieChart size={14} /> Monthly Spending Limits
              </div>
              <h3 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', color: 'var(--color-navy)', marginBottom: '16px', lineHeight: 1.25 }}>
                Build smarter budgets that keep you on track
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                Set monthly spending thresholds for high-volume categories like groceries, utilities, and transport. Visual progress bars show your usage in real time, helping you adjust before the month ends.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Clear progress indicators with percentage calculations</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Threshold colour cues warn you as you near your target</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Automatic monthly rollover preserving past performance</span>
                </li>
              </ul>
            </div>

            {/* Visual Card C */}
            <div className="white-card" style={{ padding: '30px', background: '#FFFFFF' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '20px' }}>
                Monthly Category Limits
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: "Food & Household", spent: 3200, limit: 5000, pct: 64, barColor: "var(--color-emerald)" },
                  { name: "Utilities (ZESCO & Water)", spent: 1400, limit: 2000, pct: 70, barColor: "var(--color-emerald)" },
                  { name: "Fuel & Transportation", spent: 2150, limit: 2500, pct: 86, barColor: "#F59E0B" }
                ].map((b, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-navy)' }}>{b.name}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: b.pct > 80 ? '#B45309' : 'var(--color-emerald)' }}>
                        {b.pct}% used
                      </span>
                    </div>
                    <div style={{ background: '#E2E8F0', height: '7px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ width: `${b.pct}%`, height: '100%', background: b.barColor, borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span>Spent: <strong style={{ color: 'var(--color-navy)' }}>K {b.spent.toLocaleString()}</strong></span>
                      <span>Limit: <strong style={{ color: 'var(--color-navy)' }}>K {b.limit.toLocaleString()}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Showcase D: Work Towards Your Goals (Mint Theme) */}
          <div className="showcase-grid reverse">
            <div>
              <div className="feature-pill feature-pill-emerald" style={{ marginBottom: '16px' }}>
                <Target size={14} /> Savings Milestones
              </div>
              <h3 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', color: 'var(--color-navy)', marginBottom: '16px', lineHeight: 1.25 }}>
                Work towards your savings goals consistently
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                Whether you are building an emergency buffer, saving for a plot of land, or setting aside school fees, KwachaTrack makes tracking milestones straightforward with target amounts and dates.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Set dedicated target amounts and completion deadlines</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Track deposits and see the remaining amount to reach your goal</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-navy)', fontSize: '0.94rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} color="var(--color-emerald)" />
                  </div>
                  <span>Build sustainable long-term financial resilience</span>
                </li>
              </ul>
            </div>

            {/* Visual Card D */}
            <div className="white-card" style={{ padding: '30px', background: '#FFFFFF' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '20px' }}>
                Active Savings Targets
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { title: "Emergency Buffer", current: 12000, target: 20000, pct: 60, remaining: 8000 },
                  { title: "School Fees Buffer", current: 8500, target: 10000, pct: 85, remaining: 1500 },
                  { title: "Land Plot Capital", current: 35000, target: 60000, pct: 58, remaining: 25000 }
                ].map((s, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-navy)' }}>{s.title}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald)' }}>{s.pct}%</span>
                    </div>
                    <div style={{ background: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ width: `${s.pct}%`, height: '100%', background: 'var(--color-emerald)', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span>Saved: <strong style={{ color: 'var(--color-navy)' }}>K {s.current.toLocaleString()}</strong></span>
                      <span>Target: <strong style={{ color: 'var(--color-navy)' }}>K {s.target.toLocaleString()}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Showcase E: Stay Within Your Available Balance (Restrained Warning Treatment) */}
          <div className="showcase-grid">
            <div>
              <div className="feature-pill feature-pill-sky" style={{ marginBottom: '16px' }}>
                <ShieldCheck size={14} /> Balance Safeguards
              </div>
              <h3 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', color: 'var(--color-navy)', marginBottom: '16px', lineHeight: 1.25 }}>
                Stay within your available balance automatically
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.65, marginBottom: '24px' }}>
                KwachaTrack includes built-in safeguards to prevent accidental overspending. When recording an expense, the app verifies your current available balance and prevents expenses that exceed what you have on hand.
              </p>
              <div style={{
                background: 'var(--color-sky-subtle)',
                border: '1px solid var(--color-sky)',
                borderRadius: '14px',
                padding: '16px 20px',
                color: 'var(--text-primary)',
                fontSize: '0.92rem',
                lineHeight: 1.55
              }}>
                <strong>Solvency First:</strong> Because you cannot spend what you do not have, KwachaTrack keeps you grounded in actual funds and encourages budgeting before committing expenses.
              </div>
            </div>

            {/* Visual Card E: Restrained Visual Warning Treatment (Not an oversized loud block!) */}
            <div className="white-card" style={{ padding: '28px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-navy)' }}>Add Expense Preview</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Validation check</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Expense Title</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-navy)', marginTop: '2px' }}>Emergency Vehicle Maintenance</div>
                </div>

                <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Amount</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--color-navy)', marginTop: '2px' }}>K 20,000</div>
                </div>
              </div>

              {/* Restrained, elegant insufficient funds notification */}
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#991B1B',
                fontSize: '0.88rem',
                fontWeight: 600
              }}>
                <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                <span>Insufficient funds. Your available balance is K14,250.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
