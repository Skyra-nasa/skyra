import Header from '@/shared/layout/Header'
import MultistepForm from './components/MultiStepForm'

function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <MultistepForm />
    </div>
  )
}

export default HomePage