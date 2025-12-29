import { useState } from "react";
import useGetUserKids from "../../../hooks/tanstack/queryHooks/useGetUserKids";
import CustomModal, { CustomModalProps } from "../CustomModal";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import CustomButton from "../../UI/CustomButton";
import EmptyKidsState from "../../emptyState/EmptyKidsState";
import Icon from "../../Icon";

interface Proptypes extends Omit<CustomModalProps, "children"> {
  storyId: string;
}

const RecommendStoryModal = ({ isOpen, onClose, storyId }: Proptypes) => {
  const { data, isPending, error, refetch } = useGetUserKids();
  const [kidsIds, setKidsIds] = useState<string[]>([]);

  const toggleSelectKid = (id: string) => {
    kidsIds.includes(id)
      ? setKidsIds((ids) => ids.filter((_id) => _id !== id))
      : setKidsIds((ids) => [...ids, id]);
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
                {data.map((kid) => {
                  const isSelected = kidsIds.includes(kid.id);
                  return (
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
                      <View
                        className={`
                    w-6 h-6 rounded-full border-2 
                    flex items-center justify-center
                    ${isSelected ? "border-blue" : "border-gray-300"}
                  `}
                      >
                        {isSelected && (
                          <View className="w-3 h-3 rounded-full bg-blue" />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              <View className="flex flex-col">
                <CustomButton
                  text="Select"
                  onPress={() => {
                    if (!kidsIds.length) {
                      Alert.alert("No kid selected");
                      return;
                    }
                    onClose();
                  }}
                />
                <Pressable
                  onPress={onClose}
                  className="bg-transparent border self-center max-w-sm mx-auto border-black/20 py-4 rounded-full mt-4 w-full"
                >
                  <Text className="text-center text-black font-[abeezee]">
                    Cancel
                  </Text>
                </Pressable>
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
