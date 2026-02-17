import { queryOptions, useQuery } from "@tanstack/react-query";
import useAuth from "../../../contexts/AuthContext";
import apiFetch from "../../../apiFetch";
import type { NotificationsResponse } from "../../../types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type GetNotificationsParams = {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
};

const fetchNotifications = async (
  params: GetNotificationsParams = {}
): Promise<NotificationsResponse> => {
  const { limit = 20, offset = 0, unreadOnly = false } = params;

  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    ...(unreadOnly && { unreadOnly: "true" }),
  });

  const response = await apiFetch(
    `${BASE_URL}/notifications?${queryParams.toString()}`
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data.data;
};

export const useGetNotificationsQuery = (
  params: GetNotificationsParams = {}
) => {
  const { user } = useAuth();

  return queryOptions({
    queryKey: ["notifications", user?.id, params],
    queryFn: () => fetchNotifications(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    enabled: !!user,
  });
};

// Hook for fetching notifications
export const useGetNotifications = (params: GetNotificationsParams = {}) => {
  const queryOpts = useGetNotificationsQuery(params);
  return useQuery(queryOpts);
};

// Hook for fetching unread notifications count
export const useGetUnreadNotificationsCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notifications", "unread-count", user?.id],
    queryFn: async () => {
      const data = await fetchNotifications({ limit: 1, unreadOnly: true });
      return data.total;
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!user,
  });
};

export default useGetNotificationsQuery;
