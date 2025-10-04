import { WheatherContext } from "@/shared/context/WhetherProvider.jsx";
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

import { useState, useCallback, useContext } from 'react';

function ActivityStep({ selectedActivity, setSelectedActivity, onNext, onLoading }) {
  const [isCustomEditing, setIsCustomEditing] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const { selectedData } = useContext(WheatherContext);
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
    if (onNext && !selectedData.sendData) {
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
    if (onNext && !selectedData.sendData) {
      setTimeout(() => onNext(), 200);
    }
  }, [customValue, onNext, setSelectedActivity]);

  const handleCustomCancel = useCallback(() => {
    setIsCustomEditing(false);
    if (selectedActivity === 'custom') setSelectedActivity(null);
  }, [selectedActivity, setSelectedActivity]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

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
        setLoading={onLoading}
      />
    </div>
  );
}

export default ActivityStep;
