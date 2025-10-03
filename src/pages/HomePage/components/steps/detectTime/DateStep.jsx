import React, { useContext, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Sparkles, Info, ClockIcon } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { Input } from '@/components/ui/input';
import { WheatherContext } from '@/shared/context/WhetherProvider';

const DateStep = ({ dateData, setDateData }) => {
    const getCurrentTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };
    const [time, setTime] = useState(getCurrentTime());
    const { selectedData } = useContext(WheatherContext)

    // When user picks a date we want to mark the step as ready immediately:
    const handleDateChange = (selected) => {
        setDateData({ date: selected, time });
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
            <Card className="pt-0 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card/80 via-card to-card/90 backdrop-blur-sm">
                <CardHeader className="pt-5 bg-gradient-to-r from-primary/5 via-accent/3 to-primary/5 border-b border-border/30 pb-6">
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
                                    date={dateData?.date || selectedData?.date}
                                    onDateChange={handleDateChange}
                                    placeholder="Click to choose a date"
                                    className="text-lg"
                                />
                            </div>
                            {/* Selected time */}
                            <div className="border-t p-3">
                                <div className="flex items-center gap-3">
                                    <Label className="text-[15px]">
                                        Enter time
                                    </Label>
                                    <div className="relative grow">
                                        <Input
                                            type="time"
                                            value={time || selectedData?.time}
                                            onChange={(e) => {
                                                setTime(e.target.value);
                                                setDateData((prev) => ({ ...prev, time: e.target.value }));
                                            }}
                                            step="1"
                                            className="peer h-11 rounded-2xl appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none
                                            focus:border-primary focus:ring-4 focus-visible::ring-primary/20"
                                        />
                                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                            <ClockIcon size={16} aria-hidden="true" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Date Preview */}
                            {(dateData?.date || selectedData?.date) && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                        <span className="text-sm font-medium text-primary">Selected Date & Time</span>
                                    </div>
                                    <p className="text-lg font-semibold text-foreground flex gap-1.5">
                                        {dateData?.date ? formatSelectedDate(dateData?.date) : formatSelectedDate(selectedData?.date)}
                                        <span> &</span><span> {time ? time : selectedData?.time}</span>
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