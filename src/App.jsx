import { Route, Routes, useNavigate } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import Dashboard from "./pages/Dashboard/Dashboard"
import HeroSection from "./pages/HomePage/components/HeroSection"
import { useContext, useEffect } from "react"
import { WheatherContext } from "./shared/context/WhetherProvider"

function App() {
  const navigate = useNavigate();
  const { selectedData, setCurrentStep } = useContext(WheatherContext);

  useEffect(() => {
    if (selectedData.date === "") {
      navigate('/home');
      setCurrentStep(1)
    }

  }, [selectedData])

  return (
    <div>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
