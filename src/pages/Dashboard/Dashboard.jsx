import React, { useContext, useEffect, useState } from 'react'
import Header from '@/shared/layout/Header'
import BarChartDetails from './components/charts/BarChartDetails'
import PieChartDetail from './components/charts/PieChartDetail'
import LineChartDetails from './components/charts/LineChartDetails'
import { WheatherContext } from '@/shared/context/WhetherProvider'
import DataSelectedCards from './components/DataSelectedCards'
import SummaryCard from './components/SummaryCard'
import WeatherStatsCards from './components/WeatherStatsCards'
import MetadataCard from './components/MetadataCard'
import { useNavigate } from 'react-router-dom'
import HomeBackground from '@/components/homebackground'
import { BarChart3, LineChart } from 'lucide-react'

function Dashboard() {
  const navigate = useNavigate();
  const { selectedData, weatherData } = useContext(WheatherContext);
  const [activeTab, setActiveTab] = useState('charts'); // 'data' or 'charts' - default to charts
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (selectedData.date === "") {
      navigate('/');
    }
  }, [selectedData, navigate])

  useEffect(() => {
    // Trigger entry animations on mount
    setMounted(true);
  }, [])


  const flattenObject = (obj, parentKey = "", res = {}) => {
    for (let key in obj) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, res);
      } else {
        res[newKey] = obj[key];
      }
    }
    return res;
  };

  const objectToCSV = (obj) => {
    const flat = flattenObject(obj);
    const headers = Object.keys(flat).join(",");
    const values = Object.values(flat)
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",");
    return headers + "\n" + values;
  };
  const handleExportCSV = () => {
    const csvString = objectToCSV(weatherData);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "weather_analysis.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(weatherData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skyra-weather-analysis-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
  return (
    <div className='relative min-h-screen overflow-hidden '>
      {/* Galaxy Background */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <HomeBackground />
      </div>

      <Header
        showExport={true}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        showBackButton={true}
      />

      <div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10'>
        {/* Overview Section */}
        <div className={`mb-12 mt-10 space-y-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className='text-2xl font-bold mb-6 bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 dark:from-white dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent'>
            Weather Analysis Overview
          </h2>
          
          {/* Selection Cards - Single Row */}
          <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <DataSelectedCards />
          </div>

          {/* AI Summary Card */}
          <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <SummaryCard
              riskLevel="low"
              weatherSummary={weatherData?.llm_summary || "Loading weather analysis..."}
              temperature={{
                high: weatherData?.statistics?.temperature?.max_celsius || 33,
                low: weatherData?.statistics?.temperature?.min_celsius || 19,
                avg: weatherData?.statistics?.temperature?.avg_celsius || 78.9
              }}
              rainProb={weatherData?.statistics?.rain?.rainy_day_prob || 15}
              windSpeed={weatherData?.statistics?.wind?.max_mph || 12}
            />
          </div>
        </div>

        {/* Tabbed Section for Statistics and Charts */}
        {weatherData?.statistics && (
          <div className={`mb-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Header with Tabs on Right */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
              <h2 className='text-2xl font-bold bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 dark:from-white dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent'>
                Weather Analysis Details
              </h2>

              {/* Tab Navigation - Right Side */}
              <div className='flex gap-2 p-1 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 w-fit'>
                <button
                  onClick={() => setActiveTab('data')}
                  className={`px-5 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'data'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <BarChart3 className='w-4 h-4' />
                  Statistics
                </button>
                <button
                  onClick={() => setActiveTab('charts')}
                  className={`px-5 py-2.5 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'charts'
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  }`}
                >
                  <LineChart className='w-4 h-4' />
                  Charts
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className='min-h-[600px]'>
              {activeTab === 'data' && (
                <div className='animate-[fadeIn_.4s_ease-in] space-y-8'>
                  <p className='text-muted-foreground text-sm mb-6'>
                    Comprehensive breakdown of all weather parameters and probabilities
                  </p>
                  <WeatherStatsCards statistics={weatherData.statistics} />
                </div>
              )}

              {activeTab === 'charts' && (
                <div className='animate-[fadeIn_.4s_ease-in] space-y-6'>
                  <p className='text-muted-foreground text-sm mb-6'>
                    Visual representations of historical weather data and trends
                  </p>
                  <div className='flex gap-6 max-lg:flex-wrap'>
                    <BarChartDetails weatherData={weatherData} />
                    <PieChartDetail weatherData={weatherData} />
                  </div>
                  <LineChartDetails weatherData={weatherData} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard