import { Image, Text, View } from "react-native";
import useToast from "../../../contexts/ToastContext";
import useRemoveStoryFromLibrary from "../../../hooks/tanstack/mutationHooks/useRemoveStoryFromLibrary";
import CustomButton from "../../UI/CustomButton";
import CustomModal, { CustomModalProps } from "../CustomModal";

interface RemoveStoryModalProps extends Omit<CustomModalProps, "children"> {
  activeStory: {
    title: string;
    id: string;
  };
}

const RemoveStoryModal = ({
  isOpen,
  onClose,
  activeStory,
}: RemoveStoryModalProps) => {
  const { mutate: removeStory, isPending } = useRemoveStoryFromLibrary();
  const { notify } = useToast();

  const handleRemove = () => {
    removeStory(activeStory.id, {
      onSuccess: () => {
        onClose();
        setTimeout(() => {
          notify("Story removed successfully");
        }, 500);
        notifyWithTitle();
      },
    });
  };

  const notifyWithTitle = () => {
    setTimeout(() => {
      notify(`"${activeStory.title}" removed from library`);
    }, 1000);
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
            You are about to remove{" "}
            <Text className="font-[quilka]">{activeStory.title}</Text> from your
            library. Are you sure?
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
