import { useNavigate } from 'react-router-dom';
import ActivityStep from '@/pages/HomePage/components/steps/detectActivity/ActivityStep';
import Header from '@/shared/layout/Header';
import { useState } from 'react';

function LandingPage() {
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 flex items-center relative overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: floating activity bubbles repurposed */}
          <div className="relative order-2 lg:order-1 min-h-[480px] flex items-center justify-center">
            <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
            <div className="scale-75 md:scale-90 lg:scale-100 origin-center">
              <ActivityStep
                selectedActivity={activity}
                setSelectedActivity={setActivity}
                onNext={() => navigate('/plan')}
              />
            </div>
          </div>
          {/* Right: Hero Text */}
          <div className="space-y-6 order-1 lg:order-2 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              🌦 Skyra — Know the Weather Before You Celebrate
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Whether it's a wedding, sports game, or parade, our tool helps you avoid bad weather and plan safely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
              <button
                onClick={() => navigate('/plan')}
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary via-primary to-primary/90 px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                Let's see if your parade is safe?
              </button>
              {activity && (
                <div className="text-xs px-4 py-2 rounded-full bg-muted/60 text-muted-foreground border border-border/60 backdrop-blur-sm">
                  Selected: <span className="font-medium text-foreground">{activity}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
