import { ErrorCode, useIAP } from "expo-iap";
import { useEffect, useState } from "react";
import apiFetch from "../../apiFetch";
import {
  BASE_URL,
  BUNDLE_IDENTIFIER,
  QUERY_KEYS,
  SUBSCRIPTION_IDS,
} from "../../constants";
import { QueryResponse, SubscriptionPlan } from "../../types";
import { getErrorMessage } from "../../utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../../contexts/AuthContext";

const useSubscribeIAP = (
  selectedPlan: SubscriptionPlan,
  onSubscribed?: () => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUserCancelled, setIsUserCancelled] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      const { store, productId, purchaseToken, transactionId } = purchase;
      const token = store === "apple" ? transactionId : purchaseToken;
      if (!token) {
        setErrorMessage("Purchase token missing. Please try again.");
        return;
      }
      try {
        await verifyPurchase({
          platform: store,
          productId: productId,
          purchaseToken: token,
          packageName: BUNDLE_IDENTIFIER,
        });

        await finishTransaction({ purchase });
        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_USER_PROFILE, user?.id],
        });
        queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.GET_SUBSCRIPTION_STATUS, user?.id],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_STORY_QUOTA],
        });
        onSubscribed?.();
      } catch (err) {
        if (__DEV__)
          console.error("Verification failed, NOT finishing transaction", err);
        setErrorMessage(getErrorMessage(err));
      }
    },
    onPurchaseError: (error) => {
      if (error.code === ErrorCode.UserCancelled) {
        setIsUserCancelled(true);
        setErrorMessage("No worries! You can subscribe anytime.");
      } else {
        setIsUserCancelled(false);
        if (__DEV__) console.error("Subscription failed", error);
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
        await fetchProducts({ skus: [...SUBSCRIPTION_IDS], type: "subs" });
      } catch (err) {
        if (__DEV__)
          console.error("Failed to fetch products from google play store");
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

  const verifyPurchase = async (params: {
    platform: string;
    productId: string;
    purchaseToken: string;
    packageName: string;
  }) => {
    try {
      const request = await apiFetch(`${BASE_URL}/payment/verify-purchase`, {
        body: JSON.stringify(params),
        method: "POST",
      });
      const response: QueryResponse = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    } catch (err) {
      if (__DEV__) console.error("purchase verification failed", err);
      throw new Error(getErrorMessage(err));
    }
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

export default useSubscribeIAP;
