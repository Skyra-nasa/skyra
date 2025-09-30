import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import { ArrowLeft, Download, Satellite } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function SpecificHeader() {
    const navigate = useNavigate()
    return (
        <header className="border-b border-[#75757524] bg-card/50 backdrop-blur-lg sticky top-0 z-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { navigate("/") }}
                            className="mr-2 cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>
                        <Satellite className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-xl font-bold">Weather Analysis Results</h1>
                            <p className="text-sm text-muted-foreground">Historical probability analysis complete</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">


                        {/* Export Options */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                // onClick={() => handleDownload('csv')}
                                className="h-8 px-3"
                            >
                                <Download className="h-3 w-3 mr-1" />
                                CSV
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                // onClick={() => handleDownload('json')}
                                className="h-8 px-3"
                            >
                                <Download className="h-3 w-3 mr-1" />
                                JSON
                            </Button>
                        </div>

                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default SpecificHeader