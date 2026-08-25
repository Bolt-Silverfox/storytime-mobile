import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import RateUsModal from "../components/modals/RateUsModal";
import { RootNavigatorParamList } from "../Navigation/RootNavigator";
import useDismissAppRating from "../hooks/tanstack/mutationHooks/useDismissAppRating";
import useMarkAppRated from "../hooks/tanstack/mutationHooks/useMarkAppRated";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import { getFinishedStoryCount } from "../utils/rateUsStorage";
import { openStoreForRating } from "../utils/storeLinks";
import useAuth from "./AuthContext";

type RateUsContextType = {
  /**
   * Decides whether to show the rate-us prompt. When it shows, `onProceed` (if
   * given) is invoked after the modal closes. Returns true when the prompt was
   * shown (caller should NOT run its own navigation), false otherwise.
   */
  maybePromptRateUs: (onProceed?: () => void) => Promise<boolean>;
  /** Opens the store to rate and marks the user as rated. */
  rateNow: () => void;
};

const RateUsContext = createContext<RateUsContextType | undefined>(undefined);

const RateUsProvider = ({
  children,
  navigationRef,
}: {
  children: ReactNode;
  navigationRef: NavigationContainerRefWithCurrent<RootNavigatorParamList>;
}) => {
  const { user } = useAuth();
  const { data: profile } = useGetUserProfile();
  const markAppRated = useMarkAppRated();
  const dismissAppRating = useDismissAppRating();

  const [visible, setVisible] = useState(false);
  const pendingProceedRef = useRef<(() => void) | null>(null);
  const promptedThisSessionRef = useRef(false);
  // Reserved synchronously while an eligibility check is awaiting storage, so two
  // rapid calls can't both pass the guards and clobber pendingProceedRef.
  const checkInFlightRef = useRef(false);

  const runPending = useCallback(() => {
    const proceed = pendingProceedRef.current;
    pendingProceedRef.current = null;
    proceed?.();
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const rateNow = useCallback(() => {
    openStoreForRating();
    markAppRated.mutate(undefined, {
      onError: () => {
        // Persisting the rating failed — allow the prompt to reappear so the
        // decision can still be recorded rather than being silently lost.
        promptedThisSessionRef.current = false;
      },
    });
  }, [markAppRated]);

  const maybePromptRateUs = useCallback(
    async (onProceed?: () => void): Promise<boolean> => {
      // Never prompt guests/unauthed users or anyone already resolved.
      if (
        !profile ||
        profile.hasRatedApp ||
        profile.rateAppDismissedAt ||
        promptedThisSessionRef.current ||
        checkInFlightRef.current
      ) {
        return false;
      }

      // Reserve the check synchronously (before the awaited storage read) so a
      // concurrent call falls through to its own navigation instead of racing.
      checkInFlightRef.current = true;
      try {
        const finishedStoryCount = await getFinishedStoryCount(user?.id);
        if (finishedStoryCount < 1) {
          return false;
        }
        pendingProceedRef.current = onProceed ?? null;
        promptedThisSessionRef.current = true;
        setVisible(true);
        return true;
      } finally {
        checkInFlightRef.current = false;
      }
    },
    [profile, user?.id]
  );

  return (
    <RateUsContext.Provider value={{ maybePromptRateUs, rateNow }}>
      {children}
      <RateUsModal
        visible={visible}
        onRate={() => {
          rateNow();
          close();
          runPending();
        }}
        onSendFeedback={() => {
          dismissAppRating.mutate(undefined, {
            onError: () => {
              promptedThisSessionRef.current = false;
            },
          });
          // The user is heading to the feedback form, so drop any queued
          // post-prompt navigation (e.g. opening the next story) that would
          // otherwise override it.
          pendingProceedRef.current = null;
          close();
          if (navigationRef.isReady()) {
            // The root "protected" route is typed with undefined params, so the
            // deeply-nested navigate target isn't expressible through its types;
            // cast the method to a permissive signature for this one call.
            (
              navigationRef.navigate as (
                name: string,
                params?: Record<string, unknown>,
              ) => void
            )("protected", {
              screen: "parents",
              params: {
                screen: "profile",
                params: {
                  screen: "helpAndSupport",
                  params: { screen: "suggestions" },
                },
              },
            });
          }
        }}
        onDismiss={() => {
          dismissAppRating.mutate(undefined, {
            onError: () => {
              // Dismissal didn't persist — let the prompt reappear so it isn't
              // silently treated as dismissed without the Profile card showing.
              promptedThisSessionRef.current = false;
            },
          });
          close();
          runPending();
        }}
      />
    </RateUsContext.Provider>
  );
};

const useRateUs = () => {
  const context = useContext(RateUsContext);
  if (!context) {
    throw new Error("RateUs context was used outside its scope");
  }
  return context;
};

export { RateUsProvider };
export default useRateUs;
