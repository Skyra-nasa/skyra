import { WheatherContext } from '@/shared/context/WhetherProvider';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';

function DataSelectedCards() {

    const { selectedData, setCurrentStep } = useContext(WheatherContext);
    const navigate = useNavigate()
    const moveToSpecificStep = (type) => {
        switch (type) {
            case "activity":
                setCurrentStep(1);
                break;
            case "location":
                setCurrentStep(2);
                break;
            case "date":
                setCurrentStep(3);
                break;
        }
        navigate("/home")
    }
    return (
        <div className='flex justify-between gap-4'>
            {
                selectedData?.activity &&
                <button
                    className="flex flex-col min-w-[300px] gap-1.5 rounded-2xl cursor-pointer text-[17px] p-5 
             border border-[#948b8b]/40 
             bg-white/10 backdrop-blur-md shadow-md 
             transition duration-300 hover:bg-white/20 hover:shadow-lg"
                    onClick={() => moveToSpecificStep("activity")}
                >
                    <h2 className="font-semibold text-white">Your Activity</h2>
                    <p className="text-gray-200">{selectedData.activity}</p>
                </button>

            }
            <button className='flex flex-col min-w-[300px] gap-1.5 rounded-2xl cursor-pointer text-[17px] p-5 
             border border-[#948b8b]/40 
             bg-white/10 backdrop-blur-md shadow-md 
             transition duration-300 hover:bg-white/20 hover:shadow-lg'
                onClick={() => moveToSpecificStep("location")}>
                <h2>Your Location</h2>
                <p>{selectedData.nameLocation}</p>
                <p className='flex gap-4 text-gray-200'>
                    <span>Lat: {selectedData.lat}</span>
                    <span>Lng: {selectedData.lng}</span>
                </p>
            </button>
            <button className='flex flex-col min-w-[300px] gap-1.5 rounded-2xl cursor-pointer text-[17px] p-5 
             border border-[#948b8b]/40 
             bg-white/10 backdrop-blur-md shadow-md 
             transition duration-300 hover:bg-white/20 hover:shadow-lg'
                onClick={() => moveToSpecificStep("date")}>
                <h2>Your Target Date</h2>
                <p className='flex gap-4 text-gray-200'>
                    <span>Date: {(selectedData.date).toString()}</span>
                    <span>Time: {selectedData.time}</span>
                </p>
            </button>
        </div>
    )
}

export default DataSelectedCards