import { ActivityIndicator, View } from "react-native";
import useGetUserProfile from "../../hooks/tanstack/queryHooks/useGetUserProfile";
import AddChildBanner from "./AddChildBanner";
import CompleteProfileBanner from "./CompleteProfileBannder";

const IncompleteProfileBanner = () => {
  const { data, isPending } = useGetUserProfile();

  if (isPending) return <ActivityIndicator size={"large"} />;
  const isUserProfileSetupComplete = data?.profile.language && data?.pinSet;

  if (data?.numberOfKids && isUserProfileSetupComplete) return null;

  return (
    <View className="flex-1 flex flex-col gap-y-4 mb-8 mt-4">
      {!data?.numberOfKids && <AddChildBanner />}
      {!isUserProfileSetupComplete && <CompleteProfileBanner />}
    </View>
  );
};

export default IncompleteProfileBanner;
