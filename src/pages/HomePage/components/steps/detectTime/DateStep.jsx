import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Sparkles, Info } from 'lucide-react';
import { DatePicker } from './DatePicker';

const DateStep = ({date, setDate}) => {
    // When user picks a date we want to mark the step as ready immediately:
    const handleDateChange = (selected) => {
        setDate(selected);
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
             
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    When would you like to peek?
                </h3>
               
            </div>

            {/* Main Card */}
            <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card/80 via-card to-card/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/3 to-primary/5 border-b border-border/30 pb-6">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                            Choose Your Target Date
                        </span>
                    </CardTitle>
                </CardHeader>
                
                <CardContent className="p-8 space-y-8">
                    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Date Picker Section */}
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2 text-foreground">
                                    <Clock className="h-4 w-4 text-primary" />
                                    Select Date for Analysis
                                </Label>
                                
                                <DatePicker
                                    date={date}
                                    onDateChange={handleDateChange}
                                    placeholder="Click to choose a date"
                                    className="text-lg"
                                />
                            </div>

                            {/* Selected Date Preview */}
                            {date && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        <span className="text-sm font-medium text-primary">Selected Date</span>
                                    </div>
                                    <p className="text-lg font-semibold text-foreground">
                                        {formatSelectedDate(date)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="space-y-6">
                         

                            {/* Quick Date Options */}
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-muted-foreground">Quick Options</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: 'Today', days: 0 },
                                        { label: 'Tomorrow', days: 1 },
                                        { label: 'Next Week', days: 7 },
                                        { label: 'Next Month', days: 30 }
                                    ].map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => {
                                                const targetDate = new Date();
                                                targetDate.setDate(targetDate.getDate() + option.days);
                                                handleDateChange(targetDate.toISOString().split('T')[0]);
                                            }}
                                            className="px-3 py-2 text-xs font-medium rounded-lg border border-border/50 bg-background/50 hover:bg-accent/10 hover:border-accent/30 transition-all duration-200 text-muted-foreground hover:text-foreground"
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Hint */}
            {!date && (
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