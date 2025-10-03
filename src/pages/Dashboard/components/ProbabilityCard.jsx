import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Snowflake, CloudRain, Wind, AlertTriangle } from 'lucide-react';

const conditionIcons = {
    hot: Thermometer,
    cold: Snowflake,
    wet: CloudRain,
    windy: Wind,
    uncomfortable: AlertTriangle,
};

const conditionColors = {
    hot: 'from-red-500 to-orange-500',
    cold: 'from-blue-500 to-cyan-500',
    wet: 'from-blue-400 to-blue-600',
    windy: 'from-green-400 to-teal-500',
    uncomfortable: 'from-yellow-500 to-orange-500',
};

const ProbabilityCard = ({
    title,
    probability,
    threshold,
    description,
    type,
    trend
}) => {
    const Icon = conditionIcons[type];
    const colorClass = conditionColors[type];

    const riskLevel = probability >= 0.6 ? 'High' : probability >= 0.3 ? 'Medium' : 'Low';
    const riskColor = probability >= 0.6 ? 'destructive' : probability >= 0.3 ? 'secondary' : 'muted';

    return (
        <Card className="relative min-w-sm max-w-lg flex-1 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105">
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-5`} />
            <CardHeader className="relative pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 text-weather-${type}`} />
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    </div>
                    <Badge variant={riskColor} className="text-xs">
                        {riskLevel} Risk
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="relative">
                <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                            {Math.round(probability * 100)}
                        </span>
                        <span className="text-sm text-muted-foreground">%</span>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                            Threshold: <span className="font-medium">{threshold}</span>
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {trend && (
                        <div className="pt-2 border-t">
                            <div className="flex items-center gap-1">
                                <span className={`text-xs ${trend === 'increasing' ? 'text-destructive' :
                                    trend === 'decreasing' ? 'text-green-600' :
                                        'text-muted-foreground'
                                    }`}>
                                    {trend === 'increasing' ? '↗' : trend === 'decreasing' ? '↘' : '→'}
                                </span>
                                <span className="text-xs text-muted-foreground capitalize">
                                    {trend} trend (last 20 years)
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProbabilityCard;