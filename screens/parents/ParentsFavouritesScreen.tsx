import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import CustomEmptyState from "../../components/emptyState/CustomEmptyState";
import ErrorComponent from "../../components/ErrorComponent";
import FavouriteStoryItem from "../../components/FavouriteStoryItem";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import FavouriteStoriesModal from "../../components/modals/FavouriteStoryModal";
import queryParentsFavourites from "../../hooks/tanstack/queryHooks/queryParentFavourites";
import { FavouriteStory } from "../../types";

const ParentsFavouritesScreen = () => {
  const { data, isPending, error, refetch } = useQuery(
    queryParentsFavourites()
  );
  const [activeItem, setActiveItem] = useState<FavouriteStory | null>(null);

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (isPending) return <LoadingOverlay visible />;
  if (!data.length)
    return (
      <CustomEmptyState
        url={require("../../assets/images/favourites-empty-state.png")}
        message="No Favourites added yet"
        secondaryMessage="You do not have any favourite stories aded yet"
      />
    );
  return (
    <View className="flex-1 bg-bgLight">
      <View className="bg-white px-4 border-b border-b-border-lighter py-5 flex flex-row items-center justify-between">
        <Text className="text-xl text-black font-[abeezee] flex-1">
          Favourites
        </Text>
        <View className="flex flex-row gap-x-5 items-center">
          <Icon name="Funnel" />
          <Icon name="Search" />
        </View>
      </View>
      <ScrollView contentContainerClassName="flex flex-col pb-10 gap-y-4 my-6 px-4">
        {data.map((story) => (
          <FavouriteStoryItem
            key={story.id}
            story={story}
            setActiveStory={setActiveItem}
          />
        ))}
      </ScrollView>
      {activeItem && (
        <FavouriteStoriesModal
          isOpen={activeItem !== null}
          onClose={() => setActiveItem(null)}
          story={activeItem}
        />
      )}
    </View>
  );
};

export default ParentsFavouritesScreen;
