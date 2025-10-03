import React, { useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Sparkles, Info } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { WheatherContext } from '@/shared/context/WhetherProvider';

const DateStep = ({ dateData, setDateData }) => {
    const { selectedData } = useContext(WheatherContext)

    // When user picks a date we want to mark the step as ready immediately:
    const handleDateChange = (selected) => {
        setDateData({ date: selected, time: '12:00:00' });
    };

    const formatSelectedDate = (date) => {
        if (!date) return null;
        const selectedDate = new Date(date);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return selectedDate.toLocaleDateString('en-US', options);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    When would you like to peek?
                </h3>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Select a date to analyze historical weather patterns
                </p>
            </div>

            {/* Main Card */}
            <Card className="group pt-0 overflow-hidden border-2 border-border/50 shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:border-primary/30 bg-card/40 backdrop-blur-xl">
                <CardHeader className="pt-6 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-b border-border/30 pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 border border-primary/30">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <span className="bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent font-bold">
                            Choose Your Target Date
                        </span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-8 space-y-8">
                    {/* Date Picker Section */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2 text-foreground">
                                <Clock className="h-4 w-4 text-primary" />
                                Select Date for Analysis
                            </Label>

                            <DatePicker
                                date={dateData?.date || selectedData?.date}
                                onDateChange={handleDateChange}
                                placeholder="Click to choose a date"
                                className="text-lg"
                            />
                        </div>
                    </div>

                

                    {/* Selected Date Display - Full Width */}
                    {(dateData?.date || selectedData?.date) && (
                        <div className="group relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/30 hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 hover:border-primary/40">
                            {/* Animated background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Decorative corner accents */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full blur-2xl opacity-50" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full blur-2xl opacity-50" />
                            
                            <div className="relative z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 border-2 border-primary/30 backdrop-blur-sm">
                                            <Calendar className="w-6 h-6 text-primary animate-pulse" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-primary block">Selected Date</span>
                                            <span className="text-xs text-muted-foreground">Target analysis date</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs font-semibold text-primary">Active</span>
                                    </div>
                                </div>
                                
                                <div className="p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/30">
                                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                                        {dateData?.date ? formatSelectedDate(dateData?.date) : formatSelectedDate(selectedData?.date)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Bottom Hint */}
            {!dateData?.date && (
                <div className="text-center">
                    <p className="text-sm text-muted-foreground bg-muted/30 rounded-full px-4 py-2 inline-block">
                        tip: Choose any date from the past or future to see weather patterns
                    </p>
                </div>
            )}
        </div>
    );
};

export default DateStep;