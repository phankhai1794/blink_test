import React, { useEffect, useState } from 'react';

const useLocalStorage = (key, inputValue) => {
  const [value, setValue] = useState(inputValue || null);

  const saveValue = (newValue) => {
    localStorage.setItem(key, JSON.stringify(value));
    setValue(newValue);
  };

  const getCurrentValue = () => {
    const existValue = localStorage.getItem(key);
    if (existValue) {
      return JSON.parse(existValue);
    }

    return null;
  };

  useEffect(() => {
    // Check local
    let currentValue = getCurrentValue();
    if (currentValue) {
      setValue(currentValue);
    }
  }, []);

  return { value, saveValue };
};

export default useLocalStorage;
