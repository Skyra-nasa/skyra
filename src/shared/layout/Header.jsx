import { Satellite } from 'lucide-react'
import React from 'react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()
  return (
    <header className="border-b backdrop-blur-lg border-[#75757524] sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex items-center gap-3">
            <Satellite className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-[22px] font-bold">Skyra</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header