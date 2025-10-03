import React, { createContext, useState } from "react";

//create context
export const WheatherContext = createContext();
// create provider
export const WheatherProvider = ({ children }) => {

    const [selectedData, setSelectedData] = useState({
        lat: 0,
        lng: 0,
        nameLocation: "",
        date: "",
        time: "",
        activity: "",
        sendData: false,
    });
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <WheatherContext.Provider value={{
            selectedData, setSelectedData,
            currentStep, setCurrentStep
        }}>
            {children}
        </WheatherContext.Provider>
    );
};
