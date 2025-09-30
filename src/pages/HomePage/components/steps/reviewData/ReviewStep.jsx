import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';

const ReviewStep = ({ selectedLocation, date }) => {


    return (
        <div>
            {/* Summary Card */}
            <Card className="pt-0">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 text-xl pt-5 rounded-t-xl">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Analysis Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Location Summary */}
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-medium">Location</p>
                            {selectedLocation ? (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedLocation.lat.toFixed(4)}, {selectedLocation.lon.toFixed(4)}
                                    </p>
                                    {selectedLocation.name && (
                                        <p className="text-sm">{selectedLocation.name}</p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-destructive">No location selected</p>
                            )}
                        </div>
                    </div>

                    {/* Date Summary */}
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-medium">Analysis Period</p>
                            <p className="text-sm">
                                Target Date: {new Date(date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default ReviewStep;