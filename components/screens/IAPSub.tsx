import { StyleSheet, View, Text, Pressable } from "react-native";
import { useIAP, ErrorCode } from "expo-iap";
import { useEffect } from "react";
import { string } from "zod";
import { BASE_URL } from "../../constants";
import apiFetch from "../../apiFetch";
import { QueryResponse } from "../../types";
import { getErrorMessage } from "../../utils/utils";

const SUBSCRIPTION_IDS = [
  "str_time_premium_monthly",
  "str_time_premium_yearly",
];

const IAPSub = () => {
  const {
    connected,
    products,
    fetchProducts,
    requestPurchase,
    finishTransaction,
  } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      const { store, productId, purchaseToken, transactionId } = purchase;
      try {
        await verifyPurchase({
          platform: store,
          productId: productId,
          purchaseToken: store === "apple" ? transactionId : purchaseToken,
          packageName: "com.storytime.app",
        });

        await finishTransaction({ purchase });
      } catch (err) {
        console.error("Verification failed, NOT finishing transaction", err);
      }
    },
    onPurchaseError: (error) => {
      if (error.code !== ErrorCode.UserCancelled) {
        console.error("Subscription failed", error);
      }
    },
  });

  useEffect(() => {
    if (connected) {
      fetchProducts({ skus: SUBSCRIPTION_IDS, type: "subs" });
    }
  }, [connected]);

  const handlePurchase = async (productId: string) => {
    await requestPurchase({
      request: {
        apple: { sku: productId },
        google: { skus: [productId] },
      },
      type: "subs",
    });
  };

  return (
    <View style={styles.screen}>
      {products.map((product) => (
        <Pressable onPress={() => handlePurchase(product.id)} key={product.id}>
          <Text>{product.title}</Text>
          <Text>{product.price}</Text>
          <Text>{product.description}</Text>
        </Pressable>
      ))}
    </View>
  );
};

export default IAPSub;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});

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
    console.error("verification failed", err);
    throw new Error(getErrorMessage(err));
  }
};
