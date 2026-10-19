import React from 'react';
import { 
  Sparkles, 
  PenTool, 
  BarChart3, 
  Compass, 
  ArrowRight,
  Check
} from 'lucide-react';

interface HowItWorksSectionProps {
  onGoToApp: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onGoToApp }) => {
  const steps = [
    {
      num: "01",
      numBg: "var(--color-peach)",
      numColor: "var(--color-peach-text)",
      icon: <PenTool size={22} color="var(--color-peach-text)" />,
      title: "Track",
      tagline: "Record income & expenses",
      description: "Log your daily transactions the moment they happen. Categorize spending across food, utilities, or transport, and tag payment methods like MoMo, Airtel, or cash.",
      points: [
        "Quick transaction logging",
        "Supports MoMo, Airtel, Bank & Cash",
        "Automatic solvency verification"
      ]
    },
    {
      num: "02",
      numBg: "var(--color-sky)",
      numColor: "var(--color-sky-text)",
      icon: <BarChart3 size={22} color="var(--color-sky-text)" />,
      title: "Understand",
      tagline: "See where your money goes",
      description: "Transform daily receipts into clear visual intelligence. See period income versus expenditure, analyze category distributions, and track your net cash flow.",
      points: [
        "Instant net balance calculations",
        "Category spending distributions",
        "Clear monthly comparisons"
      ]
    },
    {
      num: "03",
      numBg: "var(--color-lavender)",
      numColor: "var(--color-lavender-text)",
      icon: <Compass size={22} color="var(--color-lavender-text)" />,
      title: "Plan",
      tagline: "Manage budgets & savings",
      description: "Set realistic category budgets to keep spending bounded. Define dedicated savings goals for school fees, land acquisitions, or emergencies.",
      points: [
        "Monthly budget progress bars",
        "Target deadlines and deposit tracking",
        "Build reliable financial habits"
      ]
    }
  ];

  return (
    <section id="how-it-works" style={{
      padding: '96px 0',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="responsive-container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '620px', margin: '0 auto 64px auto' }}>
          <div className="feature-pill feature-pill-emerald" style={{ marginBottom: '14px' }}>
            <Sparkles size={14} /> Step-by-Step
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--color-navy)', marginBottom: '16px' }}>
            How KwachaTrack Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Three simple, repeatable steps to understand your cash flow and build lasting financial discipline.
          </p>
        </div>

        {/* 3 Step Cards with Distinct Pastel Accents */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '30px',
          marginBottom: '48px'
        }}>
          {steps.map((s, index) => (
            <div key={index} className="white-card" style={{
              padding: '36px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: '#FFFFFF'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                  <div className="step-number" style={{ background: s.numBg, color: s.numColor }}>
                    {s.num}
                  </div>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: s.numBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {s.icon}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '6px' }}>
                  {s.title}
                </h3>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-emerald)', marginBottom: '16px' }}>
                  {s.tagline}
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {s.description}
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {s.points.map((p, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                      <Check size={14} color="var(--color-emerald)" style={{ flexShrink: 0 }} />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onGoToApp}
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            Start Managing Your Money <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
