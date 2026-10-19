import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Globe, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { promptPwaInstall } from '../utils/pwaInstall';
import { PwaInstallModal } from './PwaInstallModal';

interface CrossDeviceSectionProps {
  onGoToDownload: () => void;
  onGoToApp: () => void;
}

export const CrossDeviceSection: React.FC<CrossDeviceSectionProps> = ({ onGoToDownload, onGoToApp }) => {
  const [modalStatus, setModalStatus] = useState<'already-installed' | 'manual-instructions' | null>(null);

  const handleWindowsInstall = async () => {
    const res = await promptPwaInstall();
    if (res === 'already-installed' || res === 'manual-instructions') {
      setModalStatus(res);
    }
  };

  const platforms = [
    {
      icon: <Smartphone size={26} color="var(--color-emerald)" />,
      bg: 'var(--color-mint)',
      title: "Android Mobile App",
      badge: "On-the-Go Tracking",
      description: "Fast, frictionless expense recording directly on your smartphone. Log receipts at the market, supermarket, or fuel station.",
      features: [
        "Tested on Samsung Galaxy and Android devices",
        "Clean, dark fintech interface for low-light ease",
        "Standalone APK download with direct updates",
        "Fast transaction entry in just seconds"
      ],
      actionText: "Download Android App",
      onClick: onGoToDownload,
      isPrimaryAction: false
    },
    {
      icon: <Monitor size={26} color="var(--color-sky-text)" />,
      bg: 'var(--color-sky)',
      title: "Windows App",
      badge: "Full-Screen Power",
      description: "Install KwachaTrack directly from your browser for a dedicated desktop experience.",
      features: [
        "Install on supported Windows browsers",
        "Standalone app window and convenient access",
        "Manage budgets, transactions, savings, and reports"
      ],
      actionText: "Install KwachaTrack",
      onClick: handleWindowsInstall,
      isPrimaryAction: false
    },
    {
      icon: <Globe size={26} color="var(--color-lavender-text)" />,
      bg: 'var(--color-lavender)',
      title: "Web Browser Portal",
      badge: "Instant Browser Access",
      description: "Access your dashboard from any computer or tablet using Google Chrome, Microsoft Edge, Safari, or Firefox without installing anything.",
      features: [
        "Zero installation or downloads required",
        "Instant access from work, home, or shared laptops",
        "Instant access with your KwachaTrack account",
        "Fully responsive layout for any screen size"
      ],
      actionText: "Open Web App",
      onClick: onGoToApp,
      isPrimaryAction: true
    }
  ];

  return (
    <section id="devices" style={{ padding: '96px 0', backgroundColor: 'var(--bg-page)' }}>
      <div className="responsive-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px auto' }}>
          <div className="feature-pill feature-pill-emerald" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} /> Unified Platform
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--color-navy)', marginBottom: '16px' }}>
            One Account. Multiple Ways to Access.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Whether you are recording an expense on your phone, reviewing monthly budgets on your laptop, or checking balances in a browser, your financial records remain available across all your devices.
          </p>
        </div>

        {/* 3 Platform Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '30px',
          marginBottom: '50px'
        }}>
          {platforms.map((p, index) => (
            <div key={index} className="white-card" style={{
              padding: '36px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: p.isPrimaryAction ? '1px solid var(--color-emerald)' : '1px solid var(--border-subtle)',
              background: '#FFFFFF'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: p.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {p.icon}
                  </div>
                  <span style={{
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: p.bg,
                    color: 'var(--color-navy)'
                  }}>
                    {p.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '10px' }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {p.description}
                </p>

                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                  {p.features.map((f, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      <Check size={16} color="var(--color-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <button
                  onClick={p.onClick}
                  className={p.isPrimaryAction ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', padding: '12px 20px', fontSize: '0.92rem' }}
                >
                  {p.actionText} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Device Sync Info Box */}
        <div className="white-card" style={{
          padding: '24px 30px',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '750px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--color-mint)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} color="var(--color-emerald)" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '4px' }}>
                How Your Account Access Works
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Sign in with the same account across your Android phone and Windows desktop to access your personal financial records. Changes saved on one device update your database records so your figures remain consistent wherever you sign in.
              </p>
            </div>
          </div>
          <button
            onClick={onGoToApp}
            className="btn-secondary"
            style={{ padding: '11px 22px', fontSize: '0.9rem', flexShrink: 0 }}
          >
            Try in Browser
          </button>
        </div>
      </div>

      <PwaInstallModal
        isOpen={modalStatus !== null}
        status={modalStatus || 'manual-instructions'}
        onClose={() => setModalStatus(null)}
        onLaunchApp={onGoToApp}
      />
    </section>
  );
};
