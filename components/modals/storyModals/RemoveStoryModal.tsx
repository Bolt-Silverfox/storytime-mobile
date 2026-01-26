import { Image, Pressable, Text, View } from "react-native";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";
import useRemoveStoryFromLibrary from "../../../hooks/tanstack/mutationHooks/useRemoveStoryFromLibrary";

interface RemoveStoryModalProps extends Omit<CustomModalProps, "children"> {
  storyId: string;
  storyTitle: string;
  onRemoveSuccess: (title: string) => void;
}

const RemoveStoryModal = ({
  isOpen,
  onClose,
  storyId,
  storyTitle,
  onRemoveSuccess
}: RemoveStoryModalProps) => {
  const { mutate: removeStory, isPending } = useRemoveStoryFromLibrary();

  const handleRemove = () => {
    removeStory(storyId, {
      onSuccess: () => {
        onRemoveSuccess(storyTitle);
        onClose();
      },
    });
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <View className="bg-white flex flex-col gap-y-6">
        <Image
          source={require("../../../assets/images/sad-emoji.png")}
          className="size-40 self-center"
        />

        <View className="flex flex-col gap-y-3">
          <Text className="font-[quilka] text-center text-black text-2xl">
            Remove story
          </Text>
          <Text className="font-[abeezee] text-center text-text text-base">
            You are about to remove a story from your library. Are you sure?
          </Text>
        </View>

        <View className="flex flex-col items-center gap-y-3 mt-4">
          <CustomButton
            onPress={handleRemove}
            text="Yes, remove"
            disabled={isPending}
          />

          <Pressable
            onPress={onClose}
            className="border max-w-sm flex w-full flex-row justify-center items-center h-10 rounded-full"
          >
            <Text className="font-[abeezee] text-black text-base">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </CustomModal>
  );
};

export default RemoveStoryModal;
