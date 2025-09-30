import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LocationStep from "./steps/detectLocation/LocationStep";
import DateStep from "./steps/detectTime/DateStep";
import ReviewStep from "./steps/reviewData/ReviewStep";
import { useNavigate } from "react-router-dom";


const MultistepForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const progress = (currentStep / totalSteps) * 100;
    const stepTitles = ["Select Location", "Choose Date & Time"];
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [date, setDate] = useState();
    const navigate = useNavigate()
    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };
    const canProceedToNext = () => {
        switch (currentStep) {
            case 1:
                return !!selectedLocation;
            case 2:
                return !!date;
            case 3:
                return selectedLocation && date;
            default:
                return false;
        }
    };
    // Send Api
    const handleAnalyze = () => {
        console.log("selectedLocation", selectedLocation, "date", date);
        navigate("/dashboard")
    };
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-20">
            {/* Progress */}
            <Card className="my-6">
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Weather Analysis Setup</h2>
                            <div className="text-sm text-muted-foreground">
                                Step {currentStep} of {totalSteps}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Progress value={progress} className="w-full" />
                            <div className="flex justify-between text-sm">
                                {stepTitles.map((title, index) => (
                                    <span
                                        key={index}
                                        className={`${index + 1 <= currentStep
                                            ? "text-primary font-medium"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Step Content */}
            <div className="space-y-6">
                {currentStep === 1 && (
                    <LocationStep
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation} />
                )}
                {currentStep === 2 && (
                    <DateStep
                        date={date}
                        setDate={setDate} />
                )}
                {currentStep === 3 && (
                    <ReviewStep
                        selectedLocation={selectedLocation}
                        date={date} />
                )}
            </div>

            {/* Navigation */}
            <Card className="mt-6">
                <CardContent className="pt-6">
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button onClick={handleNext} size="lg" className="cursor-pointer px-8" disabled={!canProceedToNext()} >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleAnalyze}
                                disabled={!canProceedToNext()}
                                size="lg"
                                className="px-8 cursor-pointer"
                            >
                                Analyze Weather
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MultistepForm;
