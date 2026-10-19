import React from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  PieChart, 
  Target, 
  Lock, 
  CreditCard,
  CheckCircle,
  Zap,
  Layers
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <ShieldAlert size={26} color="var(--primary-emerald)" />,
      title: "Non-Negative Balance Protection",
      description: "KwachaTrack mathematically prevents overspending. If an expense exceeds available funds, it is blocked immediately with a clear alert, safeguarding your solvency.",
      badge: "Financial Solvency"
    },
    {
      icon: <RefreshCw size={26} color="#60a5fa" />,
      title: "Real-Time Android & PC Sync",
      description: "Log an expense on your Samsung or Android phone while at Shoprite, and view the updated net balance on your Windows laptop the moment you open it.",
      badge: "Cross-Device"
    },
    {
      icon: <PieChart size={26} color="#fbbf24" />,
      title: "Category Monthly Budgets",
      description: "Set strict monthly spending limits on Food, ZESCO Electricity, Fuel, and Education. Visual indicators warn you before you exceed category thresholds.",
      badge: "Smart Budgets"
    },
    {
      icon: <Target size={26} color="#a855f7" />,
      title: "Goal-Oriented Savings",
      description: "Define custom savings goals with target dates. Record deposits and track percentage progress towards emergency funds, land purchases, or school fees.",
      badge: "Wealth Building"
    },
    {
      icon: <Lock size={26} color="#34d399" />,
      title: "PostgreSQL Row Level Security",
      description: "Your financial privacy is cryptographically enforced in PostgreSQL. Zero private keys are stored on device, and users are strictly isolated from one another.",
      badge: "Bank-Grade RLS"
    },
    {
      icon: <CreditCard size={26} color="#f472b6" />,
      title: "Zambian Payment Ecosystem",
      description: "Tailored for Zambia with pre-configured payment channels: MTN Mobile Money, Airtel Money, Zamtel Kwacha, Bank Transfer, Visa/Mastercard, and Cash.",
      badge: "Local First"
    }
  ];

  return (
    <section style={{ padding: '80px 0', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="responsive-container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 60px auto' }}>
          <div className="emerald-glow-pill" style={{ marginBottom: '14px' }}>
            <Layers size={14} /> Comprehensive Fintech Architecture
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Engineered for Everyday Zambian Realities
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Combining high-precision accounting rules, resilient offline-first responsiveness, and cloud synchronization across mobile and PC.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feat, index) => (
            <div 
              key={index} 
              className="glass-card" 
              style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {feat.icon}
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-muted)'
                  }}>
                    {feat.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  {feat.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {feat.description}
                </p>
              </div>

              <div style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--primary-light)',
                fontWeight: 600
              }}>
                <Zap size={14} /> Active in Android & PC versions
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
