import React, { useContext, useEffect } from 'react'
import ProbabilityCard from './components/ProbabilityCard'
import SpecificHeader from './components/SpecificHeader'
import { dataCards } from './mockData/dataCards'
import BarChartDetails from './components/charts/BarChartDetails'
import PieChartDetail from './components/charts/PieChartDetail'
import LineChartDetails from './components/charts/LineChartDetails'
import { WheatherContext } from '@/shared/context/WhetherProvider'
import DataSelectedCards from './components/DataSelectedCards'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate();
  const { selectedData, setCurrentStep } = useContext(WheatherContext);

  useEffect(() => {
    if (selectedData.date === "") {
      navigate('/home');
      setCurrentStep(1)
    }

  }, [selectedData])
  return (
    <div className='mb-20'>
      <SpecificHeader />
      <div>
      </div>
      <div className='mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex gap-6 mt-10 flex-wrap justify-center mb-10' >
          <DataSelectedCards />
          {/* {
            dataCards.map((item, index) => {
              return (
                <React.Fragment key={`item-${index}`}>
                  <ProbabilityCard title={item.title} probability={item.probability} description={item.description}
                    threshold={item.threshold} type={item.type} trend={item.trend} />
                </React.Fragment>
              )

            })
          } */}
        </div>
        <div className='flex gap-6 max-lg:flex-wrap mb-8'>
          <BarChartDetails />
          <PieChartDetail />
        </div>
        <div>
          <LineChartDetails />
        </div>
      </div>
    </div>
  )
}

export default Dashboard