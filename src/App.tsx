import React, { useState, useEffect, useCallback, useRef } from 'react';
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

/**
 * Builds a standardized UserProfile object from a Supabase auth User.
 */
const buildUserProfile = (authUser: any, profileRecord?: any): UserProfile => {
  const metadata = authUser?.user_metadata || {};
  return {
    id: authUser.id,
    email: authUser.email || '',
    full_name:
      profileRecord?.full_name ||
      metadata.full_name ||
      metadata.name ||
      (authUser.email ? authUser.email.split('@')[0] : 'User'),
    currency: profileRecord?.currency || 'ZMW',
    created_at: authUser.created_at
  };
};

/**
 * Inspects whether the current URL contains OAuth tokens or auth exchange parameters.
 */
const checkUrlForAuthTokens = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash || '';
  const search = window.location.search || '';
  return (
    hash.includes('access_token=') ||
    hash.includes('refresh_token=') ||
    hash.includes('error=') ||
    search.includes('code=') ||
    search.includes('error=')
  );
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'app'>('home');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState<boolean>(false);
  const [isDesktopApp, setIsDesktopApp] = useState<boolean>(false);
  const [isAuthInitializing, setIsAuthInitializing] = useState<boolean>(true);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  // Keep a ref to the latest user to avoid stale closures in event listeners
  const userRef = useRef<UserProfile | null>(null);
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Centralized navigation helper that updates React state and browser history
  const navigateTo = useCallback(
    (tab: 'home' | 'app', modal: boolean = false, replace: boolean = false) => {
      setActiveTab(tab);
      setAuthModalOpen(modal);

      const hash = modal ? '#signin' : tab === 'app' ? '#app' : '';
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
    },
    []
  );

  // Synchronize state when browser URL hash changes or popstate occurs
  const syncFromUrl = useCallback(() => {
    const hash = window.location.hash || '';
    const search = window.location.search || '';

    // Check if arriving via password recovery first
    if (
      hash.includes('type=recovery') ||
      search.includes('type=recovery') ||
      hash === '#reset-password'
    ) {
      setResetPasswordOpen(true);
      setIsAuthInitializing(false);
      return;
    }

    // If URL currently contains OAuth tokens or code exchange, let auth handler process it
    if (
      hash.includes('access_token=') ||
      hash.includes('refresh_token=') ||
      search.includes('code=')
    ) {
      return;
    }

    if (hash === '#app' || hash === '#get-started') {
      setActiveTab('app');
      setAuthModalOpen(false);
    } else if (hash === '#signin') {
      setAuthModalOpen(true);
    } else if (hash === '' || hash === '#home') {
      // If the user has an active authenticated session and the hash was cleared
      // (e.g. Supabase removing tokens from URL fragment), DO NOT kick the user back to the landing page!
      if (userRef.current && hash !== '#home') {
        setActiveTab('app');
      } else {
        setActiveTab('home');
        setAuthModalOpen(false);
      }
    }
  }, []);

  // Set up listeners for popstate and hashchange
  useEffect(() => {
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
  }, [syncFromUrl]);

  // Handle authenticated session transition
  const handleAuthenticatedSession = useCallback(
    (sessionUser: any) => {
      const profile = buildUserProfile(sessionUser);
      setUser(profile);
      setIsDemoMode(false);
      setAuthModalOpen(false);
      setActiveTab('app');
      setIsAuthInitializing(false);

      // Clean URL: remove any remaining tokens or code parameters and cleanly set to #app
      const currentHash = window.location.hash || '';
      const currentSearch = window.location.search || '';
      if (
        currentHash.includes('access_token=') ||
        currentHash.includes('refresh_token=') ||
        currentSearch.includes('code=')
      ) {
        window.history.replaceState(
          { tab: 'app', modal: false },
          '',
          `${window.location.pathname}#app`
        );
      }
    },
    []
  );

  // Initialize platform, URL error checks, and Supabase session
  useEffect(() => {
    // 1. Check if running inside Electron desktop
    if (typeof window !== 'undefined' && window.electronAPI?.isDesktop) {
      setIsDesktopApp(true);
      setActiveTab('app');
    }

    // 2. Check for OAuth callback error in URL parameters
    const currentHash = window.location.hash || '';
    const currentSearch = window.location.search || '';
    if (currentHash.includes('error=') || currentSearch.includes('error=')) {
      const rawParams = currentHash.startsWith('#')
        ? currentHash.substring(1)
        : currentSearch.startsWith('?')
        ? currentSearch.substring(1)
        : '';
      const params = new URLSearchParams(rawParams);
      const desc =
        params.get('error_description') ||
        params.get('error') ||
        'Authentication could not be completed.';
      setAuthErrorMessage(decodeURIComponent(desc.replace(/\+/g, ' ')));
      window.history.replaceState({ tab: 'home', modal: true }, '', window.location.pathname);
      setAuthModalOpen(true);
      setIsAuthInitializing(false);
      return;
    }

    // 3. Check for password recovery link
    if (
      currentHash.includes('type=recovery') ||
      currentSearch.includes('type=recovery') ||
      currentHash === '#reset-password'
    ) {
      setResetPasswordOpen(true);
    }

    // 4. Retrieve existing session from Supabase (handles persisted session or newly parsed OAuth tokens)
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          handleAuthenticatedSession(session.user);
        } else {
          // No active session found: inspect initial hash to determine tab
          const hash = window.location.hash;
          if (hash === '#app' || hash === '#get-started') {
            setActiveTab('app');
          } else if (hash === '#signin') {
            setActiveTab('home');
            setAuthModalOpen(true);
          } else {
            setActiveTab('home');
          }
          setIsAuthInitializing(false);
        }
      })
      .catch((err) => {
        console.error('Session retrieval error:', err);
        setIsAuthInitializing(false);
      });

    // 5. Listen for Supabase auth state changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setResetPasswordOpen(true);
        setIsAuthInitializing(false);
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        if (session?.user) {
          handleAuthenticatedSession(session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsDemoMode(false);
        setIsAuthInitializing(false);
        if (!isDesktopApp) {
          setActiveTab('home');
          window.history.replaceState({ tab: 'home', modal: false }, '', window.location.pathname);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleAuthenticatedSession, isDesktopApp]);

  // Navigation handlers
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

  // Primary action handler for "Get Started" across marketing pages
  const handleGetStarted = () => {
    if (user) {
      navigateTo('app', false);
    } else {
      // Direct access to sign-in modal so user can immediately choose Continue with Google or email
      navigateTo('app', true);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__kwachaDemoLogin = handleDemoLogin;
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      {/* Top Clean Sticky Navigation */}
      <Navbar
        user={user}
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onNavigateSection={handleNavigateSection}
        onOpenAuth={() => navigateTo(activeTab, true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative' }}>
        {/* Loading Workspace Overlay (only on initial session detection) */}
        {isAuthInitializing && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'var(--bg-page)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99,
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'var(--color-mint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(22, 134, 106, 0.18)'
              }}
            >
              <img
                src="./images/kwachatrack-logo.png"
                alt="KwachaTrack"
                style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '10px' }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '4px' }}>
                Kwacha<span style={{ color: 'var(--color-emerald)' }}>Track</span>
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
                Loading your financial workspace...
              </p>
            </div>
          </div>
        )}

        {/* Homepage & Marketing Experience */}
        {activeTab === 'home' && (
          <>
            <LandingHero
              onGoToApp={handleGetStarted}
              onExploreFeatures={() => handleNavigateSection('features')}
            />
            <TrustBenefitsStrip />
            <ProductShowcase />
            <HowItWorksSection onGoToApp={handleGetStarted} />
            <CrossDeviceSection
              onGoToDownload={() => handleNavigateSection('downloads')}
              onGoToApp={handleGetStarted}
            />
            <SecuritySection />
            <DownloadSection onGoToApp={handleGetStarted} />
            <FaqSection
              onGoToApp={handleGetStarted}
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
              <div
                className="responsive-container"
                style={{
                  padding: '70px 20px 90px 20px',
                  maxWidth: '580px',
                  margin: '0 auto',
                  textAlign: 'center'
                }}
              >
                <div
                  className="white-card"
                  style={{
                    padding: '44px 36px',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div
                    style={{
                      width: '68px',
                      height: '68px',
                      borderRadius: '18px',
                      background: 'var(--color-mint)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px auto'
                    }}
                  >
                    <UserCheck size={34} color="var(--color-emerald)" />
                  </div>

                  <h2
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: 'var(--color-navy)',
                      marginBottom: '12px',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    Access Your KwachaTrack Account
                  </h2>

                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.98rem',
                      lineHeight: 1.6,
                      marginBottom: '32px',
                      maxWidth: '460px',
                      margin: '0 auto 32px auto'
                    }}
                  >
                    Sign in with your email or Continue with Google to securely access your financial records across your Android phone and Windows computer.
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
          onGoToApp={handleGetStarted}
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
        initialError={authErrorMessage}
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
