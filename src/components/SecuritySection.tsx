import React from 'react';
import { 
  Lock, 
  UserCheck, 
  Key, 
  EyeOff
} from 'lucide-react';

interface SecuritySectionProps {
  onOpenPrivacy?: () => void;
}

export const SecuritySection: React.FC<SecuritySectionProps> = ({ onOpenPrivacy }) => {
  const securityPillars = [
    {
      icon: <Lock size={22} color="var(--color-emerald)" />,
      bg: 'var(--color-mint)',
      title: "Account-Level Access Controls",
      description: "Database Row Level Security ensures every query is verified against your account. Your records are isolated so no other user can query or view your financial information."
    },
    {
      icon: <UserCheck size={22} color="var(--color-sky-text)" />,
      bg: 'var(--color-sky)',
      title: "Dedicated User Ownership",
      description: "Your financial entries, budgets, and savings goals belong strictly to your personal profile. You maintain full ownership and can edit or delete entries at any time."
    },
    {
      icon: <Key size={22} color="var(--color-peach-text)" />,
      bg: 'var(--color-peach)',
      title: "No Administrative Keys on Device",
      description: "KwachaTrack client applications and download files do not contain administrative database credentials or service-role keys. Client connections use transient user session tokens."
    },
    {
      icon: <EyeOff size={22} color="var(--color-lavender-text)" />,
      bg: 'var(--color-lavender)',
      title: "No Advertising or Data Selling",
      description: "We do not sell personal financial figures or share your spending records with advertising networks. Your financial data is used solely to power your personal dashboard."
    }
  ];

  return (
    <section style={{
      padding: '90px 0',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="responsive-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 60px auto' }}>
          <div className="feature-pill feature-pill-emerald" style={{ marginBottom: '14px' }}>
            <Lock size={14} /> Security & Privacy
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--color-navy)', marginBottom: '16px' }}>
            Built with Privacy in Mind
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Your personal financial data deserves genuine protection. Here is how KwachaTrack safeguards your information without exaggerated marketing claims.
          </p>
        </div>

        {/* 4 Security Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '36px'
        }}>
          {securityPillars.map((p, index) => (
            <div key={index} className="white-card" style={{ padding: '28px 24px', background: '#F8FAFC' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: p.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px'
              }}>
                {p.icon}
              </div>
              <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reassuring note */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
            Have questions about data protection? Review our{' '}
            <button
              onClick={onOpenPrivacy}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-emerald)',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                font: 'inherit'
              }}
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>
      </div>
    </section>
  );
};
