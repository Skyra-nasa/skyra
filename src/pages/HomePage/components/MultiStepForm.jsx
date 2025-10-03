import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import LocationStep from "./steps/detectLocation/LocationStep";
import DateStep from "./steps/detectTime/DateStep";
import ActivityStep from "./steps/detectActivity/ActivityStep.jsx";
import { useNavigate } from "react-router-dom";
import { MultiStepLoaderDemo } from "@/shared/ui/Loading/Loading";
import { WheatherContext } from "@/shared/context/WhetherProvider";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { postSelectedData } from "@/shared/api/postSelectedData";

const MultistepForm = () => {
    const { selectedData, setSelectedData, currentStep, setCurrentStep } =
        useContext(WheatherContext);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState('forward');
    const totalSteps = 3;
    const progress = (currentStep / totalSteps) * 100;
    const [loading, setLoading] = useState(false)
    const stepTitles = ["Select Activity", "Select Location", "Choose Date"];
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [dateData, setDateData] = useState({
        date: '',
    });
    const navigate = useNavigate();
    console.log(selectedData)
    // Send Api
    const handleAnalyze = () => {
        setSelectedData({
            lat: selectedLocation?.lat || selectedData?.lat,
            lng: selectedLocation?.lon || selectedData?.lng,
            nameLocation: selectedLocation?.name || selectedData?.nameLocation,
            date: dateData?.date || selectedData?.date,
            activity: selectedActivity || selectedData?.activity,
            sendData: true,
        })
        let data = {
            lat: selectedLocation?.lat || selectedData?.lat,
            lng: selectedLocation?.lon || selectedData?.lng,
            date: dateData?.date || selectedData?.date,
            ...(selectedActivity || selectedData?.activity) && { activity: selectedActivity || selectedData?.activity }
        }
        // postSelectedData(data,setLoading)
        //on success
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });
        }, 400);
        navigate("/dashboard");
        //
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setIsTransitioning(true);
            setTransitionDirection('forward');

            // Add a small delay for morphing animation
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                setTimeout(() => setIsTransitioning(false), 100);
            }, 300);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setIsTransitioning(true);
            setTransitionDirection('backward');

            setTimeout(() => {
                setCurrentStep(currentStep - 1);
                setTimeout(() => setIsTransitioning(false), 100);
            }, 300);
        }
    };

    const canProceedToNext = () => {
        switch (currentStep) {
            case 1:
                return !!selectedActivity || !!selectedData.activity;
            case 2:
                return !!selectedLocation || !!selectedData.lat;
            case 3:
                return !!dateData?.date || !!selectedData.date;
            default:
                return false;
        }
    };

    return loading ? <MultiStepLoaderDemo loading={loading} setLoading={setLoading} /> : (<div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-20 space-y-8">
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium tracking-wide">
                        Step {currentStep}
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-[1.1] tracking-tight">
                        <span className="bg-gradient-to-b from-foreground via-foreground/80 to-foreground/60 dark:from-white dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                            {currentStep === 1 ? "Choose What Suits You Better" :
                                currentStep === 2 ? "Pick Your Location" :
                                    "Select Date"}
                        </span>
                    </h2>
                </div>
                {currentStep === 1 && (
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
                )}
            </div>
            {currentStep > 1 && (
                <div className="space-y-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs">
                        {stepTitles.map((title, index) => (
                            <span
                                key={index}
                                className={`transition-colors duration-300 ${index + 1 <= currentStep ? "text-primary font-medium" : "text-muted-foreground"
                                    }`}
                            >
                                {title}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
            <div
                className={`transition-all duration-300 ease-out ${currentStep === 1
                    ? `${isTransitioning ? 'opacity-0' : 'opacity-100'}`
                    : `transform ${isTransitioning
                        ? transitionDirection === 'forward'
                            ? ' opacity-0 '
                            : 'opacity-0'
                        : 'translate-x-0 opacity-100 scale-100'
                    }`
                    }`}
            >
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
                {currentStep === 3 && <DateStep dateData={dateData} setDateData={setDateData} />}
            </div>
        </div>

        {currentStep !== 1 && (
            <div className="mt-4 flex justify-between">
                <Button variant="outline" className="cursor-pointer px-8" onClick={handlePrevious} disabled={currentStep === 1}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                {currentStep < totalSteps ?
                    selectedData?.sendData ?
                        <Dialog>
                            <DialogTrigger className="cursor-pointer rounded-md  has-[>svg]:px-4 px-8 flex items-center bg-primary text-primary-foreground hover:bg-primary/90">
                                <span>Continue</span>
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </DialogTrigger>
                            <DialogContent className="flex flex-col gap-5 items-center ">
                                <DialogHeader>
                                    <DialogTitle className="text-[22px] my-3 text-center">What would you like to do next?</DialogTitle>
                                    <DialogDescription className="text-[15px] mb-4 max-w-[392px] text-center">
                                        You can either review the current step before moving forward, or start the analysis right away.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="flex gap-10">
                                    <DialogClose asChild>
                                        <Button variant="outline" className="cursor-pointer" onClick={handleAnalyze}>Start Analysis</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button variant="default" className="cursor-pointer" onClick={handleNext}>Go to Next Step</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        :
                        <Button
                            onClick={handleNext}
                            size="lg"
                            className="cursor-pointer px-8"
                            disabled={!canProceedToNext()}
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                    : (
                        <Button
                            disabled={!canProceedToNext()}
                            onClick={handleAnalyze}
                            size="lg"
                            className="px-8 cursor-pointer"
                        >
                            Analyze Weather
                        </Button>
                    )}
            </div>
        )}
    </div>)
};

export default MultistepForm;
