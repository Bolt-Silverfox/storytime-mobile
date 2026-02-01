import { Image, Text, View } from "react-native";
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
  onRemoveSuccess,
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
      <View className="flex flex-col gap-y-6 bg-white">
        <Image
          source={require("../../../assets/images/sad-emoji.png")}
          className="size-40 self-center"
        />

        <View className="flex flex-col gap-y-3">
          <Text className="text-center font-[quilka] text-2xl text-black">
            Remove story
          </Text>
          <Text className="text-center font-[abeezee] text-base text-text">
            You are about to remove a story from your library. Are you sure?
          </Text>
        </View>

        <View className="mt-4 flex flex-col items-center gap-y-3">
          <CustomButton
            onPress={handleRemove}
            text="Yes, remove"
            disabled={isPending}
          />
          <CustomButton
            onPress={onClose}
            text="Cancel"
            disabled={isPending}
            transparent
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default RemoveStoryModal;
