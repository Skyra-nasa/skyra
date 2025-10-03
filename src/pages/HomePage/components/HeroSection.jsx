import { ArrowRight } from "lucide-react";
import BubbleMenu from "./steps/detectActivity/ActivityBubbles";
import { useNavigate } from "react-router-dom";
import HomeBackground from "../../../components/homebackground";

const heroItems = [
  {
    label: '🏛️ Indoor',
    value: 'vacation',
    ariaLabel: 'Vacation',
    rotation: -8,
    hoverStyles: { bgColor: 'var(--chart-1)', textColor: 'var(--primary-foreground)' }
  },
  {
    label: '🥾 Hiking',
    value: 'hiking',
    ariaLabel: 'Hiking',
    rotation: 8,
    hoverStyles: { bgColor: 'var(--chart-2)', textColor: 'var(--primary-foreground)' }
  },
  {
    label: '🏖️ Beach',
    value: 'beach',
    ariaLabel: 'Beach',
    rotation: 8,
    hoverStyles: { bgColor: 'var(--chart-3)', textColor: 'var(--primary-foreground)' }
  },
  {
    label: '⚽ Sports',
    value: 'sports',
    ariaLabel: 'Sports',
    rotation: 8,
    hoverStyles: { bgColor: 'var(--chart-4)', textColor: 'var(--primary-foreground)' }
  },
  {
    label: '🎉 Party',
    value: 'party',
    ariaLabel: 'Party',
    rotation: -8,
    hoverStyles: { bgColor: 'var(--primary)', textColor: 'var(--primary-foreground)' }
  }
];

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex items-start justify-center w-full overflow-hidden pt-20 pb-12 sm:pb-20 min-h-[100vh]">
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

          <div className="relative w-full max-w-6xl mt-6 ">
            <div className="relative h-[280px] sm:h-[300px] lg:h-[350px] w-full overflow-visible">
              <div className="absolute inset-0 scale-95 lg:scale-100">
                <BubbleMenu
                  logo={null}
                  items={heroItems}
                  onActivitySelect={() => { }}
                  selectedActivity={null}
                  useFixedPosition={false}
                  animationEase="back.out(1.5)"
                  animationDuration={0.5}
                  staggerDelay={0.12}
                  openOnLoad={true}
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_.8s_.25s_ease_forwards] opacity-0">
            <button
              className="group relative cursor-pointer inline-flex items-center gap-3 rounded-full bg-primary/90 backdrop-blur-md border border-primary/30 text-primary-foreground px-10 py-5 text-base sm:text-lg font-semibold tracking-wide shadow-2xl shadow-primary/20 hover:bg-primary hover:border-primary/50 hover:shadow-primary/30 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-primary/50 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              onClick={() => navigate("/home")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-3 z-10 font-semibold tracking-wider leading-none">
                Check Your Parade Is Safe ?
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 duration-300" />
              </span>
            </button>
          </div>


        </div>
      </div>
    </section>
  );
}

export default HeroSection;
