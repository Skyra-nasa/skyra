import Header from '@/shared/layout/Header'
import MultistepForm from './components/MultiStepForm'

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header/>
      <MultistepForm/>
    </div>
  )
}

export default HomePage