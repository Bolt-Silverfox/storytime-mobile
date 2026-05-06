import { useCallback, useRef, useState } from "react";

/**
 * Hook that manages parental gate state.
 * Call `guard(callback)` to show the gate — `callback` runs only after the parent solves the challenge.
 */
export default function useParentalGate() {
  const [visible, setVisible] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const guard = useCallback((action: () => void) => {
    pendingAction.current = action;
    setVisible(true);
  }, []);

  const onPass = useCallback(() => {
    setVisible(false);
    pendingAction.current?.();
    pendingAction.current = null;
  }, []);

  const onCancel = useCallback(() => {
    setVisible(false);
    pendingAction.current = null;
  }, []);

  return { visible, guard, onPass, onCancel };
}
