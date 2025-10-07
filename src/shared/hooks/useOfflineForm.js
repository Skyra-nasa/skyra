import { useState, useCallback, useEffect } from 'react';
import { offlineFormHandler } from '@/shared/utils/offlineFormHandler';

/**
 * Enhanced form hook with offline support
 * Automatically handles form submission with offline queue and background sync
 */
export const useOfflineForm = (options = {}) => {
  const {
    onSuccess,
    onError,
    submitUrl = '/api/submit',
    method = 'POST',
    headers = { 'Content-Type': 'application/json' },
    type = 'general',
    maxRetries = 3,
    _showSuccessNotification = true,
    _showErrorNotification = true
  } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [offlineSubmissionId, setOfflineSubmissionId] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const submitForm = useCallback(async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    setOfflineSubmissionId(null);

    try {
      const submissionOptions = {
        url: submitUrl,
        method,
        headers,
        type,
        maxRetries
      };

      const result = await offlineFormHandler.submitForm(formData, submissionOptions);

      if (result.success) {
        setSubmitSuccess(true);
        
        if (!result.online) {
          setOfflineSubmissionId(result.offlineId);
          console.log('Form submitted offline with ID:', result.offlineId);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [submitUrl, method, headers, type, maxRetries, onSuccess, onError]);

  const resetForm = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
    setOfflineSubmissionId(null);
  }, []);

  return {
    submitForm,
    resetForm,
    isSubmitting,
    isOnline,
    submitError,
    submitSuccess,
    offlineSubmissionId,
    // Helper states
    isOfflineSubmission: !!offlineSubmissionId,
    canSubmit: !isSubmitting
  };
};

/**
 * Hook for managing form field state with validation
 */
export const useFormFields = (initialState = {}, validators = {}) => {
  const [fields, setFields] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const updateField = useCallback((name, value) => {
    setFields(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const touchField = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const validateField = useCallback((name, value) => {
    if (validators[name]) {
      const error = validators[name](value, fields);
      setErrors(prev => ({ ...prev, [name]: error }));
      return !error;
    }
    return true;
  }, [validators, fields]);

  const validateAllFields = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validators).forEach(name => {
      const error = validators[name](fields[name], fields);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validators).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    
    return isValid;
  }, [fields, validators]);

  const resetFields = useCallback(() => {
    setFields(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  const getFieldProps = useCallback((name) => ({
    value: fields[name] || '',
    onChange: (e) => updateField(name, e.target.value),
    onBlur: () => {
      touchField(name);
      validateField(name, fields[name]);
    },
    error: touched[name] ? errors[name] : null,
    name
  }), [fields, errors, touched, updateField, touchField, validateField]);

  return {
    fields,
    errors,
    touched,
    updateField,
    touchField,
    validateField,
    validateAllFields,
    resetFields,
    getFieldProps,
    isValid: Object.keys(errors).every(key => !errors[key]),
    hasErrors: Object.values(errors).some(error => error)
  };
};

/**
 * Hook for managing multi-step forms with offline support
 */
export const useMultiStepForm = (steps, options = {}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const { submitForm, ...formState } = useOfflineForm(options);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  }, [steps.length]);

  const updateStepData = useCallback((step, data) => {
    setStepData(prev => ({ ...prev, [step]: data }));
  }, []);

  const markStepComplete = useCallback((step) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  }, []);

  const markStepIncomplete = useCallback((step) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      newSet.delete(step);
      return newSet;
    });
  }, []);

  const submitMultiStepForm = useCallback(async () => {
    const allData = {
      steps: stepData,
      currentStep,
      completedSteps: Array.from(completedSteps),
      totalSteps: steps.length,
      timestamp: new Date().toISOString()
    };

    return submitForm(allData);
  }, [stepData, currentStep, completedSteps, steps.length, submitForm]);

  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setStepData({});
    setCompletedSteps(new Set());
    formState.resetForm();
  }, [formState]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const canGoNext = completedSteps.has(currentStep);
  const canSubmit = completedSteps.size === steps.length;

  return {
    // Step navigation
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    
    // Step data management
    stepData: stepData[currentStep] || {},
    allStepData: stepData,
    updateStepData: (data) => updateStepData(currentStep, data),
    
    // Step completion
    completedSteps,
    markStepComplete: () => markStepComplete(currentStep),
    markStepIncomplete: () => markStepIncomplete(currentStep),
    isStepComplete: (step) => completedSteps.has(step),
    
    // Form submission
    submitForm: submitMultiStepForm,
    resetForm,
    
    // State indicators
    progress,
    isFirstStep,
    isLastStep,
    canGoNext,
    canSubmit,
    
    // Form state from useOfflineForm
    ...formState
  };
};

export default useOfflineForm;