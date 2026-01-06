import { useQuery } from "@tanstack/react-query";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Icon from "../../components/Icon";
import { Story } from "../../types";
import queryParentsFavourites from "../../hooks/tanstack/queryHooks/queryParentFavourites";
import CustomEmptyState from "../../components/emptyState/CustomEmptyState";
import ErrorComponent from "../../components/ErrorComponent";
import LoadingOverlay from "../../components/LoadingOverlay";

const ParentsFavouritesScreen = () => {
  const { data, isPending, error, refetch } = useQuery(
    queryParentsFavourites()
  );

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (isPending) return <LoadingOverlay visible />;
  if (!data.length) return <CustomEmptyState message="No Favourites yet" />;
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
        {data?.map((story) => (
          <FavouriteStoryItem key={story.id} story={story} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ParentsFavouritesScreen;

const FavouriteStoryItem = ({ story }: { story: Story }) => {
  return (
    <View className="flex flex-row p-2 gap-x-2 bg-white border border-border-lighter rounded-3xl">
      <Image
        source={{ uri: story.coverImageUrl }}
        height={171}
        width={186}
        className="rounded-3xl"
      />
      <View className="flex flex-col gap-y-2 flex-1">
        <Text className="font-[abeezee] text-black text-sm">{story.title}</Text>
        <Text className="font-[abeezee] text-text text-sm">
          {story.description}
        </Text>
        {/* <Text className="font-[abeezee] text-black">Written by : Samuel Liu</Text> */}
        <Text className="font-[abeezee] text-text text-sm">
          {story.ageMin} - {story.ageMax}
        </Text>
        <Pressable className="self-end">
          <Icon name="Heart" color="red" />
        </Pressable>
      </View>
    </View>
  );
};
