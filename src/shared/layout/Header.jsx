import { Satellite, ArrowLeft, Download, FileJson, FileSpreadsheet } from 'lucide-react'
import React from 'react'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function Header({ 
  showExport = false, 
  onExportCSV, 
  onExportJSON, 

  showBackButton = false 
}) {
  const navigate = useNavigate()
  
  return (
    <header className="border-b backdrop-blur-lg border-[#75757524] sticky top-0 z-50 bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <Satellite className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-[22px] font-bold">Skyra</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="group gap-2"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
              </Button>
            )}
            
            {showExport && onExportCSV && onExportJSON && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportCSV}
                  className="group gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExportJSON}
                  className="group gap-2"
                >
                  <FileJson className="h-4 w-4" />
                  JSON
                </Button>
              </div>
            )}
            
            <ThemeToggle />
          </div>
        </div>
        
        {/* Title and subtitle section */}
 
      </div>
    </header>
  )
}

export default Header