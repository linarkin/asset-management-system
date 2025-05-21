import { useState, useEffect, useRef, useCallback } from "react";
import isEqual from "lodash/isEqual";

interface LocalStorageOptions {
  debug?: boolean;
  deepCompare?: boolean;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
}

/**
 * Custom hook for persisting state in localStorage
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: LocalStorageOptions = {}
): [T, (value: T | ((val: T) => T)) => void] {
  const {
    debug = false,
    deepCompare = false,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const previousValueRef = useRef<T | null>(null);
  const isUpdatingRef = useRef(false);

  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        try {
          const parsedValue = deserialize(item);
          if (debug)
            console.log(
              `[localStorage] Loaded from key "${key}":`,
              parsedValue
            );
          return parsedValue;
        } catch (error) {
          console.warn(
            `[localStorage] Failed to parse value for key "${key}":`,
            error
          );
          return initialValue;
        }
      }
      return initialValue;
    } catch (error) {
      console.warn(`[localStorage] Error reading key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserialize, debug]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const persistValue = useCallback(
    (valueToStore: T) => {
      if (typeof window === "undefined" || isUpdatingRef.current) return;

      try {
        if (deepCompare && isEqual(previousValueRef.current, valueToStore)) {
          if (debug)
            console.log(
              `[localStorage] Skipping update for "${key}" (values equal)`
            );
          return;
        }

        previousValueRef.current = valueToStore as T;

        const serialized = serialize(valueToStore);
        window.localStorage.setItem(key, serialized);

        if (debug)
          console.log(`[localStorage] Saved to key "${key}":`, valueToStore);
      } catch (error) {
        console.warn(`[localStorage] Error saving to key "${key}":`, error);
      }
    },
    [key, serialize, deepCompare, debug]
  );

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        persistValue(valueToStore);
      } catch (error) {
        console.warn(
          `[localStorage] Error in setValue for key "${key}":`,
          error
        );
      }
    },
    [key, storedValue, persistValue]
  );

  // Update if the stored value changes in another tab/window
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          // Set flag to prevent infinite loops
          isUpdatingRef.current = true;

          const newValue = deserialize(e.newValue);
          if (debug)
            console.log(
              `[localStorage] Updated from another tab for key "${key}":`,
              newValue
            );
          setStoredValue(newValue);

          // Reset flag after a delay to ensure state update completes
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 0);
        } catch (error) {
          console.warn(
            `[localStorage] Error parsing change from another tab for key "${key}":`,
            error
          );
        }
      } else if (e.key === key && e.newValue === null) {
        // The key was removed
        setStoredValue(initialValue);
        if (debug)
          console.log(
            `[localStorage] Key "${key}" was removed in another tab, reset to initial value`
          );
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue, deserialize, debug]);

  return [storedValue, setValue];
}

export default useLocalStorage;
