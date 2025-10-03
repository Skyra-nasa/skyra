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
                <button className='flex flex-col gap-1.5 rounded-2xl cursor-pointer text-[17px] p-5 border border-[#948b8b]'
                    onClick={() => moveToSpecificStep("activity")}>
                    <h2>Your Activity</h2>
                    <p>{selectedData.activity}</p>
                </button>
            }
            <button className='flex flex-col gap-1.5 rounded-2xl cursor-pointer text-[17px] p-5 border border-[#948b8b]'
                onClick={() => moveToSpecificStep("location")}>
                <h2>Your Location</h2>
                <p>{selectedData.nameLocation}</p>
                <p className='flex gap-4'>
                    <span>Lat: {selectedData.lat}</span>
                    <span>Lng: {selectedData.lng}</span>
                </p>
            </button>
            <button className='flex flex-col gap-1.5 rounded-2xl cursor-pointer text-[17px] p-5 border border-[#948b8b]'
                onClick={() => moveToSpecificStep("date")}>
                <h2>Your Target Date</h2>
                <p className='flex gap-4'>
                    <span>Date: {(selectedData.date).toString()}</span>
                    <span>Time: {selectedData.time}</span>
                </p>
            </button>
        </div>
    )
}

export default DataSelectedCards