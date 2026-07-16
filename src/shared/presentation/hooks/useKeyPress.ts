import { useEffect, useCallback } from 'react';

function useKeyPress(targetKey: string, callback: any, options = {}) {
  const { preventDefault = true, enabled = true } = options as any;

  const handleKeyDown = useCallback(
    (event: any) => {
      if (!enabled) return;

      if (event.key === targetKey) {
        if (preventDefault) event.preventDefault();
        callback(event);
      }
    },
    [targetKey, callback, preventDefault, enabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export default useKeyPress;