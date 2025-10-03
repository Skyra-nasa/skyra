import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

const loadingStates = [
    {
        text: "Buying a condo",
    },
    {
        text: "Travelling in a flight",
    },
    {
        text: "Meeting Tyler Durden",
    },
    {
        text: "He makes soap",
    },
    {
        text: "We goto a bar",
    },
    {
        text: "Start a fight",
    },
    {
        text: "We like it",
    },
    {
        text: "Welcome to F**** C***",
    },
];

export function MultiStepLoaderDemo({ loading }) {
    return (
        <div className="w-full h-[60vh] flex items-center justify-center">
            <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
        </div>
    );
}
