import { ArrowRight, CloudSun, Brain, Shield } from "lucide-react";
import BubbleMenu from "./steps/detectActivity/ActivityBubbles";
import { useNavigate } from "react-router-dom";
import HomeBackground from "../../../components/homebackground";



function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex items-center justify-center w-full py-12 min-h-screen">
      {/* Galaxy Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <HomeBackground />
      </div>
      

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center w-full">
          <div className="w-full max-w-5xl text-center relative">

            <h1 className="font-bold leading-[1.05] tracking-tight text-balance animate-[fadeInUp_.8s_.05s_ease_forwards] opacity-0">
              <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.2rem] bg-gradient-to-b from-foreground via-foreground/80 to-foreground/60 dark:from-white dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Plan Smarter. Celebrate Safer.
              </span>
            </h1>

            <p className="mt-3 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-[fadeInUp_.8s_.15s_ease_forwards] opacity-0">
              Skyra helps you forecast risk and readiness for your outdoor moments &mdash; from parades and festivals to games and weddings.
            </p>

            {/* CTAs */}

          </div>

          <div className="relative w-full">
            <button
              className="group min-[900px]:hidden px-7 mx-auto mt-5 w-fit h-7 relative cursor-pointer flex items-center gap-2 rounded-full bg-primary/90 backdrop-blur-md border border-primary/30 text-primary-foreground  py-5 text-base sm:text-lg font-semibold tracking-wide shadow-2xl shadow-primary/20 hover:bg-primary hover:border-primary/50 hover:shadow-primary/30 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              onClick={() => navigate("/home")}
            >
              <div className="bg-gradient-to-r w-fit from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2 z-10 font-semibold tracking-wider leading-none">
                Check Your Parade Is Safe ?
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 duration-300" />
              </span>
            </button>
        
          </div>
          <div className="max-[900px]:hidden mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_.8s_.25s_ease_forwards] opacity-0">
            <button
              className="group top-[24px] relative cursor-pointer inline-flex items-center gap-3 rounded-full bg-primary/90 backdrop-blur-md border border-primary/30 text-primary-foreground px-10 py-5 text-base sm:text-lg font-semibold tracking-wide shadow-2xl shadow-primary/20 hover:bg-primary hover:border-primary/50 hover:shadow-primary/30 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              onClick={() => navigate("/home")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-3 z-10 font-semibold tracking-wider leading-none">
                Check Your Parade Is Safe ?
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 duration-300" />
              </span>
            </button>
          </div>

          {/* Features Section */}
          <div className="w-full mt-24 md:mt-32 animate-[fadeInUp_.8s_.35s_ease_forwards] opacity-0">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h2 className="text-4xl lg:text-5xl font-semibold bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 dark:from-white dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Built to cover your needs
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Comprehensive weather analysis powered by NASA data and artificial intelligence
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Card 1: Historical Data */}
              <div className="group text-center bg-card/60 backdrop-blur-xl border border-border/50 rounded-xl p-8 shadow-lg hover:shadow-2xl hover:border-border/70 transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-500">
                  <CloudSun className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="mt-6 font-semibold text-lg text-foreground">
                  NASA Weather Data
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Extensive historical weather data from NASA satellites, allowing you to analyze patterns and make informed decisions.
                </p>
              </div>

              {/* Card 2: AI Powered */}
              <div className="group text-center bg-card/60 backdrop-blur-xl border border-border/50 rounded-xl p-8 shadow-lg hover:shadow-2xl hover:border-border/70 transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-500">
                  <Brain className="w-8 h-8 text-purple-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="mt-6 font-semibold text-lg text-foreground">
                  Powered By AI
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Advanced AI analysis provides intelligent forecasts and personalized recommendations for your specific activities.
                </p>
              </div>

              {/* Card 3: Safety First */}
              <div className="group text-center bg-card/60 backdrop-blur-xl border border-border/50 rounded-xl p-8 shadow-lg hover:shadow-2xl hover:border-border/70 transition-all duration-500 hover:-translate-y-2">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-500">
                  <Shield className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="mt-6 font-semibold text-lg text-foreground">
                  Safety & Preparedness
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Get real-time risk assessments and safety alerts to ensure your outdoor events proceed without weather disruptions.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
