import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Download, X, Smartphone, Monitor, Tablet, Satellite, Sparkles } from 'lucide-react';

const PWAInstallWidget = () => {
  const location = useLocation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');
  const [_installationMethod, setInstallationMethod] = useState(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    // Detect device type
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/mobile|android|iphone|ipad|tablet/.test(userAgent)) {
        if (/ipad|tablet/.test(userAgent)) {
          setDeviceType('tablet');
        } else {
          setDeviceType('mobile');
        }
      } else {
        setDeviceType('desktop');
      }
    };

    detectDevice();

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
      setInstallationMethod('browser');
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      console.log('PWA installed successfully');
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setShowInstallDialog(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Clean up
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Auto-hide the install prompt after 5 seconds
  useEffect(() => {
    if (showInstallPrompt) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(false);
        // Remember dismissal for this session
        sessionStorage.setItem('pwa-install-dismissed', 'true');
      }, 5000); // 5 seconds

      // Clear timer if component unmounts or prompt is manually dismissed
      return () => clearTimeout(timer);
    }
  }, [showInstallPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Show manual installation dialog for browsers without prompt
      setShowInstallDialog(true);
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for user response
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response to install prompt: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the prompt
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  const getDeviceIcon = () => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getInstallInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
      return {
        title: 'Install on iOS Safari',
        steps: [
          'Tap the Share button in Safari',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" in the top right corner',
          'The app will appear on your home screen'
        ]
      };
    }
    
    if (deviceType === 'mobile') {
      return {
        title: 'Install on Mobile',
        steps: [
          'Tap the menu (⋮) in your browser',
          'Look for "Add to Home Screen" or "Install App"',
          'Tap to install',
          'The app will appear on your home screen'
        ]
      };
    }
    
    return {
      title: 'Install on Desktop',
      steps: [
        'Look for the install icon (⊕) in your browser\'s address bar',
        'Click the icon or go to browser menu',
        'Select "Install Skyra" or "Add to Desktop"',
        'The app will open as a standalone application'
      ]
    };
  };

  // Don't show if already installed, dismissed, or on specific routes
  const currentPath = location.pathname;
  const hiddenRoutes = ['/home', '/dashboard'];
  
  if (isInstalled || 
      sessionStorage.getItem('pwa-install-dismissed') ||
      hiddenRoutes.includes(currentPath)) {
    return null;
  }

  return (
    <>
      {/* Install Banner matching your actual design */}
      {showInstallPrompt && (
        <Card className="fixed bottom-4 right-4 max-w-sm z-50 animate-[fadeInUp_.5s_ease_forwards] transition-all duration-300">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2.5 bg-primary/20 backdrop-blur-sm rounded-lg border border-primary/30">
                <Satellite className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground mb-1">
                  Install Skyra App
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Get the full NASA data analysis experience with offline access and native features
                </p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    onClick={handleInstallClick}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs px-3 py-1.5 h-auto transition-colors duration-200"
                  >
                    <Download className="w-3 h-3 mr-1.5" />
                    Install
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted text-xs px-2 h-auto"
                  >
                    Later
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="flex-shrink-0 p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md h-auto w-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Detailed Installation Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getDeviceIcon()}
              Install Skyra
            </DialogTitle>
            <DialogDescription>
              Add Skyra to your device for the best experience with offline access and native features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Benefits of Installing
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Works offline</li>
                <li>• Faster loading</li>
                <li>• Push notifications</li>
                <li>• Native app experience</li>
              </ul>
            </div>
            
            {(() => {
              const instructions = getInstallInstructions();
              return (
                <div>
                  <h4 className="font-medium mb-2 text-foreground">{instructions.title}</h4>
                  <ol className="text-sm text-muted-foreground space-y-2">
                    {instructions.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })()}
            
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                onClick={() => setShowInstallDialog(false)}
                variant="outline"
              >
                Close
              </Button>
              {deferredPrompt && (
                <Button 
                  onClick={handleInstallClick}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PWAInstallWidget;