import React, { useContext, useEffect } from 'react'
import Header from '@/shared/layout/Header'
import BarChartDetails from './components/charts/BarChartDetails'
import PieChartDetail from './components/charts/PieChartDetail'
import LineChartDetails from './components/charts/LineChartDetails'
import { WheatherContext } from '@/shared/context/WhetherProvider'
import DataSelectedCards from './components/DataSelectedCards'
import SummaryCard from './components/SummaryCard'
import { useNavigate } from 'react-router-dom'
import HomeBackground from '@/components/homebackground'

function Dashboard() {
  const navigate = useNavigate();
  const { selectedData } = useContext(WheatherContext);

  useEffect(() => {
    if (selectedData.date === "") {
      navigate('/');
    }
  }, [selectedData, navigate])

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
        
        {/* Summary Card with AI Assistant - Full Width */}
        <div className='mb-8 animate-[fadeInUp_.8s_.15s_ease_forwards] opacity-0'>
          <SummaryCard 
            riskLevel="low"
            weatherSummary="Weather Today will be warmer with a high of 33°C and a low of 19°C. Tomorrow, the expected temperature will be around 31°C."
            temperature={{ high: 33, low: 19, tomorrow: 31 }}
          />
        </div>

        <div className='flex gap-6 max-lg:flex-wrap mb-8 animate-[fadeInUp_.8s_.2s_ease_forwards] opacity-0'>
          <BarChartDetails />
          <PieChartDetail />
        </div>
        <div className='animate-[fadeInUp_.8s_.3s_ease_forwards] opacity-0'>
          <LineChartDetails />
        </div>
      </div>
    </div>
  )
}

export default Dashboard