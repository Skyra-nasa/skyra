import { Satellite, Download } from 'lucide-react'
import React from 'react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function Header({ 
  showExport = false, 
  onExportCSV, 
  onExportJSON,
  title = "Skyra",
  subtitle = null,
  showBackButton = false
}) {
  const navigate = useNavigate()
  
  const handleLogoClick = () => {
    if (!showBackButton) {
      navigate("/")
    }
  }

  return (
    <header className="border-b border-border/40 bg-card/30 backdrop-blur-xl sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div 
            className={`flex items-center gap-3 animate-[fadeInUp_.8s_.05s_ease_forwards] opacity-0 ${!showBackButton ? 'cursor-pointer' : ''}`}
            onClick={handleLogoClick}
          >
            <Satellite className="h-8 w-8 text-primary drop-shadow-lg" />
            <div>
              <h1 className={`${subtitle ? 'text-xl' : 'text-[22px]'} font-bold ${subtitle ? 'bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent' : ''}`}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 animate-[fadeInUp_.8s_.05s_ease_forwards] opacity-0">
            {showExport && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportCSV}
                  className="h-8 px-3 hover:bg-primary/10 transition-colors"
                >
                  <Download className="h-3 w-3 mr-1" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportJSON}
                  className="h-8 px-3 hover:bg-primary/10 transition-colors"
                >
                  <Download className="h-3 w-3 mr-1" />
                  JSON
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header