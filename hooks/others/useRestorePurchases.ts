import { useIAP } from "expo-iap";
import { useState } from "react";
import { Platform } from "react-native";
import apiFetch from "../../apiFetch";
import { BASE_URL, BUNDLE_IDENTIFIER, QUERY_KEYS } from "../../constants";
import { QueryResponse } from "../../types";
import { getErrorMessage } from "../../utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../contexts/AuthContext";
import { iapLogger } from "../../utils/logger";

const useRestorePurchases = (onRestored?: () => void) => {
  const [isRestoring, setIsRestoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [restoredCount, setRestoredCount] = useState(0);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { restorePurchases } = useIAP();

  const handleRestore = async () => {
    setIsRestoring(true);
    setError(null);
    setRestoredCount(0);

    try {
      // restorePurchases updates availablePurchases state internally,
      // but we need the raw return from getAvailablePurchases.
      // Use the top-level API instead.
      const { getAvailablePurchases } = await import("expo-iap");
      const purchases = await getAvailablePurchases({
        alsoPublishToEventListenerIOS: false,
        onlyIncludeActiveItemsIOS: true,
      });

      if (!purchases || purchases.length === 0) {
        setError("No active purchases found on this account.");
        return;
      }

      let verified = 0;
      for (const purchase of purchases) {
        const token =
          purchase.store === "apple"
            ? purchase.transactionId
            : purchase.purchaseToken;

        if (!token || !purchase.productId) continue;

        try {
          const request = await apiFetch(
            `${BASE_URL}/payment/verify-purchase`,
            {
              method: "POST",
              body: JSON.stringify({
                platform: purchase.store ?? Platform.OS,
                productId: purchase.productId,
                purchaseToken: token,
                packageName: BUNDLE_IDENTIFIER,
              }),
            },
          );
          const response: QueryResponse = await request.json();
          if (response.success) verified++;
        } catch (err) {
          iapLogger.error(
            `Failed to verify restored purchase ${purchase.productId}`,
            err,
          );
        }
      }

      setRestoredCount(verified);

      if (verified > 0) {
        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_USER_PROFILE, user?.id],
        });
        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_SUBSCRIPTION_STATUS, user?.id],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_STORY_QUOTA],
        });
        onRestored?.();
      } else {
        setError("Purchases found but verification failed. Please try again.");
      }
    } catch (err) {
      iapLogger.error("Restore purchases failed", err);
      setError(getErrorMessage(err));
    } finally {
      setIsRestoring(false);
    }
  };

  return { handleRestore, isRestoring, error, restoredCount };
};

export default useRestorePurchases;
