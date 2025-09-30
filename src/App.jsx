import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage/HomePage"
import Dashboard from "./pages/Dashboard/Dashboard"

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
