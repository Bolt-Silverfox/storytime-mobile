import { ErrorCode, useIAP } from "expo-iap";
import { useEffect, useState } from "react";
import apiFetch from "../../apiFetch";
import { BASE_URL, SUBSCRIPTION_IDS } from "../../constants";
import { QueryResponse, SubscriptionPlan } from "../../types";
import { getErrorMessage } from "../../utils/utils";

const useSubscribeIAP = (selectedPlan: SubscriptionPlan) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    connected,
    subscriptions,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      const { store, productId, purchaseToken, transactionId } = purchase;
      try {
        setErrorMessage("");
        await verifyPurchase({
          platform: store,
          productId: productId,
          purchaseToken: store === "apple" ? transactionId : purchaseToken,
          packageName: "net.emerj.storytime",
        });

        await finishTransaction({ purchase });
      } catch (err) {
        console.error("Verification failed, NOT finishing transaction", err);
        setErrorMessage(getErrorMessage(err));
      }
    },
    onPurchaseError: (error) => {
      if (error.code !== ErrorCode.UserCancelled) {
        console.error("Subscription failed", error);
        setErrorMessage(error.message ?? "Unexpected error, try again");
      }
    },
  });

  useEffect(() => {
    if (connected) {
      setIsLoading(false);
      fetchProducts({ skus: SUBSCRIPTION_IDS, type: "subs" });
    } else {
      setIsLoading(true);
    }
  }, [connected, fetchProducts]);

  const getPlanName = (id: string): "Monthly" | "Yearly" => {
    return id === "1_month_subscription" ? "Monthly" : "Yearly";
  };

  const verifyPurchase = async (params: {
    platform: string;
    productId: string;
    purchaseToken: string | null | undefined;
    packageName: string;
  }) => {
    try {
      const request = await apiFetch(`${BASE_URL}/payment/verify-purchase`, {
        body: JSON.stringify(params),
      });
      const response: QueryResponse = await request.json();
      if (!response.success) throw new Error(response.message);
      return response;
    } catch (err) {
      console.error("purchase verification failed", err);
      throw new Error(getErrorMessage(err));
    }
  };

  const handlePurchase = async () => {
    if (!selectedPlan) return;

    const sub = subscriptions.find((s) => {
      const id = s.id;
      return id ? getPlanName(id) === selectedPlan : false;
    });
    if (!sub) return;

    const productId = sub.id;
    if (!productId) {
      setErrorMessage("Product not found");
      return;
    }

    await requestPurchase({
      request: {
        apple: { sku: productId },
        google: { skus: [productId] },
      },
      type: "subs",
    });
  };

  return {
    isLoading,
    errorMessage,
    subscriptions,
    handlePurchase,
    getPlanName,
  };
};

export default useSubscribeIAP;
