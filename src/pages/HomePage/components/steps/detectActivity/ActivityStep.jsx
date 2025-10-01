import BubbleMenu from "./ActivityBubbles.jsx";


const items = [
  {
    label: '🏖️ Vacation',
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
    label: '✨ Custom',
    value: 'custom',
    ariaLabel: 'Custom Activity',
    rotation: -8,
    hoverStyles: { bgColor: 'var(--primary)', textColor: 'var(--primary-foreground)' }
  }
];

import { useState, useCallback } from 'react';

function ActivityStep({ selectedActivity, setSelectedActivity, onNext }) {
  const [isCustomEditing, setIsCustomEditing] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const startCustomEdit = useCallback(() => {
    setIsCustomEditing(true);
    setCustomValue('');
  }, []);

  const handleActivitySelect = useCallback((activity) => {
    if (activity === 'custom') {
      startCustomEdit();
      return; // don't advance yet
    }
    setSelectedActivity(activity);
    // Advance to next step after selection (non custom)
    if (onNext) {
      setTimeout(() => onNext(), 250);
    }
  }, [onNext, setSelectedActivity, startCustomEdit]);

  const handleCustomSubmit = useCallback(() => {
    if (!customValue.trim()) return;
    const finalValue = customValue.trim();
    setSelectedActivity(finalValue);
    // log consistent with analyze logging pattern
    // (location/date not available here, logged later globally)
    console.log('selectedActivity (custom)', finalValue);
    if (onNext) {
      setTimeout(() => onNext(), 200);
    }
  }, [customValue, onNext, setSelectedActivity]);

  const handleCustomCancel = useCallback(() => {
    setIsCustomEditing(false);
    if (selectedActivity === 'custom') setSelectedActivity(null);
  }, [selectedActivity, setSelectedActivity]);

  return (
    <div className="w-full">
      <div className="-mt-4 mb-4 text-center relative px-2">
        <style>{`
         
          .header-gradient-text {
            background: linear-gradient(95deg,var(--primary) 0%,var(--chart-2) 42%,var(--chart-2) 100%);
            -webkit-background-clip: text; background-clip: text; color: transparent;
            position: relative;
          }
         
          .header-shimmer::before { /* moving sheen */
            content:""; position:absolute; top:0; left:0; height:100%; width:42%;
            background: linear-gradient(70deg,transparent 0%,rgba(255,255,255,.55) 45%,transparent 90%);
            mix-blend-mode:overlay; filter:blur(4px) brightness(1.2);
            animation: shineMove 4.8s ease-in-out infinite;
            opacity:.65; pointer-events:none;
          }
          .underline-wrap .u-line-base { background:linear-gradient(90deg,var(--primary),var(--chart-2)); }
          .underline-wrap .u-line-glow { background:linear-gradient(90deg,var(--chart-2),var(--chart-3)); filter:blur(6px); opacity:.55; }
          @media (prefers-reduced-motion: reduce) { .header-shimmer::before { animation:none; opacity:0; } }
        `}</style>
        <div className="inline-block relative header-shimmer">
          <h2
            className="header-gradient-text mx-auto max-w-3xl text-[clamp(1.35rem,3.2vw,2.9rem)] font-semibold leading-[1.15] tracking-tight drop-shadow-sm"
          >
            <span className="sr-only">Step 1: </span>Choose What Suits U Better
          </h2>
        </div>
        <div className="underline-wrap mt-2 flex justify-center relative">
          <span className="u-line-glow absolute h-1 w-40 rounded-full" />
          <span className="u-line-base relative h-[3px] w-40 rounded-full" />
        </div>
   
      </div>
      <BubbleMenu
      logo={null}
      items={items}
      onActivitySelect={handleActivitySelect}
      selectedActivity={selectedActivity}
      isCustomEditing={isCustomEditing}
      customValue={customValue}
      onCustomValueChange={setCustomValue}
      onCustomSubmit={handleCustomSubmit}
  onCustomCancel={handleCustomCancel}
      useFixedPosition={false}
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
      openOnLoad={true}
    />
    </div>
  );
}

export default ActivityStep;
