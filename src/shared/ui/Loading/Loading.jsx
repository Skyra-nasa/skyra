import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { Satellite, Sparkles } from "lucide-react";
import Galaxy from "@/components/Galaxy";
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

// Modern Splash Screen Component with Galaxy Background
export function SplashScreen({ loading = true, isPWA = false }) {
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isPWA ? 'pwa-splash-screen' : ''}`}>
            {/* Galaxy Background */}
            <div className="absolute inset-0">
                <Galaxy 
                    transparent={false}
                    mouseInteraction={false}
                    density={0.8}
                    speed={0.3}
                    hueShift={220}
                    saturation={0.3}
                    twinkleIntensity={0.5}
                    rotationSpeed={0.05}
                />
            </div>
            
            {/* Content overlay */}
            <div className="relative text-center space-y-8 px-4 z-10">
                {/* App name - keeping original gradient */}
                <div className="space-y-6">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-white to-blue-400 bg-clip-text text-transparent tracking-wider drop-shadow-2xl">
                        Skyra
                    </h1>
                    <p className="text-white/90 text-lg font-light max-w-md mx-auto drop-shadow-lg">
                        Advanced NASA Data Analysis Platform
                    </p>
                </div>
                
                {/* Loading indicator */}
                {loading && (
                    <div className="space-y-4 mt-12">
                        {/* Simple modern loader */}
                        <div className="flex justify-center">
                            <div className="w-8 h-8 border-2 border-white/30 border-t-primary rounded-full animate-spin drop-shadow-lg"></div>
                        </div>
                        <p className="text-white/70 text-sm font-medium drop-shadow">
                            Loading...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
