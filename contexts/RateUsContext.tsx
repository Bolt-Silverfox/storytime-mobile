import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import RateUsModal from "../components/modals/RateUsModal";
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

const RateUsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { data: profile } = useGetUserProfile();
  const markAppRated = useMarkAppRated();
  const dismissAppRating = useDismissAppRating();

  const [visible, setVisible] = useState(false);
  const pendingProceedRef = useRef<(() => void) | null>(null);
  const promptedThisSessionRef = useRef(false);

  const runPending = useCallback(() => {
    const proceed = pendingProceedRef.current;
    pendingProceedRef.current = null;
    proceed?.();
  }, []);

  const close = useCallback(() => setVisible(false), []);

  const rateNow = useCallback(() => {
    openStoreForRating();
    markAppRated.mutate();
  }, [markAppRated]);

  const maybePromptRateUs = useCallback(
    async (onProceed?: () => void): Promise<boolean> => {
      // Never prompt guests/unauthed users or anyone already resolved.
      if (
        !profile ||
        profile.hasRatedApp ||
        profile.rateAppDismissedAt ||
        promptedThisSessionRef.current
      ) {
        return false;
      }

      const finishedStoryCount = await getFinishedStoryCount(user?.id);
      if (finishedStoryCount < 1) {
        return false;
      }

      pendingProceedRef.current = onProceed ?? null;
      promptedThisSessionRef.current = true;
      setVisible(true);
      return true;
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
        onDismiss={() => {
          dismissAppRating.mutate();
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
