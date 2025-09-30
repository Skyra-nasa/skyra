import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LocationStep from "./steps/detectLocation/LocationStep";
import DateStep from "./steps/detectTime/DateStep";


const MultistepForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;
    const progress = (currentStep / totalSteps) * 100;
    const stepTitles = ["Select Location", "Choose Date & Time"];

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
                    <LocationStep />
                )}
                {currentStep === 2 && (
                    <DateStep />
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
                            <Button onClick={handleNext} >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleAnalyze}
                                size="lg"
                                className="px-8"
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
