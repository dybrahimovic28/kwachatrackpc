import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Globe, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Info,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { promptPwaInstall } from '../utils/pwaInstall';
import { PwaInstallModal } from './PwaInstallModal';

interface DownloadSectionProps {
  onGoToApp?: () => void;
}

export const DOWNLOAD_CONFIG = {
  android: {
    version: '1.0.0',
    fileName: 'KwachaTrack-v1.0.0.apk',
    fileSize: '21.9 MB',
    releaseUrl: import.meta.env.VITE_ANDROID_DOWNLOAD_URL || 'https://github.com/dybrahimovic28/kwachatrackANDROID/releases/download/v1.0.0/KwachaTrack-v1.0.0.apk',
    releasesPageUrl: 'https://github.com/dybrahimovic28/kwachatrackANDROID/releases'
  },
  windows: {
    version: '1.0.0',
    fileName: 'KwachaTrack-v1.0.0-Setup.exe',
    fileSize: '204.8 MB',
    releaseUrl: import.meta.env.VITE_WINDOWS_DOWNLOAD_URL || 'https://github.com/dybrahimovic28/kwachatrackpc/releases/download/v1.0.0/KwachaTrack-v1.0.0-Setup.exe',
    releasesPageUrl: 'https://github.com/dybrahimovic28/kwachatrackpc/releases'
  }
};

export const DownloadSection: React.FC<DownloadSectionProps> = ({ onGoToApp }) => {
  const [deviceHint, setDeviceHint] = useState<string>('');
  const [showAndroidHelp, setShowAndroidHelp] = useState(false);
  const [showWindowsHelp, setShowWindowsHelp] = useState(false);
  const [pwaModalStatus, setPwaModalStatus] = useState<'already-installed' | 'manual-instructions' | null>(null);

  const handlePwaInstall = async () => {
    const res = await promptPwaInstall();
    if (res === 'already-installed' || res === 'manual-instructions') {
      setPwaModalStatus(res);
    }
  };

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
                    APK v{DOWNLOAD_CONFIG.android.version} • {DOWNLOAD_CONFIG.android.fileSize}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                Standalone application package for smartphones running Android 8.0 through Android 15+.
              </p>

              <a
                href={DOWNLOAD_CONFIG.android.releaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ width: '100%', marginBottom: '14px', textDecoration: 'none' }}
              >
                <Download size={18} /> Download APK ({DOWNLOAD_CONFIG.android.fileSize})
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
                  <li>Click download to retrieve the APK package directly from official GitHub Releases.</li>
                  <li>When prompted that the file might be harmful, choose <strong>Download anyway</strong> (standard prompt for browser downloads outside Google Play).</li>
                  <li>Open the file. If asked to permit unknown apps, toggle <strong>Allow from this source</strong>.</li>
                  <li>Tap <strong>Install</strong> to complete setup. Note: The current package is a developer/debug build; production releases should be signed with a production keystore before public distribution.</li>
                  <li>You can also browse all published assets directly on <a href={DOWNLOAD_CONFIG.android.releasesPageUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>GitHub Releases</a>.</li>
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
                    Windows App
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Desktop PWA • Standalone Window
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '20px' }}>
                Install KwachaTrack directly from your browser for a dedicated desktop experience.
              </p>

              <button
                onClick={handlePwaInstall}
                className="btn-primary"
                style={{ width: '100%', marginBottom: '14px', border: 'none', cursor: 'pointer' }}
              >
                <Monitor size={18} /> Install KwachaTrack
              </button>

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
                  <li>Click <strong>Install KwachaTrack</strong> above, or look for the Install icon (⊞) in your browser's address bar in Edge or Chrome.</li>
                  <li>Alternatively, click your browser menu (<strong>...</strong>) &rarr; <strong>Apps</strong> &rarr; <strong>Install KwachaTrack</strong>.</li>
                  <li>Enjoy dedicated desktop window and shortcuts with zero Smart App Control warnings.</li>
                  <li>Need the offline setup wizard instead? <a href={DOWNLOAD_CONFIG.windows.releaseUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>Download Windows Setup (.exe)</a>.</li>
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
                Direct cloud access across all your devices
              </div>
            </div>
          </div>
        </div>
      </div>

      <PwaInstallModal
        isOpen={pwaModalStatus !== null}
        status={pwaModalStatus || 'manual-instructions'}
        onClose={() => setPwaModalStatus(null)}
        onLaunchApp={onGoToApp}
      />
    </section>
  );
};
