import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiFetch from "../../../apiFetch";
import { BASE_URL, QUERY_KEYS } from "../../../constants";

export type CouponValidateResult = {
  valid: boolean;
  freeDays?: number;
  message: string;
};

export type CouponRedeemResult = {
  success: boolean;
  premiumAccessUntil: string;
  freeDays: number;
  message: string;
};

const extractMessage = (message: unknown, fallback: string): string => {
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message) return message;
  return fallback;
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: async (code: string): Promise<CouponValidateResult> => {
      const response = await apiFetch(`${BASE_URL}/coupons/validate`, {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(extractMessage(data.message, "Failed to validate coupon"));
      }
      return data.data ?? data;
    },
  });
};

export const useRedeemCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string): Promise<CouponRedeemResult> => {
      const response = await apiFetch(`${BASE_URL}/coupons/redeem`, {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(extractMessage(data.message, "Failed to redeem coupon"));
      }
      return data.data ?? data;
    },
    onSuccess: () => {
      // Refresh user profile so premium status is up to date
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_USER_PROFILE] });
    },
  });
};
