"use client";;
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

const CheckIcon = ({
  className
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={cn("w-5 h-5", className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({
  className
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-5 h-5", className)}>
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd" />
    </svg>
  );
};

const LoadingSpinner = () => {
  return (
    <svg
      className="w-5 h-5 animate-spin text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

const LoaderCore = ({
  loadingStates,
  value = 0
}) => {
  const isComplete = value >= loadingStates.length - 1;
  
  return (
    <div className="flex relative justify-center items-center max-w-2xl mx-auto flex-col">
      {/* Title */}
      <div className="mb-8 text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70 dark:from-white dark:via-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Analyzing Your Weather
        </h2>
        <div className="flex items-center justify-center gap-2">
          <p className="text-muted-foreground text-base md:text-lg">
            {isComplete ? "Finalizing your insights" : "Please wait while we process your request"}
          </p>
          <motion.span
            className="text-muted-foreground text-base md:text-lg"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ...
          </motion.span>
        </div>
      </div>

      {/* Loading Steps */}
      <div className="w-full space-y-3">
        {loadingStates.map((loadingState, index) => {
          const isCompleted = index < value;
          const isCurrent = index === value;
          const isPending = index > value;
          const isSpecialStep = loadingState.isSpecial && isCurrent;
          
          // Check if any special step is currently active
          const isAnySpecialStepActive = loadingStates.some((state, idx) => state.isSpecial && idx === value);
          
          // Hide all non-special steps when special step is active
          if (isAnySpecialStepActive && !isSpecialStep) {
            return null;
          }

          return (
            <motion.div
              key={index}
              className={cn(
                "flex items-center gap-4 rounded-lg border transition-all duration-500 relative overflow-hidden",
                isSpecialStep && "p-8 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border-primary/50 shadow-2xl shadow-primary/30",
                isCurrent && !isSpecialStep && "p-4 bg-primary/5 border-primary/30 shadow-lg shadow-primary/10",
                isCompleted && "p-4 bg-primary/10 border-primary/20",
                isPending && "p-4 bg-muted/30 border-border/50 opacity-60"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: isSpecialStep ? 1.05 : isCurrent ? 1.02 : 1
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: isSpecialStep ? 0 : index * 0.05 }}
            >
              {/* Animated background for special step */}
              {isSpecialStep && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Icon */}
              <div className={cn(
                "flex-shrink-0 transition-all duration-300 relative z-10"
              )}>
                {isPending && (
                  <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                )}
                {isCurrent && !isSpecialStep && <LoadingSpinner />}
                {isSpecialStep && (
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.3, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-primary drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </motion.div>
                )}
                {isCompleted && (
                  <CheckFilled className="text-primary" />
                )}
              </div>

              {/* Text */}
              <span className={cn(
                "text-sm md:text-base font-medium transition-colors duration-300 relative z-10",
                isSpecialStep && "text-primary font-semibold text-lg md:text-xl tracking-wide",
                isCurrent && !isSpecialStep && "text-primary font-semibold",
                isCompleted && "text-primary/80",
                isPending && "text-muted-foreground"
              )}>
                {loadingState.text}
              </span>

              {/* Progress indicator for special step */}
              {isSpecialStep && (
                <motion.div
                  className="ml-auto relative z-10 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="flex gap-1"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 h-1 rounded-full bg-primary"
                        animate={{ 
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          delay: i * 0.1,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Progress indicator for normal current step */}
              {isCurrent && !isSpecialStep && (
                <motion.div
                  className="ml-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex gap-1">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-primary"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full mt-8 space-y-2">
        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary/80 via-primary to-primary/80 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${((value + 1) / loadingStates.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Step {value + 1} of {loadingStates.length}</span>
          <span>{Math.round(((value + 1) / loadingStates.length) * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 2000,
  loop = false
}) => {
  const [currentState, setCurrentState] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Don't reset immediately, let the animation finish
      return;
    }

    if (loading && !hasStarted) {
      setHasStarted(true);
      setCurrentState(0);
    }

    if (currentState >= loadingStates.length - 1 && !loop) {
      return; // Stop at the last step
    }

    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1));
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration, hasStarted]);

  // Reset hasStarted when component unmounts or loading ends completely
  useEffect(() => {
    if (!loading && hasStarted) {
      const resetTimer = setTimeout(() => {
        setHasStarted(false);
        setCurrentState(0);
      }, 500); // Small delay before resetting
      return () => clearTimeout(resetTimer);
    }
  }, [loading, hasStarted]);
  
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-screen fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 80%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-2xl px-4">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
