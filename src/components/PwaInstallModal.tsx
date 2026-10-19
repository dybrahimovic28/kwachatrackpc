import React from 'react';
import { X, Monitor, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'already-installed' | 'manual-instructions';
  onLaunchApp?: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose,
  status,
  onLaunchApp
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(7, 13, 10, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-page)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--color-sky)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Monitor size={20} color="var(--color-sky-text)" />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-navy)' }}>
              {status === 'already-installed' ? 'KwachaTrack Desktop' : 'Install KwachaTrack on Windows'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {status === 'already-installed' ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'var(--color-mint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <CheckCircle size={32} color="var(--color-emerald)" />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '8px' }}>
                KwachaTrack is Already Running
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                You are currently viewing KwachaTrack in standalone application mode. You can access all your budgets, transactions, and savings directly.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                You can install KwachaTrack as a standalone desktop app on Windows 10 &amp; 11 directly through your browser (Microsoft Edge or Google Chrome):
              </p>

              <div style={{
                background: 'var(--bg-page)',
                padding: '16px 18px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '20px'
              }}>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '10px', lineHeight: 1.5 }}>
                  <li>
                    <strong>From the Address Bar:</strong> Click the <strong>App Available / Install</strong> icon (a computer monitor or ⊞ plus symbol) on the right side of your address bar.
                  </li>
                  <li>
                    <strong>From the Browser Menu:</strong> In Edge or Chrome, open the menu (<strong>...</strong> or <strong>⋮</strong>) &rarr; select <strong>Apps</strong> &rarr; click <strong>Install KwachaTrack</strong>.
                  </li>
                  <li>
                    Click <strong>Install</strong> in the dialog. KwachaTrack will open in its own dedicated, borderless window with taskbar and Start Menu shortcuts.
                  </li>
                </ol>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem',
                color: 'var(--color-emerald)',
                fontWeight: 600,
                marginBottom: '20px'
              }}>
                <CheckCircle size={16} /> No file download or installer setup required
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
            {onLaunchApp && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchApp();
                }}
                className="btn-primary"
                style={{ padding: '10px 18px', fontSize: '0.9rem' }}
              >
                Open Dashboard <ArrowRight size={16} />
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.9rem' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
