import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface FooterProps {
  onNavigateSection?: (sectionId: string) => void;
  onGoToApp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onGoToApp }) => {
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleNav = (sectionId?: string) => {
    if (sectionId && onNavigateSection) {
      onNavigateSection(sectionId);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-page)',
      padding: '90px 0 36px 0',
      color: 'var(--text-secondary)'
    }}>
      <div className="responsive-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          marginBottom: '44px'
        }}>
          {/* Column 1: Brand & Brief Description */}
          <div style={{ maxWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <img 
                src="./images/kwachatrack-logo.png" 
                alt="KwachaTrack Logo" 
                style={{ width: '30px', height: '30px', objectFit: 'contain', borderRadius: '6px' }} 
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-navy)' }}>
                Kwacha<span style={{ color: 'var(--color-emerald)' }}>Track</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Personal finance management for tracking income, managing expenses, planning budgets, and monitoring savings in Zambian Kwacha.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 style={{ color: 'var(--color-navy)', fontSize: '0.92rem', fontWeight: 700, marginBottom: '14px' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <button onClick={() => handleNav()} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('features')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  Features
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('how-it-works')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('devices')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  Supported Devices
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Access */}
          <div>
            <h4 style={{ color: 'var(--color-navy)', fontSize: '0.92rem', fontWeight: 700, marginBottom: '14px' }}>Access</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <li>
                <button onClick={() => handleNav('downloads')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  Downloads Centre
                </button>
              </li>
              <li>
                <button onClick={onGoToApp} style={{ background: 'none', border: 'none', color: 'var(--color-emerald)', cursor: 'pointer', padding: 0, font: 'inherit', fontWeight: 600 }}>
                  Launch Web App
                </button>
              </li>
              <li>
                <button onClick={() => setShowPrivacy(true)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0, font: 'inherit' }}>
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact / Support */}
          <div>
            <h4 style={{ color: 'var(--color-navy)', fontSize: '0.92rem', fontWeight: 700, marginBottom: '14px' }}>Support & Contact</h4>
            <p style={{ fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '10px' }}>
              For support inquiries, installation assistance, or feedback regarding KwachaTrack:
            </p>
            <a 
              href="mailto:support@kwachatrack.zm" 
              style={{ color: 'var(--color-emerald)', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600 }}
            >
              support@kwachatrack.zm
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          fontSize: '0.82rem',
          color: 'var(--text-tertiary)'
        }}>
          <div>
            © {new Date().getFullYear()} KwachaTrack. All rights reserved.
          </div>
          <div>
            Personal finance management in Zambian Kwacha (ZMW).
          </div>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(23, 36, 58, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="white-card" style={{
            maxWidth: '620px',
            width: '100%',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '36px',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowPrivacy(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer'
              }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--color-mint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={20} color="var(--color-emerald)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                KwachaTrack Privacy Policy
              </h3>
            </div>

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p>
                <strong>1. Data Ownership:</strong> All transaction records, budgets, and savings goals you record in KwachaTrack belong entirely to you. We do not sell or share personal financial data with third parties or advertising networks.
              </p>
              <p>
                <strong>2. Access Control:</strong> Your account is protected by Supabase Row Level Security (RLS). Every query requires valid user authentication matching your user ID (<code>auth.uid() = user_id</code>), preventing other accounts from reading or modifying your data.
              </p>
              <p>
                <strong>3. Client Security:</strong> KwachaTrack client software does not store administrative database credentials or service-role keys. Client connections utilize transient JWT session tokens.
              </p>
              <p>
                <strong>4. Account Rights:</strong> You can delete individual transaction records or your complete profile at any time directly through the application.
              </p>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={() => setShowPrivacy(false)}
                className="btn-primary"
                style={{ padding: '9px 22px', fontSize: '0.88rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
