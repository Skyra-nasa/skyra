import { WheatherContext } from '@/shared/context/WhetherProvider';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { PartyPopper, MapPin, Calendar, ChevronRight } from 'lucide-react';

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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
            {/* Step 1: Activity */}
            <button
                className="group relative flex items-center gap-4 rounded-2xl cursor-pointer p-6 
                border-2 border-border/50 
                bg-card/40 backdrop-blur-xl shadow-xl 
                transition-all duration-500 hover:shadow-2xl hover:shadow-chart-1/20 hover:border-chart-1/50 hover:-translate-y-1 
                overflow-hidden"
                onClick={() => moveToSpecificStep("activity")}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-chart-1/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-chart-1/20 group-hover:bg-chart-1/30 transition-colors">
                    <PartyPopper className="w-6 h-6 text-chart-1" />
                </div>
                <div className="flex-1 text-left relative z-10">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Step 1</p>
                    <h2 className="font-semibold text-foreground">Activity</h2>
                    <p className="text-sm text-muted-foreground capitalize">{selectedData?.activity}</p>
                </div>
            </button>

            {/* Step 2: Location */}
            <button 
                className='group relative flex items-center gap-4 rounded-2xl cursor-pointer p-6 
                border-2 border-border/50 
                bg-card/40 backdrop-blur-xl shadow-xl 
                transition-all duration-500 hover:shadow-2xl hover:shadow-chart-2/20 hover:border-chart-2/50 hover:-translate-y-1 
                overflow-hidden'
                onClick={() => moveToSpecificStep("location")}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-chart-2/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-chart-2/20 group-hover:bg-chart-2/30 transition-colors">
                    <MapPin className="w-6 h-6 text-chart-2" />
                </div>
                <div className="flex-1 text-left relative z-10">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Step 2</p>
                    <h2 className="font-semibold text-foreground">Location</h2>
                    <p className="text-sm text-muted-foreground">{selectedData.nameLocation}</p>
                </div>
            </button>

            {/* Step 3: Date */}
            <button 
                className='group relative flex items-center gap-4 rounded-2xl cursor-pointer p-6 
                border-2 border-border/50 
                bg-card/40 backdrop-blur-xl shadow-xl 
                transition-all duration-500 hover:shadow-2xl hover:shadow-chart-3/20 hover:border-chart-3/50 hover:-translate-y-1 
                overflow-hidden'
                onClick={() => moveToSpecificStep("date")}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-chart-3/20 group-hover:bg-chart-3/30 transition-colors">
                    <Calendar className="w-6 h-6 text-chart-3" />
                </div>
                <div className="flex-1 text-left relative z-10">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Step 3</p>
                    <h2 className="font-semibold text-foreground">Target Date</h2>
                    <p className="text-sm text-muted-foreground">
                        {(selectedData.date).toString()} • {selectedData.time}
                    </p>
                </div>
            </button>
        </div>
    )
}

export default DataSelectedCards