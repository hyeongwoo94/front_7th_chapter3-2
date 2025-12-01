import { useState, useEffect } from 'react';
import { DEBOUNCE_DELAY } from '../constants';

// 디바운스 유틸리티 Hook
export const useDebounce = <T,>(value: T, delay: number = DEBOUNCE_DELAY): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

