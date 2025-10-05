import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import "./loading.scss";

const loadingStates = [
    {
        text: "Connecting to NASA POWER API...",
    },
    {
        text: "Fetching historical weather data...",
    },
    {
        text: "Analyzing temperature & precipitation patterns...",
    },
    {
        text: "Processing humidity and wind statistics...",
    },
    {
        text: "Calculating atmospheric pressure trends...",
    },
    {
        text: "Evaluating comfort & safety probabilities...",
    },
    {
        text: " Generating your personalized activity forecast",
        isSpecial: true,
    },
];

export function MultiStepLoaderDemo({ loading }) {
    return (
        <div className="w-full h-[60vh] flex items-center justify-center">
            <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
        </div>
    );
}
