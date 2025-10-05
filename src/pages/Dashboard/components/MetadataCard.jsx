import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Calendar, Database, FileText } from 'lucide-react'

function MetadataCard({ metadata }) {
    if (!metadata) return null

    const metadataItems = [
        {
            icon: MapPin,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-500/20',
            label: 'Location',
            value: `${metadata.location?.latitude?.toFixed(2)}°N, ${metadata.location?.longitude?.toFixed(2)}°E`
        },
        {
            icon: Calendar,
            iconColor: 'text-green-500',
            iconBg: 'bg-green-500/20',
            label: 'Target Date',
            value: new Date(metadata.target_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        },
        {
            icon: FileText,
            iconColor: 'text-orange-500',
            iconBg: 'bg-orange-500/20',
            label: 'Analysis Date',
            value: new Date(metadata.analysis_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })
        }
    ]

    return (
        <Card className="bg-card/40 backdrop-blur-xl border-2 border-border/50 shadow-xl">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {metadataItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div 
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30 transition-all duration-300 hover:border-border/50 hover:shadow-lg"
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${item.iconBg} flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${item.iconColor}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                                    <p className="text-sm font-semibold text-foreground truncate" title={item.value}>
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default MetadataCard
