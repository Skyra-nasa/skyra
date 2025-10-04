import { Route, Routes, useNavigate } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import Dashboard from "./pages/Dashboard/Dashboard"
import HeroSection from "./pages/HomePage/components/HeroSection"


function App() {

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
