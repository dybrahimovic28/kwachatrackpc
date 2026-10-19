import React, { useState, useEffect } from 'react';
import { supabase, getAuthRedirectUrl } from '../lib/supabaseClient';
import { UserProfile } from '../types';
import { X, Mail, Lock, User, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToHome: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialError?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onBackToHome,
  onAuthSuccess,
  initialError
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reset state whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(initialError || null);
      setSuccessMsg(null);
      setLoading(false);
      setGoogleLoading(false);
    }
  }, [isOpen, initialError]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Google OAuth Sign In / Sign Up
  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);

    try {
      const redirectUrl = getAuthRedirectUrl();

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });

      if (error) throw error;
      // In web, browser redirects to Google accounts sign-in
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in could not be initiated. Please verify your internet connection or use email and password.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authMode === 'signup') {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const redirectUrl = getAuthRedirectUrl();
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim()
            },
            emailRedirectTo: redirectUrl
          }
        });

        if (error) throw error;

        // If an active session was returned immediately (e.g. email confirmation disabled)
        if (data.session && data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email.trim(),
            full_name: fullName.trim(),
            currency: 'ZMW'
          };
          onAuthSuccess(profile);
          onClose();
        } else {
          // Email confirmation is required by Supabase project configuration
          setSuccessMsg('Account registered successfully! A confirmation link has been sent to your email. Please check your inbox and verify your email to access your dashboard.');
        }
      } else if (authMode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (error) throw error;

        if (data.user) {
          let fullNameValue: string | null = (data.user.user_metadata?.full_name as string) || (data.user.user_metadata?.name as string) || null;
          let currencyValue = 'ZMW';

          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profileData) {
              if (profileData.full_name) fullNameValue = profileData.full_name;
              if (profileData.currency) currencyValue = profileData.currency;
            }
          } catch (profileErr) {
            console.warn('Could not fetch extra profile fields, falling back to auth metadata', profileErr);
          }

          const profile: UserProfile = {
            id: data.user.id,
            email: data.user.email || email.trim(),
            full_name: fullNameValue,
            currency: currencyValue
          };
          onAuthSuccess(profile);
          onClose();
        }
      } else if (authMode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Please enter your registered email address');
        }

        const redirectUrl = getAuthRedirectUrl();

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: redirectUrl
        });

        if (error) throw error;

        setSuccessMsg('A password recovery email has been sent. Please check your inbox and click the reset link to choose a new password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(23, 36, 58, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px'
      }}
    >
      <div 
        className="white-card" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '28px 32px 34px 32px',
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 48px -12px rgba(23, 36, 58, 0.18)',
          position: 'relative'
        }}
      >
        {/* Navigation Bar at Top of Auth Card */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          {/* Visible Back to Homepage Control */}
          <button
            type="button"
            onClick={onBackToHome}
            aria-label="Back to Homepage"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px 6px 6px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              marginLeft: '-6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-navy)';
              e.currentTarget.style.background = '#F1EFEA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'none';
            }}
          >
            <ArrowLeft size={16} /> Back to Homepage
          </button>

          {/* Dismiss Icon */}
          <button
            type="button"
            onClick={onClose}
            title="Close"
            aria-label="Close authentication modal"
            style={{
              background: '#F1EFEA',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E7E9EE';
              e.currentTarget.style.color = 'var(--color-navy)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1EFEA';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Brand & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <img 
            src="./images/kwachatrack-logo.png" 
            alt="KwachaTrack Logo" 
            style={{ width: '44px', height: '44px', objectFit: 'contain', marginBottom: '10px', borderRadius: '10px' }}
          />
          <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-navy)', marginBottom: '6px' }}>
            {authMode === 'signup' && 'Create KwachaTrack Account'}
            {authMode === 'signin' && 'Welcome to KwachaTrack'}
            {authMode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
            {authMode === 'signup' && 'Sign up to manage your wealth and track expenses in Zambian Kwacha'}
            {authMode === 'signin' && 'Sign in to access your financial records across your devices'}
            {authMode === 'forgot' && 'Enter your registered email address to receive password reset instructions'}
          </p>
        </div>

        {/* Google Authentication Button (Only for sign-in and sign-up) */}
        {authMode !== 'forgot' && (
          <div style={{ marginBottom: '18px' }}>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '11px 18px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #D5D9E2',
                borderRadius: '12px',
                fontSize: '0.94rem',
                fontWeight: 600,
                color: 'var(--color-navy)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 4px rgba(23, 36, 58, 0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8F9FA';
                e.currentTarget.style.borderColor = '#B5BAC8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#D5D9E2';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '18px 0 14px 0',
              color: 'var(--text-tertiary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
              <span style={{ padding: '0 12px' }}>or continue with email</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '16px',
            color: '#991B1B',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '16px',
            color: '#166534',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authMode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-tertiary)' }} />
                <input
                  type="text"
                  placeholder="e.g. Henry Svotwa"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)', marginBottom: '5px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-tertiary)' }} />
              <input
                type="email"
                placeholder="name@domain.zm"
                className="input-field"
                style={{ paddingLeft: '42px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {authMode !== 'forgot' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-navy)' }}>
                  Password
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setErrorMsg(null); setSuccessMsg(null); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-emerald)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-tertiary)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field"
                  style={{ paddingLeft: '42px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || googleLoading}
            style={{ width: '100%', marginTop: '4px', padding: '13px', fontSize: '0.98rem' }}
          >
            {loading ? (
              'Processing...'
            ) : authMode === 'signup' ? (
              <>Create Account <ArrowRight size={18} /></>
            ) : authMode === 'signin' ? (
              <>Sign In <ArrowRight size={18} /></>
            ) : (
              <>Send Reset Link <KeyRound size={18} /></>
            )}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {authMode === 'signup' && (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(null); setSuccessMsg(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-emerald)', fontWeight: 700, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </span>
          )}

          {authMode === 'signin' && (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-emerald)', fontWeight: 700, cursor: 'pointer' }}
              >
                Register
              </button>
            </span>
          )}

          {authMode === 'forgot' && (
            <span>
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(null); setSuccessMsg(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--color-emerald)', fontWeight: 700, cursor: 'pointer' }}
              >
                Back to Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
