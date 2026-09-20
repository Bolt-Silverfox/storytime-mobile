import { useEffect, useState } from "react";
import { InteractionManager } from "react-native";

/**
 * Upper bound on how long we wait for the transition signal. This is a safety
 * net, not the mechanism: `runAfterInteractions` never fires if an interaction
 * handle is leaked, and a modal that never opens is worse than one that opens
 * a beat late.
 */
const MAX_WAIT_MS = 600;

type TransitionEmitter = {
  addListener: (type: "transitionEnd", callback: () => void) => () => void;
};

/**
 * Gates a React Native `<Modal>`'s `visible` prop until the screen underneath
 * has finished transitioning.
 *
 * Presenting a Modal mid-transition produces a native window that renders
 * nothing but still swallows every touch, so the screen beneath looks normal
 * and is completely unresponsive, with no way to recover. Three separate
 * modals in this app hit that (quota reminder, voice setup, rate-us prompt),
 * each surfacing as "the reader isn't clickable".
 *
 * Pass `navigation` when the modal lives inside a screen: its `transitionEnd`
 * event is the precise signal. Otherwise the hook falls back to
 * `InteractionManager`, which settles once the running animation completes.
 *
 * @param visible whether the caller wants the modal shown
 * @param navigation optional React Navigation object for the hosting screen
 * @returns whether it is safe to hand `visible` to the native Modal
 */
const useModalPresentationGate = (
  visible: boolean,
  navigation?: TransitionEmitter
): boolean => {
  const [canPresent, setCanPresent] = useState(false);

  useEffect(() => {
    if (!visible) {
      setCanPresent(false);
      return;
    }

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      setCanPresent(true);
    };

    const unsubscribe = navigation?.addListener("transitionEnd", settle);
    const task = InteractionManager.runAfterInteractions(settle);
    const fallback = setTimeout(settle, MAX_WAIT_MS);

    return () => {
      settled = true;
      unsubscribe?.();
      task.cancel();
      clearTimeout(fallback);
    };
  }, [visible, navigation]);

  return canPresent;
};

export default useModalPresentationGate;
