import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { DatePicker } from './DatePicker';



const DateStep = ({date, setDate}) => {
    

    // When user picks a date we want to mark the step as ready immediately:
    const handleDateChange = (selected) => {
        setDate(selected);
    };


    return (
        <div className="space-y-6">
            <Card className="pt-0">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border/50 text-xl pt-5 rounded-t-xl">
                    <CardTitle className="flex items-center gap-2 text-card-foreground">
                        <Calendar className="h-5 w-5 text-primary" />
                        Select Target Date
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                    <div className="space-y-3">
                        <Label htmlFor="date" className="text-sm font-medium text-card-foreground">
                            When do you want to analyze the weather?
                        </Label>
                        <DatePicker
                            date={date}
                            onDateChange={handleDateChange}
                            placeholder="Choose any date to analyze"
                            className="text-lg"
                        />
                        <p className="text-xs text-muted-foreground">
                            Choose any date to see historical weather probability patterns
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DateStep;