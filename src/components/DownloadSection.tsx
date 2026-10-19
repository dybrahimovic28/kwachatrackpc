import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Globe, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Info
} from 'lucide-react';

interface DownloadSectionProps {
  onGoToApp?: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ onGoToApp }) => {
  const [deviceHint, setDeviceHint] = useState<string>('');
  const [showAndroidHelp, setShowAndroidHelp] = useState(false);
  const [showWindowsHelp, setShowWindowsHelp] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) {
      setDeviceHint('Detected Android device');
    } else if (/windows/i.test(ua)) {
      setDeviceHint('Detected Windows PC');
    }
  }, []);

  return (
    <section id="downloads" style={{ padding: '96px 0', backgroundColor: 'var(--bg-page)' }}>
      <div className="responsive-container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 54px auto' }}>
          <div className="feature-pill feature-pill-emerald" style={{ marginBottom: '14px' }}>
            <Download size={14} /> Available Downloads
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', color: 'var(--color-navy)', marginBottom: '16px' }}>
            Get KwachaTrack for Your Platform
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Choose the option that fits your workflow best. Download the standalone Android APK, the Windows desktop installer, or open the web application directly.
          </p>
          {deviceHint && (
            <div style={{ marginTop: '12px', fontSize: '0.84rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
              • {deviceHint} — recommended option highlighted below
            </div>
          )}
        </div>

        {/* 3 Download Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '28px',
          maxWidth: '1080px',
          margin: '0 auto 36px auto'
        }}>
          {/* Card 1: Android */}
          <div className="white-card" style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#FFFFFF'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-mint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Smartphone size={24} color="var(--color-emerald)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                    Android
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    APK v1.0.0 • 21.9 MB
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                Standalone application package for smartphones running Android 8.0 through Android 15+.
              </p>

              <a
                href="./downloads/KwachaTrack-v1.0.0.apk"
                download="KwachaTrack-v1.0.0.apk"
                className="btn-primary"
                style={{ width: '100%', marginBottom: '14px' }}
              >
                <Download size={18} /> Download APK (21.9 MB)
              </a>

              <button
                onClick={() => setShowAndroidHelp(!showAndroidHelp)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-emerald)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                {showAndroidHelp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showAndroidHelp ? "Hide installation instructions" : "Show installation instructions"}
              </button>
            </div>

            {showAndroidHelp && (
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55
              }}>
                <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Tap the download button to save the APK to your device.</li>
                  <li>When prompted that the file might be harmful, choose <strong>Download anyway</strong> (standard prompt for browser downloads outside Google Play).</li>
                  <li>Open the file. If asked to permit unknown apps, toggle <strong>Allow from this source</strong>.</li>
                  <li>Tap <strong>Install</strong> to complete setup.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Card 2: Windows */}
          <div className="white-card" style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#FFFFFF'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-sky)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Monitor size={24} color="var(--color-sky-text)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                    Windows PC
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Installer v1.0.0 • x64
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                Desktop setup wizard with Start Menu and Desktop shortcuts for Windows 10 and 11.
              </p>

              <a
                href="./downloads/KwachaTrack-v1.0.0-Setup.exe"
                download="KwachaTrack-v1.0.0-Setup.exe"
                className="btn-primary"
                style={{ width: '100%', marginBottom: '14px' }}
              >
                <Download size={18} /> Download Windows Installer
              </a>

              <button
                onClick={() => setShowWindowsHelp(!showWindowsHelp)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-emerald)',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                {showWindowsHelp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showWindowsHelp ? "Hide installation instructions" : "Show installation instructions"}
              </button>
            </div>

            {showWindowsHelp && (
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.55
              }}>
                <ol style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Download and launch <code>KwachaTrack-v1.0.0-Setup.exe</code>.</li>
                  <li>If Windows SmartScreen appears (<em>"Windows protected your PC"</em>), click <strong>More info</strong> then <strong>Run anyway</strong>. Unsigned installers commonly trigger this notice until certificate reputation builds.</li>
                  <li>Follow the setup wizard to complete installation.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Card 3: Web App */}
          <div className="white-card" style={{
            padding: '32px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: '#FFFFFF'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-lavender)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Globe size={24} color="var(--color-lavender-text)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                    Web Browser
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    No installation required
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                Open the complete personal finance dashboard instantly inside Chrome, Edge, Safari, or Firefox.
              </p>

              <button
                onClick={onGoToApp}
                className="btn-secondary"
                style={{ width: '100%', marginBottom: '14px' }}
              >
                Launch Web App <ArrowRight size={16} />
              </button>

              <div style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                Includes interactive Demo Mode without signing in
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
