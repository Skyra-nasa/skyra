// PWA Splash Screen Controller
import { SplashScreen } from '@/shared/ui/Loading/Loading';

class PWASplashController {
  constructor() {
    this.isFirstLoad = true;
    this.splashDuration = 2500; // 2.5 seconds
  }

  // Check if app was opened from PWA (home screen)
  isPWAMode() {
    // iOS Safari PWA detection
    const isIOSStandalone = window.navigator.standalone === true;
    
    // Modern browsers (Chrome, Edge, etc.)
    const isStandaloneDisplay = window.matchMedia('(display-mode: standalone)').matches;
    
    // Android app detection
    const isAndroidApp = document.referrer.includes('android-app://');
    
    // Development/testing flag
    const isTestPWA = window.location.search.includes('pwa=true');
    
    // iOS Safari in standalone mode detection
    const isIOSPWA = isIOSStandalone || (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !window.MSStream &&
      window.matchMedia('(display-mode: standalone)').matches
    );
    
    return isIOSPWA || isStandaloneDisplay || isAndroidApp || isTestPWA;
  }

  // Check if this is the first load in this session
  isFirstAppLoad() {
    const hasLoadedBefore = sessionStorage.getItem('pwa-loaded');
    if (!hasLoadedBefore) {
      sessionStorage.setItem('pwa-loaded', 'true');
      return true;
    }
    return false;
  }

  // Determine if splash screen should be shown
  // Only show in PWA mode, not in regular browser mode
  shouldShowSplash() {
    return this.isPWAMode() && this.isFirstAppLoad();
  }

  // Show splash screen for specified duration
  async showSplashScreen() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isFirstLoad = false;
        resolve(true);
      }, this.splashDuration);
    });
  }
}

export const pwasplash = new PWASplashController();