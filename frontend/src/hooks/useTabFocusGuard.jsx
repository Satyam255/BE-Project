import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Detects tab/window visibility changes (tab switching, alt-tabbing).
 * Tracks switch count and fires a callback when the threshold is exceeded.
 *
 * @param {Object}   options
 * @param {boolean}  options.enabled        – Whether tracking is active
 * @param {number}   options.threshold      – Number of switches before onCheatDetected fires (default 2)
 * @param {Function} options.onCheatDetected – Called once when threshold is exceeded
 */
const useTabFocusGuard = ({
  enabled = true,
  threshold = 2,
  onCheatDetected,
} = {}) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [wasWarned, setWasWarned] = useState(false);
  const firedRef = useRef(false);
  const callbackRef = useRef(onCheatDetected);

  // Keep callback ref up to date without re-registering the listener
  useEffect(() => {
    callbackRef.current = onCheatDetected;
  }, [onCheatDetected]);

  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      // Only count when the page becomes hidden (user left the tab)
      if (document.visibilityState === "hidden") {
        setTabSwitchCount((prev) => {
          const next = prev + 1;

          if (next === 1) {
            setWasWarned(true);
          }

          if (next >= threshold && !firedRef.current) {
            firedRef.current = true;
            // Fire on next tick so state has settled
            setTimeout(() => callbackRef.current?.(), 0);
          }

          return next;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, threshold]);

  const resetGuard = useCallback(() => {
    setTabSwitchCount(0);
    setWasWarned(false);
    firedRef.current = false;
  }, []);

  return { tabSwitchCount, wasWarned, resetGuard };
};

export default useTabFocusGuard;
