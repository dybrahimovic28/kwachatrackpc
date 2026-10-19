import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getAvatarInitial } from '../lib/formatters';
import { 
  LogIn, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ArrowRight,
  User
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile | null;
  activeTab: 'home' | 'app';
  onSelectTab: (tab: 'home' | 'app') => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onSelectTab,
  onNavigateSection,
  onOpenAuth,
  onSignOut
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (sectionId) {
      if (activeTab !== 'home') {
        onSelectTab('home');
        setTimeout(() => {
          onNavigateSection(sectionId);
        }, 100);
      } else {
        onNavigateSection(sectionId);
      }
    } else {
      onSelectTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAppClick = () => {
    setMobileMenuOpen(false);
    onSelectTab('app');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(248, 247, 243, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div className="responsive-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Brand Logo & Name */}
        <div 
          onClick={() => handleNavClick()}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img 
            src="./images/kwachatrack-logo.png" 
            alt="KwachaTrack Logo" 
            style={{ width: '38px', height: '38px', objectFit: 'contain', borderRadius: '8px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--color-navy)' }}>
              Kwacha<span style={{ color: 'var(--color-emerald)' }}>Track</span>
            </span>
            <span style={{
              fontSize: '0.65rem',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'var(--color-mint)',
              color: 'var(--color-mint-text)',
              fontWeight: 800
            }}>ZMW</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', gap: '28px', alignItems: 'center' }} className="desktop-nav">
          <button
            onClick={() => handleNavClick('features')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.94rem',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Features
          </button>

          <button
            onClick={() => handleNavClick('how-it-works')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.94rem',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            How It Works
          </button>

          <button
            onClick={() => handleNavClick('devices')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.94rem',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Devices
          </button>

          <button
            onClick={() => handleNavClick('downloads')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.94rem',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Downloads
          </button>
        </div>

        {/* User Session or Get Started / Sign In Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={handleAppClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '24px',
                  padding: '4px 14px 4px 6px',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'var(--color-emerald)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  {getAvatarInitial(user.full_name, user.email)}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.full_name ? user.full_name.split(' ')[0] : 'My Account'}
                </span>
              </button>

              <button
                onClick={onSignOut}
                title="Sign Out"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={onOpenAuth}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  padding: '8px 12px'
                }}
              >
                Sign In
              </button>

              <button
                onClick={handleAppClick}
                className="btn-primary"
                style={{
                  padding: '9px 18px',
                  fontSize: '0.9rem',
                  borderRadius: '10px'
                }}
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <button
            onClick={() => handleNavClick('features')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '8px 0',
              textAlign: 'left'
            }}
          >
            Features
          </button>

          <button
            onClick={() => handleNavClick('how-it-works')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '8px 0',
              textAlign: 'left'
            }}
          >
            How It Works
          </button>

          <button
            onClick={() => handleNavClick('devices')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '8px 0',
              textAlign: 'left'
            }}
          >
            Supported Devices
          </button>

          <button
            onClick={() => handleNavClick('downloads')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
              padding: '8px 0',
              textAlign: 'left'
            }}
          >
            Downloads
          </button>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
            <button
              onClick={handleAppClick}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
