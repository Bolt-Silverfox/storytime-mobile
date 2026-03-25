import { ErrorCode, useIAP } from "expo-iap";
import { useEffect, useState } from "react";
import { SUBSCRIPTION_IDS } from "../../constants";
import { SubscriptionPlan } from "../../types";
import { getErrorMessage } from "../../utils/utils";
import { iapLogger } from "../../utils/logger";

/**
 * IAP hook for unauthenticated users.
 * Handles purchase + finishTransaction without backend verification.
 * Backend verification is deferred to useSubscriptionSync on login/signup.
 */
const useUnauthSubscribeIAP = (
  selectedPlan: SubscriptionPlan,
  onPurchaseComplete?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUserCancelled, setIsUserCancelled] = useState(false);

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      try {
        await finishTransaction({ purchase });
        onPurchaseComplete?.();
      } catch (err) {
        iapLogger.error("Failed to finish transaction", err);
        setErrorMessage(getErrorMessage(err));
      }
    },
    onPurchaseError: (error) => {
      if (error.code === ErrorCode.UserCancelled) {
        setIsUserCancelled(true);
        setErrorMessage("No worries! You can subscribe anytime.");
      } else {
        setIsUserCancelled(false);
        iapLogger.error("Subscription failed", error);
        setErrorMessage(error.message ?? "Unexpected error, try again");
      }
    },
  });

  useEffect(() => {
    if (!connected) {
      setIsLoading(true);

      const timeout = setTimeout(() => {
        setIsLoading(false);
        setErrorMessage("Could not connect to the store. Please try again.");
      }, 10_000);

      return () => clearTimeout(timeout);
    }

    const loadSubscriptions = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        await fetchProducts({ skus: [...SUBSCRIPTION_IDS], type: "subs" });
      } catch (err) {
        iapLogger.error("Failed to fetch products", err);
        setErrorMessage(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    (async () => {
      await loadSubscriptions();
    })();
  }, [connected, fetchProducts]);

  const getPlanName = (id: string): "Monthly" | "Yearly" => {
    return id === "1_month_subscription" ? "Monthly" : "Yearly";
  };

  const handlePurchase = async () => {
    try {
      setErrorMessage("");
      setIsUserCancelled(false);
      if (!selectedPlan) throw new Error("Select a valid plan");
      const sub = subscriptions.find((s) => {
        const id = s.id;
        return id ? getPlanName(id) === selectedPlan : false;
      });
      if (!sub) throw new Error("Subscription not found, retry.");
      const productId = sub.id;
      if (!productId) throw new Error("Product not found");
      await requestPurchase({
        request: {
          apple: { sku: productId },
          google: { skus: [productId] },
        },
        type: "subs",
      });
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return {
    isLoading,
    errorMessage,
    isUserCancelled,
    subscriptions,
    handlePurchase,
    getPlanName,
  };
};

export default useUnauthSubscribeIAP;
