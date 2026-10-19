// PWA Installation Helper
let deferredPrompt: any = null;
let isInstallable = false;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e;
    isInstallable = true;
    window.dispatchEvent(new CustomEvent('kwacha-pwa-available'));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    isInstallable = false;
    window.dispatchEvent(new CustomEvent('kwacha-pwa-installed'));
  });
}

export function isPwaStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function getIsInstallable(): boolean {
  return isInstallable && deferredPrompt !== null;
}

export async function promptPwaInstall(): Promise<'accepted' | 'dismissed' | 'already-installed' | 'manual-instructions'> {
  if (isPwaStandalone()) {
    return 'already-installed';
  }

  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        deferredPrompt = null;
        isInstallable = false;
        return 'accepted';
      } else {
        return 'dismissed';
      }
    } catch (err) {
      console.warn('PWA install prompt error:', err);
      return 'manual-instructions';
    }
  }

  return 'manual-instructions';
}
