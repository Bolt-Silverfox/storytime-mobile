import { Alert, Text, View } from "react-native";
import { useToggleFavourites } from "../../hooks/tanstack/mutationHooks/useParentFavourites";
import CustomModal from "./CustomModal";
import CustomButton from "../UI/CustomButton";
import { FavouriteStory } from "../../types";

const FavouriteStoriesModal = ({
  isOpen,
  onClose,
  story,
}: {
  isOpen: boolean;
  onClose: () => void;
  story: FavouriteStory;
}) => {
  const { mutate, isPending } = useToggleFavourites({
    story,
    onSuccess: () => Alert.alert("updated successfully!"),
  });
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Text className="text-base text-center font-[abeezee] text-text">
        Are you sure you want to remove{" "}
        <Text className="font-[quilka] text-lg text-black">{story.title}</Text>{" "}
        from favourites?
      </Text>
      <View className="flex flex-col gap-y-3 items-center">
        <CustomButton
          text="Yes, remove"
          onPress={() => {
            onClose();
            mutate();
          }}
        />
        <CustomButton text="Cancel" transparent onPress={onClose} />
      </View>
    </CustomModal>
  );
};

export default FavouriteStoriesModal;
