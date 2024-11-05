import { useState } from 'react';

const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validateField = (name, value, rules) => {
    let errorMessage = '';

    if (rules.required && !value) {
      errorMessage = `${name} is required`;
    } else if (rules.minLength && value.length < rules.minLength) {
      errorMessage = `${name} must be at least ${rules.minLength} characters`;
    } else if (rules.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      errorMessage = 'Invalid email address';
    } else if (rules.match && value !== rules.match) {
      errorMessage = `${name} must match the password`;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const clearError = (name) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  return {
    errors,
    validateField,
    clearError,
  };
};

export default useValidation;