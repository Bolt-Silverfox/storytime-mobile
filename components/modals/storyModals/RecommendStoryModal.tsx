import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import useStoryMode from "../../../contexts/StoryModeContext";
import { useRecommendStory } from "../../../hooks/tanstack/mutationHooks/useRecommendStory";
import useGetUserKids from "../../../hooks/tanstack/queryHooks/useGetUserKids";
import EmptyKidsState from "../../emptyState/EmptyKidsState";
import Icon from "../../Icon";
import CheckBox from "../../UI/CheckBox";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";

interface Proptypes extends Omit<CustomModalProps, "children"> {}

const RecommendStoryModal = ({ isOpen, onClose }: Proptypes) => {
  const { data, isPending, error, refetch } = useGetUserKids();
  const [kidsIds, setKidsIds] = useState<string[]>([]);
  const { activeStoryId } = useStoryMode();
  const { mutate, isPending: isRecommending } = useRecommendStory({
    onSuccess: onClose,
  });

  const toggleSelectKid = (id: string) => {
    kidsIds.includes(id)
      ? setKidsIds((ids) => ids.filter((_id) => _id !== id))
      : setKidsIds((ids) => [...ids, id]);
  };

  const onRecommendStory = () => {
    if (!kidsIds.length) return;
    mutate({ storyId: activeStoryId!, message: "", kidsIds });
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      isPending={isPending}
      error={{
        message: error?.message!,
        retry: refetch,
      }}
    >
      <View className="flex flex-1 flex-col gap-y-6">
        <View className="flex flex-row justify-between items-center">
          <Text className="font-[abeezee] text-black text-base">
            Who are you recommending this story for?
          </Text>
          <Icon name="SquareX" onPress={onClose} />
        </View>
        <ScrollView
          contentContainerClassName="flex flex-col min-h-full gap-y-5 bg-blue-600"
          showsVerticalScrollIndicator={false}
        >
          <Text className="font-[abeezee] text-black text-sm">
            Recommend this story for your kids
          </Text>
          {data && data.length > 0 ? (
            <View className="flex flex-col gap-y-6">
              <View className="flex flex-col gap-y-3">
                {data.map((kid) => (
                  <Pressable
                    key={kid.id}
                    onPress={() => toggleSelectKid(kid.id)}
                    className="flex-row border-b border-border-light border items-center justify-between py-4 px-4 rounded-2xl"
                  >
                    <View className="flex-row items-center gap-x-3">
                      <Image
                        source={
                          kid.avatar?.url
                            ? { uri: kid?.avatar?.url }
                            : require("../../../assets/avatars/Avatars-3.png")
                        }
                        className="size-12"
                      />
                      <Text className="text-base capitalize font-[abeezee]">
                        {kid.name.split(" ")[0]}
                      </Text>
                    </View>
                    <CheckBox
                      onPress={() => toggleSelectKid(kid.id)}
                      isSelected={kidsIds.includes(kid.id)}
                    />
                  </Pressable>
                ))}
              </View>
              <View className="flex flex-col items-center gap-y-4">
                <CustomButton
                  disabled={!kidsIds.length || isRecommending}
                  text={isRecommending ? "Recommending..." : "Recommend story"}
                  onPress={onRecommendStory}
                />
                <CustomButton transparent onPress={onClose} text="Cancel" />
              </View>
            </View>
          ) : (
            <EmptyKidsState onClose={onClose} />
          )}
        </ScrollView>
      </View>
    </CustomModal>
  );
};

export default RecommendStoryModal;
