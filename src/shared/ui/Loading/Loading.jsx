import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { Satellite, Sparkles } from "lucide-react";
import skyraLogo from "@/shared/utils/assets/logo.webp";
import "./loading.scss";

const loadingStates = [
    {
        text: "Connecting to NASA POWER API...",
    },
    {
        text: "Fetching historical weather data...",
    },
    {
        text: "Analyzing temperature & precipitation patterns...",
    },
    {
        text: "Processing humidity and wind statistics...",
    },
    {
        text: "Calculating atmospheric pressure trends...",
    },
    {
        text: "Evaluating comfort & safety probabilities...",
    },
    {
        text: "Generating your personalized activity forecast",
        isSpecial: true,
    },
];

export function MultiStepLoaderDemo({ loading }) {
    return (
        <div className="w-full h-[60vh] flex items-center justify-center">
            <Loader loadingStates={loadingStates} loading={loading} duration={500} />
        </div>
    );
}

// Enhanced Splash Screen Component with Skyra Logo
export function SplashScreen({ loading = true, isPWA = false }) {
    return (
        <div className={`fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 flex items-center justify-center z-50 overflow-hidden ${isPWA ? 'pwa-splash-screen' : ''}`}>
            {/* Animated cosmic background */}
            <div className="absolute inset-0">
                {/* Stars */}
                {[...Array(100)].map((_, i) => (
                    <div
                        key={`star-${i}`}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 3}s`,
                            opacity: 0.3 + Math.random() * 0.7
                        }}
                    />
                ))}
                
                {/* Floating particles */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 bg-primary/40 rounded-full animate-bounce"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${3 + Math.random() * 2}s`
                        }}
                    />
                ))}
                
                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Main content */}
            <div className="relative text-center space-y-8 px-4">
                {/* Logo container with enhanced glass morphism */}
                <div className="relative mx-auto">
                    <div className="relative w-32 h-32 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-3xl flex items-center justify-center group shadow-2xl shadow-primary/20">
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 rounded-3xl" />
                        
                        {/* Skyra Logo */}
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden">
                            <img 
                                src={skyraLogo} 
                                alt="Skyra Logo"
                                className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    // Fallback to Satellite icon if logo fails to load
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/></svg></div>';
                                }}
                            />
                        </div>
                        
                        {/* Floating sparkle */}
                        <div className="absolute -top-3 -right-3 animate-bounce">
                            <Sparkles className="w-6 h-6 text-yellow-400 filter drop-shadow-lg" />
                        </div>
                        
                        {/* Pulsing ring */}
                        <div className="absolute inset-0 border-2 border-primary/50 rounded-3xl animate-ping" style={{ animationDuration: '2s' }} />
                    </div>
                </div>
                
                {/* App name and description */}
                <div className="space-y-4">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-white to-blue-400 bg-clip-text text-transparent tracking-wider">
                        Skyra
                    </h1>
                    <p className="text-white/80 text-xl max-w-lg mx-auto leading-relaxed">
                        Advanced NASA Data Analysis Platform
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <div className="w-4 h-1 bg-blue-400 rounded-full" />
                        <div className="w-12 h-1 bg-primary rounded-full" />
                        <div className="w-4 h-1 bg-blue-400 rounded-full" />
                        <div className="w-8 h-1 bg-primary rounded-full" />
                    </div>
                </div>
                
                {/* Loading indicator */}
                {loading && (
                    <div className="space-y-6">
                        {/* Orbital loader */}
                        <div className="relative flex justify-center">
                            <div className="w-16 h-16 relative">
                                <div className="absolute inset-0 border-2 border-primary/30 rounded-full"></div>
                                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                                <div className="absolute inset-2 border-t-2 border-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <Satellite className="w-4 h-4 text-primary animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <p className="text-white/60 text-base animate-pulse font-medium">
                            Connecting to the cosmos...
                        </p>
                    </div>
                )}
            </div>
            
            {/* Bottom accent with enhanced styling */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-3 px-4 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/10">
                    <Satellite className="w-4 h-4 text-primary" />
                    <span className="text-white/70 text-sm font-medium">Powered by NASA POWER API</span>
                </div>
            </div>
        </div>
    );
}
