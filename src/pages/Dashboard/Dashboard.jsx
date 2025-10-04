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
  const { selectedData, weatherData } = useContext(WheatherContext);

  useEffect(() => {
    if (selectedData.date === "") {
      navigate('/');
    }
  }, [selectedData, navigate])


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
              high: weatherData?.statistics?.temperature?.max_celsius || 33,
              low: weatherData?.statistics?.temperature?.min_celsius || 19,
              avg: weatherData?.statistics?.temperature?.avg_celsius || 78.9
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