import { WheatherContext } from '@/shared/context/WhetherProvider';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { PartyPopper, MapPin, Calendar, Edit2, Sparkles } from 'lucide-react';

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
    
    const cards = [
        {
            step: "Step 1",
            title: "Activity",
            value: selectedData?.activity,
            icon: PartyPopper,
            color: "chart-1",
            type: "activity",
            gradient: "from-chart-1/10 via-chart-1/5 to-transparent",
            description: "Your planned activity"
        },
        {
            step: "Step 2",
            title: "Location",
            value: selectedData.nameLocation,
            icon: MapPin,
            color: "chart-2",
            type: "location",
            gradient: "from-chart-2/10 via-chart-2/5 to-transparent",
            description: "Analysis location"
        },
        {
            step: "Step 3",
            title: "Target Date",
            value: selectedData.date?.toString(),
            icon: Calendar,
            color: "chart-3",
            type: "date",
            gradient: "from-chart-3/10 via-chart-3/5 to-transparent",
            description: "Forecast date"
        }
    ]

    return (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
            {cards.map((card, index) => {
                const Icon = card.icon
                return (
                    <button
                        key={index}
                        className="group relative flex items-center gap-3 rounded-xl cursor-pointer p-4 
                        border border-border/50 
                        bg-card/40 backdrop-blur-xl shadow-lg 
                        transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 
                        overflow-hidden
                        hover:border-primary/50"
                        onClick={() => moveToSpecificStep(card.type)}
                    >
                        {/* Animated background gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        {/* Edit button - appears on hover */}
                        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <div className="p-1.5 rounded-lg bg-primary/20 backdrop-blur-sm border border-primary/30 hover:bg-primary/30 transition-colors">
                                <Edit2 className="w-3 h-3 text-primary" />
                            </div>
                        </div>

                        {/* Icon */}
                        <div className={`relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-${card.color}/20 group-hover:bg-${card.color}/30 group-hover:scale-105 transition-all duration-300`}
                             style={{
                                 backgroundColor: `oklch(var(--${card.color}) / 0.2)`,
                             }}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`}
                                  style={{ color: `oklch(var(--${card.color}))` }}
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-left relative z-10 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                    {card.step}
                                </span>
                                <Sparkles className="w-2.5 h-2.5 text-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground mb-1">
                                {card.title}
                            </h3>
                            <p className="text-xs font-medium text-muted-foreground capitalize truncate">
                                {card.value}
                            </p>
                        </div>

                        {/* Hover indicator */}
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                             style={{
                                 background: `linear-gradient(90deg, transparent, oklch(var(--${card.color})), transparent)`
                             }}
                        />
                    </button>
                )
            })}
        </div>
    )
}

export default DataSelectedCards