import { useState } from 'react'
import Header from '@/shared/layout/Header'
import MultistepForm from './components/MultiStepForm'
import HeroSection from './components/HeroSection'

function HomePage() {
  const [showForm, setShowForm] = useState(false);

  const handleGetStarted = () => {
    setShowForm(true);
    // Smooth scroll to form
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header/>
      <div className="w-full">
        {!showForm ? (
          <HeroSection onGetStarted={handleGetStarted} />
        ) : (
          <div id="event-form" className="pt-8">
            <MultistepForm/>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage