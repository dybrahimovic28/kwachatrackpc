import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';
import { UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { TrustBenefitsStrip } from './components/TrustBenefitsStrip';
import { ProductShowcase } from './components/ProductShowcase';
import { HowItWorksSection } from './components/HowItWorksSection';
import { CrossDeviceSection } from './components/CrossDeviceSection';
import { SecuritySection } from './components/SecuritySection';
import { DownloadSection } from './components/DownloadSection';
import { FaqSection } from './components/FaqSection';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { Footer } from './components/Footer';
import { ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'app'>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState<boolean>(false);
  const [isDesktopApp, setIsDesktopApp] = useState<boolean>(false);

  // Centralized navigation helper that updates React state and browser history
  const navigateTo = (tab: 'home' | 'app', modal: boolean = false, replace: boolean = false) => {
    setActiveTab(tab);
    setAuthModalOpen(modal);

    const hash = modal ? '#signin' : tab === 'app' ? '#get-started' : '';
    const state = { tab, modal };
    const url = hash ? `${window.location.pathname}${hash}` : window.location.pathname;

    if (replace) {
      window.history.replaceState(state, '', url);
    } else {
      const currentState = window.history.state;
      if (!currentState || currentState.tab !== tab || currentState.modal !== modal) {
        window.history.pushState(state, '', url);
      }
    }

    if (tab === 'home' && !modal) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Browser History, Popstate, and Hash listener
  useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash;
      const targetTab = hash === '#get-started' || hash === '#app' ? 'app' : 'home';
      const targetModal = hash === '#signin';

      // Check if arriving via password recovery link
      if (hash.includes('type=recovery') || hash === '#reset-password') {
        setResetPasswordOpen(true);
      }

      setActiveTab(targetTab);
      setAuthModalOpen(targetModal);
      if (targetTab === 'home' && !targetModal) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Initial sync
    syncFromUrl();

    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        setActiveTab(e.state.tab || 'home');
        setAuthModalOpen(Boolean(e.state.modal));
        if (e.state.tab === 'home' && !e.state.modal) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        syncFromUrl();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  // Initialize session and platform checks
  useEffect(() => {
    // Check if running inside Electron desktop
    if (typeof window !== 'undefined' && window.electronAPI?.isDesktop) {
      setIsDesktopApp(true);
      navigateTo('app', false, true); // Desktop application opens straight into app view
    }

    // Check existing Supabase session (handles OAuth return or persistent session)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: (session.user.user_metadata?.full_name as string) || (session.user.user_metadata?.name as string) || (session.user.email?.split('@')[0] ?? 'User'),
          currency: 'ZMW',
          created_at: session.user.created_at
        };
        setUser(profile);
        setIsDemoMode(false);
        setActiveTab('app');
      }
    });

    // Listen to Supabase auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setResetPasswordOpen(true);
      }

      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: (session.user.user_metadata?.full_name as string) || (session.user.user_metadata?.name as string) || (session.user.email?.split('@')[0] ?? 'User'),
          currency: 'ZMW',
          created_at: session.user.created_at
        };
        setUser(profile);
        setIsDemoMode(false);
        setAuthModalOpen(false);
        setActiveTab('app');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsDemoMode(false);
        if (!isDesktopApp) {
          setActiveTab('home');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isDesktopApp]);

  const handleSelectTab = (tab: 'home' | 'app') => {
    navigateTo(tab, false);
  };

  const handleNavigateSection = (sectionId: string) => {
    if (activeTab !== 'home' || authModalOpen) {
      navigateTo('home', false);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setUser(null);
    setIsDemoMode(false);
    if (!isDesktopApp) {
      navigateTo('home', false);
    }
  };

  const handleDemoLogin = () => {
    // Demonstration profile for KwachaTrack matching Android app
    const demoProfile: UserProfile = {
      id: 'demo-user-henry',
      email: 'henry@kwachatrack.zm',
      full_name: 'Henry Svotwa',
      currency: 'ZMW',
      created_at: new Date().toISOString()
    };
    setUser(demoProfile);
    setIsDemoMode(true);
    navigateTo('app', false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__kwachaDemoLogin = handleDemoLogin;
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Section 1: Top Clean Sticky Navigation */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onNavigateSection={handleNavigateSection}
        onOpenAuth={() => navigateTo(activeTab, true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <>
            {/* Section 2: Premium Hero */}
            <LandingHero
              onGoToApp={() => navigateTo('app', false)}
              onExploreFeatures={() => handleNavigateSection('features')}
            />

            {/* Section 3: Concise Benefits Strip */}
            <TrustBenefitsStrip />

            {/* Section 4: Product Showcase (Editorial Storytelling) */}
            <ProductShowcase />

            {/* Section 5: How It Works */}
            <HowItWorksSection onGoToApp={() => navigateTo('app', false)} />

            {/* Section 6: One Account, Multiple Ways to Access */}
            <CrossDeviceSection
              onGoToDownload={() => handleNavigateSection('downloads')}
              onGoToApp={() => navigateTo('app', false)}
            />

            {/* Section 7: Security and Privacy */}
            <SecuritySection />

            {/* Section 8: Download Centre */}
            <DownloadSection onGoToApp={() => navigateTo('app', false)} />

            {/* Section 9: Compact FAQ & Section 10: Final CTA */}
            <FaqSection
              onGoToApp={() => navigateTo('app', false)}
              onGoToDownload={() => handleNavigateSection('downloads')}
            />
          </>
        )}

        {/* Web & Desktop Application Portal */}
        {activeTab === 'app' && (
          <>
            {user ? (
              <DashboardView user={user} isDemoMode={isDemoMode} />
            ) : (
              <div className="responsive-container" style={{ padding: '70px 20px 90px 20px', maxWidth: '580px', margin: '0 auto', textAlign: 'center' }}>
                <div className="white-card" style={{ padding: '44px 36px', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '18px',
                    background: 'var(--color-mint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px auto'
                  }}>
                    <UserCheck size={34} color="var(--color-emerald)" />
                  </div>

                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                    Access Your KwachaTrack Account
                  </h2>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '32px', maxWidth: '460px', margin: '0 auto 32px auto' }}>
                    Sign in with your email and password to securely load your financial records across your Android phone and Windows computer.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={() => navigateTo('app', true)}
                      className="btn-primary"
                      style={{
                        padding: '14px 36px',
                        fontSize: '1.02rem',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(22, 134, 106, 0.28)'
                      }}
                    >
                      Sign In / Register <ArrowRight size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <button
                    onClick={() => navigateTo('home', false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-navy)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <ArrowLeft size={16} /> Return to Homepage & Product Overview
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Public Marketing Footer: STRICTLY ONLY shown on Homepage */}
      {activeTab === 'home' && (
        <Footer
          onNavigateSection={handleNavigateSection}
          onGoToApp={() => navigateTo('app', false)}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => navigateTo(activeTab, false)}
        onBackToHome={() => navigateTo('home', false)}
        onAuthSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          setIsDemoMode(false);
          navigateTo('app', false);
        }}
        onDemoLogin={handleDemoLogin}
      />

      {/* Dedicated Set New Password Modal */}
      <ResetPasswordModal
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
        onSuccess={() => {
          setResetPasswordOpen(false);
          navigateTo('app', false);
        }}
      />
    </div>
  );
};

export default App;
