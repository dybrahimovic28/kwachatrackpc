import React from 'react';
import { 
  Coins, 
  BarChart3, 
  PieChart, 
  Smartphone
} from 'lucide-react';

export const TrustBenefitsStrip: React.FC = () => {
  const benefits = [
    {
      icon: <Coins size={22} color="var(--color-emerald)" />,
      bg: 'var(--color-mint)',
      title: "Track in Zambian Kwacha",
      description: "Designed for whole figures like K 14,250 and everyday payment channels across Zambia."
    },
    {
      icon: <BarChart3 size={22} color="var(--color-sky-text)" />,
      bg: 'var(--color-sky)',
      title: "Understand Your Spending",
      description: "Clear visual categorisation reveals exactly where your money goes each month."
    },
    {
      icon: <PieChart size={22} color="var(--color-peach-text)" />,
      bg: 'var(--color-peach)',
      title: "Plan Budgets & Savings",
      description: "Set sensible monthly category limits and build structured savings funds for future goals."
    },
    {
      icon: <Smartphone size={22} color="var(--color-lavender-text)" />,
      bg: 'var(--color-lavender)',
      title: "Access Across Devices",
      description: "Sign in with the same account on your Android phone, Windows desktop PC, or browser."
    }
  ];

  return (
    <section style={{
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: '#FFFFFF',
      padding: '44px 0'
    }}>
      <div className="responsive-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '28px'
        }}>
          {benefits.map((b, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: b.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {b.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '4px' }}>
                  {b.title}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {b.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
