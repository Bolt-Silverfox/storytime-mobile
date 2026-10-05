import { useEffect, useState } from "react";
import { InteractionManager } from "react-native";

/**
 * Upper bound on how long we wait for the transition signal. This is a safety
 * net, not the mechanism: `runAfterInteractions` never fires if an interaction
 * handle is leaked, and a modal that never opens is worse than one that opens
 * a beat late.
 */
const MAX_WAIT_MS = 600;

/**
 * Absolute ceiling, applied both to an individual gate and to a screen that
 * still claims to be transitioning. Some interrupted transitions genuinely
 * never report an end (see `useScreenTransitionTracking`), and a modal that
 * never opens is worse than one that opens a beat late.
 */
const HARD_CAP_MS = 3000;

type TransitionEvent = "transitionStart" | "transitionEnd" | "gestureCancel";

type TransitionEmitter = {
  addListener: (type: TransitionEvent, callback: () => void) => () => void;
};

/**
 * Which screens are currently transitioning, one entry per tracking screen.
 *
 * This is module state rather than hook state because of WHEN the gated modals
 * mount. The quota reminder is rendered only after an AsyncStorage read
 * resolves; the rate-us prompt after a counter check. By then the transition
 * that makes presentation unsafe may already have started, so a
 * `transitionStart` listener registered by the modal itself registers too late
 * and sees nothing — the gate concludes "idle", the 600 ms fallback fires, and
 * the modal is presented in exactly the window it exists to avoid.
 *
 * `useScreenTransitionTracking` is called from the hosting SCREEN, which mounts
 * before the push animation begins, so the state is already correct by the
 * time a late-mounting modal asks.
 *
 * Per screen rather than one shared flag: native-stack emits these events with
 * `target: route.key` and `@react-navigation/core`'s emitter delivers a
 * targeted event only to listeners registered on that route, so each screen
 * sees its own transition only. With one shared flag, the screen leaving would
 * clear the flag the screen arriving still needs.
 *
 * A boolean per screen rather than a count, because starts and ends are not
 * reliably paired. A route whose animation is interrupted can report two
 * starts and one end, or two starts and none at all — on Android,
 * `ScreenFragment.canDispatchLifecycleEvent` enforces strict alternation, so a
 * `DID_*` event that arrives out of order is dropped rather than queued. A
 * counter would be left stuck above zero; a boolean is cleared by whichever
 * end does arrive.
 */
type Tracker = {
  transitioning: boolean;
  staleTimer?: ReturnType<typeof setTimeout>;
};

const trackers = new Set<Tracker>();
const transitionEndSubscribers = new Set<() => void>();

const isTransitioning = (): boolean => {
  for (const tracker of trackers) {
    if (tracker.transitioning) return true;
  }
  return false;
};

const notifyIfSettled = () => {
  if (isTransitioning()) return;
  // Iterate a copy: settling a gate triggers a render that can add or remove
  // subscribers while we are still notifying.
  for (const notify of [...transitionEndSubscribers]) notify();
};

const clearStaleTimer = (tracker: Tracker) => {
  if (tracker.staleTimer) {
    clearTimeout(tracker.staleTimer);
    tracker.staleTimer = undefined;
  }
};

const endTransition = (tracker: Tracker) => {
  tracker.transitioning = false;
  clearStaleTimer(tracker);
  notifyIfSettled();
};

/**
 * Feeds screen-transition state to {@link useModalPresentationGate}.
 *
 * Call this in a screen that hosts a gated modal, passing the screen's own
 * `navigation` object. It has to be the screen rather than the modal: the
 * whole point is to be listening BEFORE the modal mounts. A modal whose screen
 * does not track gets the `InteractionManager`/timeout fallback instead.
 *
 * @param navigation React Navigation object for the hosting screen
 */
