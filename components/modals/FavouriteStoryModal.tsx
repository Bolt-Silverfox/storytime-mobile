import { Text, View } from "react-native";
import { useToggleFavourites } from "../../hooks/tanstack/mutationHooks/useToggleFavourites";
import { FavouriteStory } from "../../types";
import CustomButton from "../UI/CustomButton";
import CustomModal from "./CustomModal";

const FavouriteStoriesModal = ({
  isOpen,
  onClose,
  story,
}: {
  isOpen: boolean;
  onClose: () => void;
  story: FavouriteStory;
}) => {
  const { mutate } = useToggleFavourites({
    story,
    isLiked: true,
  });
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <Text className="text-center font-[abeezee] text-base text-text">
        Are you sure you want to remove{" "}
        <Text className="font-[quilka] text-lg text-black">{story.title}</Text>{" "}
        from favourites?
      </Text>
      <View className="flex flex-col items-center gap-y-3">
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
