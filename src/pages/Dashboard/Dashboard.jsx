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

function Dashboard() {
  const navigate = useNavigate();
  const { selectedData } = useContext(WheatherContext);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    if (selectedData.date === "") {
      navigate('/');
    }
  }, [selectedData, navigate])

  // Simulate API response - In production, this would be fetched from your API
  useEffect(() => {
    const mockApiResponse = {
      metadata: {
        location: {
          latitude: 30.1,
          longitude: 31.2
        },
        target_date: "2027-10-03",
        analysis_date: "2025-10-03",
        data_source: "NASA POWER API",
        sample_size: 10
      },
      statistics: {
        temperature: {
          avg_celsius: 26.1,
          avg_fahrenheit: 78.9,
          min_fahrenheit: 75.9,
          max_fahrenheit: 81.7,
          std_fahrenheit: 2.3,
          very_hot_prob: 0,
          very_cold_prob: 0
        },
        rain: {
          avg_mm: 0.09,
          avg_inches: 0.0035,
          max_mm: 0.46,
          rainy_day_prob: 20,
          heavy_rain_prob: 0
        },
        specific_humidity: {
          avg_g_kg: 10.42,
          min_g_kg: 8.59,
          max_g_kg: 12.68,
          high_humidity_prob: 0
        },
        wind: {
          avg_ms: -0.5,
          avg_mph: -1.2,
          max_mph: 6.4,
          very_windy_prob: 0,
          extreme_wind_prob: 0
        },
        pressure: {
          avg_kpa: 99.86,
          avg_mb: 998.6,
          min_mb: 992.5,
          max_mb: 1003.2,
          low_pressure_prob: 100
        },
        comfort: {
          very_uncomfortable_prob: 0
        },
        sample_size: 10
      },
      llm_summary: "Yes, swimming is suitable!\n\nThe temperature is excellent for swimming, averaging 78.9°F (26.1°C) with no extreme heat or cold expected. Winds are very light, with a maximum of only 6.4 mph. There is a 20% chance of light rain, but no heavy rain is expected.\n\nEnjoy your swim!"
    }
    
    // Simulate API delay
    setTimeout(() => {
      setWeatherData(mockApiResponse)
    }, 500)
  }, [])

  const handleExportCSV = () => {
    // Convert to CSV format
    const csvContent = [
      ['Field', 'Value'],
      ['Activity', selectedData.activity || ''],
      ['Location', selectedData.nameLocation || ''],
      ['Latitude', selectedData.lat || ''],
      ['Longitude', selectedData.lng || ''],
      ['Date', selectedData.date || ''],
      ['Time', selectedData.time || ''],
      ['Export Date', new Date().toLocaleString()]
    ].map(row => row.join(',')).join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `skyra-weather-analysis-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    // Prepare data for JSON export
    const jsonData = {
      selectedData,
      exportDate: new Date().toISOString(),
      analysis: {
        activity: selectedData.activity,
        location: {
          name: selectedData.nameLocation,
          coordinates: {
            lat: selectedData.lat,
            lng: selectedData.lng
          }
        },
        targetDate: selectedData.date,
        targetTime: selectedData.time
      }
    }

    // Create and download file
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
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
    <div className='relative min-h-screen overflow-hidden'>
      {/* Galaxy Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <HomeBackground />
      </div>
      
      <Header 
        showExport={true}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        title="Weather Analysis Results"
        subtitle="Historical probability analysis complete"
        showBackButton={true}
      />
      
      <div className='mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10'>
        {/* Data Selected Cards - Full Width */}
        <div className='mb-8 mt-10 animate-[fadeInUp_.8s_.1s_ease_forwards] opacity-0'>
          <DataSelectedCards />
        </div>
        
        {/* Metadata Card */}
        {weatherData?.metadata && (
          <div className='mb-8 animate-[fadeInUp_.8s_.15s_ease_forwards] opacity-0'>
            <MetadataCard metadata={weatherData.metadata} />
          </div>
        )}

        {/* Summary Card with AI Assistant - Full Width */}
        <div className='mb-8 animate-[fadeInUp_.8s_.2s_ease_forwards] opacity-0'>
          <SummaryCard 
            riskLevel="low"
            weatherSummary={weatherData?.llm_summary || "Loading weather analysis..."}
            temperature={{ 
              high: weatherData?.statistics?.temperature?.max_fahrenheit || 33, 
              low: weatherData?.statistics?.temperature?.min_fahrenheit || 19,
              avg: weatherData?.statistics?.temperature?.avg_fahrenheit || 78.9
            }}
            rainProb={weatherData?.statistics?.rain?.rainy_day_prob || 15}
            windSpeed={weatherData?.statistics?.wind?.max_mph || 12}
          />
        </div>

        {/* Weather Statistics Cards */}
        {weatherData?.statistics && (
          <div className='mb-8 animate-[fadeInUp_.8s_.25s_ease_forwards] opacity-0'>
            <WeatherStatsCards statistics={weatherData.statistics} />
          </div>
        )}

        <div className='flex gap-6 max-lg:flex-wrap mb-8 animate-[fadeInUp_.8s_.3s_ease_forwards] opacity-0'>
          <BarChartDetails weatherData={weatherData} />
          <PieChartDetail weatherData={weatherData} />
        </div>
        <div className='animate-[fadeInUp_.8s_.35s_ease_forwards] opacity-0'>
          <LineChartDetails weatherData={weatherData} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard