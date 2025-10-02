import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import LocationStep from "./steps/detectLocation/LocationStep";
import DateStep from "./steps/detectTime/DateStep";
import ReviewStep from "./steps/reviewData/ReviewStep";
import ActivityStep from "./steps/detectActivity/ActivityStep.jsx";
import { useNavigate } from "react-router-dom";

const MultistepForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    const stepTitles = ["Select Activity", "Select Location", "Choose Date & Time", "Review Data"];

    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [date, setDate] = useState();
    const navigate = useNavigate();

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
                return !!selectedActivity;
            case 2:
                return !!selectedLocation;
            case 3:
                return !!date;
            default:
                return false;
        }
    };

    // Send Api
    const handleAnalyze = () => {
        console.log("selectedActivity", selectedActivity, "selectedLocation", selectedLocation, "date", date);
        navigate("/dashboard");
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-20 space-y-8">
            {currentStep === 1 ? (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleNext}
                        className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary/90 via-primary to-primary/95 hover:from-primary hover:via-primary/95 hover:to-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <span className="relative flex items-center gap-2">
                            Skip for now
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
                        </span>
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Weather Analysis Setup</h2>
                        <div className="text-sm text-muted-foreground">
                            Step {currentStep} of {totalSteps}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs">
                            {stepTitles.map((title, index) => (
                                <span
                                    key={index}
                                    className={`${index + 1 <= currentStep ? "text-primary font-medium" : "text-muted-foreground"}`}
                                >
                                    {title}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step Content */}
            <div className="space-y-6">
                {currentStep === 1 && (
                    <ActivityStep
                        selectedActivity={selectedActivity}
                        setSelectedActivity={setSelectedActivity}
                        onNext={handleNext}
                    />
                )}
                {currentStep === 2 && (
                    <LocationStep
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                    />
                )}
                {currentStep === 3 && <DateStep date={date} setDate={setDate} />}
                {currentStep === 4 && (
                    <ReviewStep
                        // selectedActivity={selectedActivity}
                        selectedLocation={selectedLocation}
                        date={date}
                    />
                )}
            </div>

            {/* Navigation (hidden on step 1 except top skip) */}
            {currentStep !== 1 && (
                <div className="mt-4 flex justify-between">
                    <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    {currentStep < totalSteps ? (
                        <Button
                            onClick={handleNext}
                            size="lg"
                            className="cursor-pointer px-8"
                            disabled={!canProceedToNext()}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleAnalyze}
                            size="lg"
                            className="px-8 cursor-pointer"
                        >
                            Analyze Weather
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default MultistepForm;
