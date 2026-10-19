import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

interface FaqSectionProps {
  onGoToApp: () => void;
  onGoToDownload: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onGoToApp, onGoToDownload }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is KwachaTrack?",
      a: "KwachaTrack is a personal finance management application designed to help individuals and households in Zambia track income and expenses, establish monthly category budgets, monitor savings milestones, and prevent overspending in Zambian Kwacha (ZMW)."
    },
    {
      q: "Which devices are supported?",
      a: "KwachaTrack is available on three platforms: as a native Android application (APK tested on Android 8.0 to Android 15), as a native Windows desktop application for Windows 10 and 11, and as a browser-based web application accessible from any modern web browser."
    },
    {
      q: "Can I access the same account on multiple devices?",
      a: "Yes. When you sign in with the same email and password on your Android phone and Windows desktop, your data connects to your private database account. Records created on one platform update your account so your figures remain consistent across devices."
    },
    {
      q: "How is my financial data protected?",
      a: "Your records are protected by database-level Row Level Security (RLS) policies. Every query requires authenticated user credentials (auth.uid() = user_id), ensuring no user can access another user's financial information. No administrative database keys are stored in client applications."
    },
    {
      q: "How do I install the Android or Windows application?",
      a: "For Android, download the APK from the Downloads section, permit installation from your browser when prompted, and tap Install. For Windows, download the setup file, click 'More info' and 'Run anyway' if Windows SmartScreen displays a warning for the new installer, and follow the setup wizard."
    },
    {
      q: "Is the Web App available without installation?",
      a: "Yes. You can open the complete KwachaTrack web application directly in Google Chrome, Microsoft Edge, Safari, or Firefox without downloading software. Sign in with your email or Continue with Google to access your financial records immediately across your devices."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{ padding: '96px 0 0 0', backgroundColor: '#FFFFFF' }}>
      <div className="responsive-container">
        {/* Section 9: Compact FAQ */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 54px auto' }}>
          <div className="feature-pill feature-pill-emerald" style={{ marginBottom: '14px' }}>
            <HelpCircle size={14} /> Questions & Answers
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--color-navy)', marginBottom: '16px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Accurate, straightforward answers about using KwachaTrack across your devices.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ maxWidth: '820px', margin: '0 auto 96px auto' }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`faq-item-clean ${isOpen ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                  <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                    {faq.q}
                  </h4>
                  <div style={{ color: isOpen ? 'var(--color-emerald)' : 'var(--text-tertiary)' }}>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isOpen && (
                  <p style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    marginTop: '14px',
                    marginBottom: 0,
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px'
                  }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Section 10: Final Call to Action (Deep Midnight Navy with soft accents - NOT generic green!) */}
        <div style={{
          background: 'linear-gradient(135deg, #17243A 0%, #202A38 100%)',
          borderRadius: '24px',
          padding: '64px 40px',
          textAlign: 'center',
          color: '#FFFFFF',
          maxWidth: '980px',
          margin: '0 auto -48px auto',
          position: 'relative',
          zIndex: 10,
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div className="feature-pill" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#64FFDA',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Sparkles size={14} /> Start Today
          </div>

          <h2 style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.2rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '18px', letterSpacing: '-0.025em' }}>
            Make Every Kwacha Count.
          </h2>

          <p style={{ color: '#CBD5E1', fontSize: '1.1rem', lineHeight: 1.65, maxWidth: '580px', margin: '0 auto 36px auto' }}>
            Track your spending, understand your financial habits, manage category budgets, and build your savings with confidence.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={onGoToApp}
              className="btn-primary"
              style={{ padding: '15px 36px', fontSize: '1.02rem' }}
            >
              Get Started <ArrowRight size={18} />
            </button>

            <button
              onClick={onGoToDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                fontWeight: 600,
                padding: '15px 28px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                fontSize: '1.02rem',
                textDecoration: 'none'
              }}
            >
              Explore Available Platforms
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