export const useScreenTransitionTracking = (
  navigation?: TransitionEmitter
): void => {
  useEffect(() => {
    if (!navigation) return;

    const tracker: Tracker = { transitioning: false };
    trackers.add(tracker);

    const offStart = navigation.addListener("transitionStart", () => {
      tracker.transitioning = true;
      clearStaleTimer(tracker);
      // Fail open, per screen. Not every interrupted transition reports an
      // end: on a cancelled iOS swipe-back, react-native-screens suppresses
      // `notifyAppear` on the screen being dismissed in favour of
      // `notifyGestureCancel`, but `viewDidDisappear` on the screen being
      // revealed suppresses `notifyDisappear` and emits nothing at all
      // (`ios/RNSScreen.mm`, the `_isSwiping`/`_shouldNotify` guards). That
      // screen would otherwise claim to be transitioning forever.
      tracker.staleTimer = setTimeout(() => {
        tracker.staleTimer = undefined;
        tracker.transitioning = false;
        notifyIfSettled();
      }, HARD_CAP_MS);
    });

    const offEnd = navigation.addListener("transitionEnd", () => {
      endTransition(tracker);
    });

    // The recoverable half of the above: the dismissed screen does get
    // `gestureCancel` (native-stack re-emits react-native-screens'
    // `onGestureCancel`, which fires from `viewDidAppear` — after the
    // snap-back, so clearing here is not premature), and it settles
    // immediately rather than waiting out the stale timer. iOS only:
    // react-native-screens has no Android equivalent, and does not need one
    // for a back gesture — the classic Android stack has no interactive or
    // predictive back plumbing (its only `OnBackPressedCallback` serves the
    // header search view), so an Android back is a discrete `GO_BACK` rather
    // than a gesture that can be abandoned part-way. An interrupted push there
    // can still leave a start unpaired, which is what the stale timer is for.
    const offCancel = navigation.addListener("gestureCancel", () => {
      endTransition(tracker);
    });

    return () => {
      offStart();
      offEnd();
      offCancel();
      clearStaleTimer(tracker);
      // Dropping the tracker stops this screen gating anything, so a screen
      // torn down mid-transition (a modal calling `navigation.reset()`, say)
      // cannot leave later modals waiting. Deliberately no `notifyIfSettled()`
      // here: an unmount is not evidence the animation finished, and gates
      // already waiting have their own fallbacks. Erring towards a late modal
      // over an early one is the whole point of this hook.
      trackers.delete(tracker);
    };
  }, [navigation]);
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
 * Transition state comes from `useScreenTransitionTracking`, installed by the
 * hosting screen. Passing `navigation` here as well costs nothing, but it is
 * NOT a substitute: a modal that mounts late subscribes after
 * `transitionStart` has already fired and so contributes nothing. Where no
 * screen is tracking, the gate falls back to `InteractionManager` and a
 * timeout, which is a guess rather than a signal.
 *
 * Note that the state is shared app-wide: a modal with no `navigation` of its
 * own (CustomModal, the rate-us prompt) is gated by whichever screen is
 * tracking, which is deliberate — "is a transition running" is a property of
 * the native stack, not of a component.
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

  useScreenTransitionTracking(navigation);

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

    // The fallbacks are a safety net for the no-tracking case, not a second
    // opinion on the transition. `InteractionManager` is global and
    // MAX_WAIT_MS is a guess, so either can fire while the native stack is
    // still animating — presenting the modal in exactly the window this hook
    // exists to avoid. While a transition is known to be running, only its end
    // (or the hard cap) settles.
    const settleIfIdle = () => {
      if (!isTransitioning()) settle();
    };

    transitionEndSubscribers.add(settle);
    const task = InteractionManager.runAfterInteractions(settleIfIdle);
    const fallback = setTimeout(settleIfIdle, MAX_WAIT_MS);
    const hardCap = setTimeout(settle, HARD_CAP_MS);

    return () => {
      settled = true;
      transitionEndSubscribers.delete(settle);
      task.cancel();
      clearTimeout(fallback);
      clearTimeout(hardCap);
    };
  }, [visible]);

  return canPresent;
};

export default useModalPresentationGate;
