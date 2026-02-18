import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "../Icon";
import SubscriptionModal from "../modals/SubscriptionModal";

const FremiumBanner = ({ closeBanner }: { closeBanner: () => void }) => {
  const numOfStoriesRead = 10;
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  return (
    <View className="flex flex-row items-center gap-x-5 bg-blue p-4">
      <View className="flex flex-1 flex-col gap-y-1.5">
        {numOfStoriesRead >= 10 ? (
          <>
            <Text className="font-[abeezee] text-xs text-[#D3C9FA]">
              10 free stories completed, upgrade to unlock unlimited stories,
              audio narration and a growing library your child will love.
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
              0/10 stories read
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
