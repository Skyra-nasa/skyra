import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import "./loading.scss";

const loadingStates = [
    {
        text: "Connecting to weather service...",
    },
    {
        text: "Fetching climate data...",
    },
    {
        text: "Analyzing temperature patterns...",
    },
    {
        text: "Processing humidity and wind speed...",
    },
    {
        text: "Predicting possible rainfall...",
    },
    {
        text: "Finalizing your weather report 🌍",
    },
];

export function MultiStepLoaderDemo({ loading }) {
    return (
        <div className="w-full h-[60vh] flex items-center justify-center">
            <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
        </div>
    );
}
