import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../contexts/AuthContext";
import apiFetch from "../../apiFetch";
import { BASE_URL, BUNDLE_IDENTIFIER, QUERY_KEYS } from "../../constants";

const useSubscriptionSync = () => {
  const hasRun = useRef(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id || hasRun.current) return;
    hasRun.current = true;

    const syncPurchases = async () => {
      try {
        // 1. Check backend status first
        const statusRes = await apiFetch(`${BASE_URL}/payment/status`, {
          method: "GET",
        });
        const status = await statusRes.json();
        if (status.data?.isActive) return; // Backend already active, nothing to do

        // 2. Check store purchases (dynamic import like useRestorePurchases does)
        const { getAvailablePurchases } = await import("expo-iap");
        const purchases = await getAvailablePurchases({
          alsoPublishToEventListenerIOS: false,
          onlyIncludeActiveItemsIOS: true,
        });
        if (!purchases?.length) return;

        // 3. Verify each against backend
        let synced = false;
        for (const purchase of purchases) {
          const token =
            purchase.store === "apple"
              ? purchase.transactionId
              : purchase.purchaseToken;
          if (!token || !purchase.productId) continue;

          const res = await apiFetch(`${BASE_URL}/payment/verify-purchase`, {
            method: "POST",
            body: JSON.stringify({
              platform: purchase.store ?? Platform.OS,
              productId: purchase.productId,
              purchaseToken: token,
              packageName: BUNDLE_IDENTIFIER,
            }),
          });
          const data = await res.json();
          if (data.success) {
            synced = true;
            break;
          }
        }

        // 4. Refresh cached subscription status
        if (synced) {
          await Promise.all([
            queryClient.refetchQueries({
              queryKey: [QUERY_KEYS.GET_USER_PROFILE, user?.id],
            }),
            queryClient.refetchQueries({
              queryKey: [QUERY_KEYS.GET_SUBSCRIPTION_STATUS, user?.id],
            }),
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.GET_STORY_QUOTA],
            }),
          ]);
        }
      } catch {
        // Silent — auto-sync is best-effort
      }
    };

    syncPurchases();
  }, [user?.id, queryClient]);
};

export default useSubscriptionSync;
