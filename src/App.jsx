import { Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import HomePage from "./pages/HomePage/HomePage"
import Dashboard from "./pages/Dashboard/Dashboard"
import HeroSection from "./pages/HomePage/components/HeroSection"
import { PWAInstallWidget, pwasplash } from "./shared/pwa"
import { SplashScreen } from "./shared/ui/Loading/Loading"
import { pwaService } from "./shared/utils/pwaService"
import "./shared/pwa/pwa-splash.css"

// Development cache clearing utility
if (import.meta.env.DEV) {
  import("./shared/utils/devCacheUtils.js");
}

function App() {
  // Only show splash screen if we're in PWA mode from the start
  const [isInitializing, setIsInitializing] = useState(() => pwasplash.isPWAMode());

  useEffect(() => {
    // Initialize PWA service when app starts
    const initializePWA = async () => {
      const isPWAMode = pwasplash.isPWAMode();
      
      // If not in PWA mode, skip initialization entirely
      if (!isPWAMode) {
        setIsInitializing(false);
        return;
      }

      try {
        await pwaService.init();
        console.log('PWA features initialized');
        
        if (pwasplash.shouldShowSplash()) {
          await pwasplash.showSplashScreen();
        }
        
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize PWA features:', error);
        // Still hide splash screen even if initialization fails
        setTimeout(() => {
          setIsInitializing(false);
        }, 1500);
      }
    };

    initializePWA();

    // Handle notification clicks
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
          const { action, notificationData } = event.data;
          
          switch (action) {
            case 'update':
              pwaService.updateApp();
              break;
            case 'view':
              // Navigate to relevant page based on notification type
              if (notificationData.type === 'sync-success') {
                window.location.href = '/dashboard';
              }
              break;
            default:
              break;
          }
        }
      });
    }
  }, []);

  // Show splash screen during initialization
  if (isInitializing) {
    const isPWAMode = pwasplash.isPWAMode();
    return <SplashScreen loading={true} isPWA={isPWAMode} />;
  }

  return (
    <div className="min-h-screen">
      {/* Main App Routes */}
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* PWA Components - These will show conditionally */}
      <PWAInstallWidget />
      
      {/* Network Status Monitor - Fixed position */}
    
    </div>
  )
}

export default App
