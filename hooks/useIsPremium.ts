import useGetUserProfile from "./tanstack/queryHooks/useGetUserProfile";

/**
 * Centralised premium check.
 * A user is "premium" when they have an active subscription OR are an admin.
 */
const useIsPremium = () => {
  const { data: user, isLoading, isError } = useGetUserProfile();
  const isPremium =
    user?.subscriptionStatus === "active" || user?.role === "admin";
  return { isPremium, isLoading, isError };
};

export default useIsPremium;
