import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Icon from "../Icon";
import SubscriptionModal from "../modals/SubscriptionModal";
import { useQuery } from "@tanstack/react-query";
import queryStoriesQuota from "../../hooks/tanstack/queryHooks/queryStoriesQuota";
import useAuth from "../../contexts/AuthContext";
import ErrorComponent from "../ErrorComponent";

const FremiumBanner = ({ closeBanner }: { closeBanner: () => void }) => {
  const { user } = useAuth();
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const { data, isPending, error, refetch } = useQuery(
    queryStoriesQuota(user?.id)
  );

  if (isPending) return <ActivityIndicator size={"large"} />;
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;

  return (
    <View className="flex flex-row items-center gap-x-5 bg-blue p-4">
      <View className="flex flex-1 flex-col gap-y-1.5">
        {data.remaining < 1 ? (
          <>
            <Text className="font-[abeezee] text-xs text-[#D3C9FA]">
              {data.totalAllowed} free stories completed, upgrade to unlock
              unlimited stories, audio narration and a growing library your
              child will love.
            </Text>
            <Pressable onPress={() => setIsSubscriptionModalOpen(true)}>
              <Text className="font-[quilka] text-xs text-white underline">
                Upgrade to Premium
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text className="font-[abeezee] text-xs text-[#D3C9FA]">
              Get started with 10 free stories, and continue enjoying 1 free
              story every week with our Freemium plan.
            </Text>
            <Text className="font-[quilka] text-xs text-white">
              {data.used}/{data.totalAllowed} stories read
            </Text>
          </>
        )}
      </View>
      <Pressable
        onPress={closeBanner}
        className="flex size-11 flex-col items-center justify-center rounded-full bg-[#E2D6FE]"
      >
        <View className="flex size-6 flex-col items-center justify-center rounded-md border-2 border-black">
          <Icon name="X" size={14} />
        </View>
      </Pressable>
      {isSubscriptionModalOpen && (
        <SubscriptionModal
          maxHeight={0.85}
          isOpen={isSubscriptionModalOpen}
          onClose={() => setIsSubscriptionModalOpen(false)}
        />
      )}
    </View>
  );
};

export default FremiumBanner;
