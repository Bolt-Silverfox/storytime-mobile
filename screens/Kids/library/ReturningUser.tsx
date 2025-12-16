import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import defaultStyles from "../../../styles";
import { Search } from "lucide-react-native";
import useGetStories from "../../../hooks/tanstack/queryHooks/useGetStories";
import { RotuteProps } from "./KidsLibraryScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  KidsLibraryNavigatorParamList,
  KidsLibraryNavigatorProps,
} from "../../../Navigation/KidsLibraryNavigator";
import useGetContinueReading from "../../../hooks/tanstack/queryHooks/useGetContinueReading";
import useGetKidFavorites from "../../../hooks/tanstack/queryHooks/useGetKidFavorites";
import useGetStoriesById from "../../../hooks/tanstack/queryHooks/useGetStoriesById";
import useGetDownloadStories from "../../../hooks/tanstack/queryHooks/useGetDownloadStories";
import useGetCompletedStories from "../../../hooks/tanstack/queryHooks/useGetCompletedStories";
import useGetCreatedStories from "../../../hooks/tanstack/queryHooks/useGetCreatedStories";
import useGetStoryProgress from "../../../hooks/tanstack/queryHooks/useGetStoryProgress";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReturningUser() {
  const { params } = useRoute<RotuteProps>();
  const navigation = useNavigation<KidsLibraryNavigatorProps>();
  const [searchText, setSearchText] = useState("");

  const {
    isPending: storiesIsPending,
    error: storiesError,
    refetch: refetchStories,
    data: stories,
  } = useGetStories(params.childId);

  const {
    isPending: ContinueReadingIsPending,
    error: ContinueReadingError,
    refetch: refetchContinueReadingStories,
    data: continueReading,
  } = useGetContinueReading(params.childId);
  const { data: completedStories } = useGetCompletedStories(params.childId);
  const { data: createdStories } = useGetCreatedStories(params.childId);
  const { data: kidsFavorites } = useGetKidFavorites(params.childId);
  const { data: kidDownloads } = useGetDownloadStories(params.childId);
  const favouriteStoryIds = kidsFavorites?.map((f) => f.storyId);
  const favouriteStories = stories.filter((story) =>
    favouriteStoryIds?.includes(story.id)
  );

  const filterStoriesByTitle = (stories: any[], searchQuery: string) => {
    if (!searchQuery.trim()) return stories;

    const query = searchQuery.toLowerCase().trim();
    return (
      stories?.filter((story) => story.title?.toLowerCase().includes(query)) ||
      []
    );
  };

  const filteredContinueReading = useMemo(
    () => filterStoriesByTitle(continueReading || [], searchText),
    [continueReading, searchText]
  );

  const filteredCompletedStories = useMemo(
    () => filterStoriesByTitle(completedStories || [], searchText),
    [completedStories, searchText]
  );

  const filteredFavorites = useMemo(
    () => filterStoriesByTitle(favouriteStories || [], searchText),
    [favouriteStories, searchText]
  );

  const filteredDownloads = useMemo(
    () => filterStoriesByTitle(kidDownloads || [], searchText),
    [kidDownloads, searchText]
  );

  const filteredCreatedStories = useMemo(
    () => filterStoriesByTitle(createdStories || [], searchText),
    [createdStories, searchText]
  );

  // Check if search is active and has results
  const isSearchActive = searchText.trim().length > 0;
  const hasSearchResults =
    isSearchActive &&
    (filteredContinueReading.length > 0 ||
      filteredCompletedStories.length > 0 ||
      filteredFavorites.length > 0 ||
      filteredDownloads.length > 0 ||
      filteredCreatedStories.length > 0);
  const StoryCard = ({ item }: { item: any }) => {
    const { params } = useRoute<RotuteProps>();
    const navigator = useNavigation<KidsLibraryNavigatorProps>();
    const { data: storyProgress } = useGetStoryProgress(
      params?.childId!,
      item?.id
    );
    console.log(storyProgress, "dif");
    console.log(item.id, "item");
    const progress = (storyProgress?.progress! / 100) * 211;

    return (
      <Pressable
        onPress={() =>
          navigator.navigate("setup" as any, {
            screen: "storyInteraction",
            params: { storyId: item.id },
          })
        }
        className="bg-white mb-8 w-[249] h-[347] rounded-[10px] mr-5 gap-5"
      >
        <Image
          source={{ uri: item.coverImageUrl }}
          className="h-[217] w-full rounded-t-[10px]"
        />
        <View className="h-[100]">
          <View className="px-4">
            <Text
              style={[
                defaultStyles.defaultText,
                { fontSize: 18, color: "black" },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                defaultStyles.defaultText,
                { fontSize: 16, color: "#616161" },
              ]}
            >
              {Math.round(storyProgress?.progress!)}% complete
            </Text>
          </View>

          <View className="rounded-full mx-auto my-2 justify-center items-start w-[230] h-[32] bg-[#DAE1F1] border-b-4 border-r-4 border-[#B0BAFF] ">
            <View className="bg-[#B0BAFF] rounded-full w-[94%] mx-auto  h-[16]">
              <View
                style={{
                  backgroundColor: "#866EFF",
                  width: progress,
                  height: 16,
                  borderRadius: 100,
                }}
              />
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const HorizontalListSection = <
    T extends keyof KidsLibraryNavigatorParamList,
  >({
    title,
    data,
    navigateTo,
  }: {
    title: string;
    data: any[];
    navigateTo: T;
  }) => {
    const handleNavigation = () => {
      // @ts-ignore - Dynamic navigation with consistent params
      navigation.navigate(navigateTo, {
        childId: params.childId!,
      } as KidsLibraryNavigatorParamList[T]);
    };

    return (
      <View className="">
        {data?.length > 0 && (
          <>
            <View className="flex-row  mb-[24] justify-between w-full">
              <Text
                style={[
                  defaultStyles.heading,
                  { fontSize: 20, color: "black" },
                  title == "Continue Reading" && { color: "white" },
                ]}
              >
                {title}
              </Text>
              <Pressable onPress={handleNavigation}>
                <Text
                  style={[
                    defaultStyles.defaultText,
                    { fontSize: 16, color: "#fff" },
                  ]}
                >
                  View all
                </Text>
              </Pressable>
            </View>
            
            <FlatList
              data={data}
              keyExtractor={(item) => `${title}-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => <StoryCard item={item} />}
            />
          </>
        )}
      </View>
    );
  };

  // Loading state
  if (storiesIsPending) {
    return (
      <View className="flex-1 bg-[#866EFF] justify-center items-center">
        <Text style={[defaultStyles.defaultText, { color: "#fff" }]}>
          Loading stories...
        </Text>
      </View>
    );
  }

  // Error state
  if (storiesError) {
    return (
      <View className="flex-1 bg-[#866EFF] justify-center items-center">
        <Text style={[defaultStyles.defaultText, { color: "#fff" }]}>
          Error loading stories
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1  items-center gap-x-3 pb-4 ">
      <ImageBackground
        source={require("../../../assets/images/story-generation-bg.png")}
        className=" bg-contain h-[572]  w-full "
        style={{ position: "absolute" }}
        resizeMode="cover"
      >
        <View className="flex bg-[#866EFF] h items-center gap-x-3 pb-4 h-[45vh]" />
      </ImageBackground>
      <Text
        style={[defaultStyles.heading, { fontSize: 24, color: "#fff" }]}
        className="py-3"
      >
        Library
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} className="w-full px-4">
        {/* Search Bar */}
        <View className="border mt-[24] mb-[40] border-white w-full py-1 items-center justify-center flex-row rounded-full px-3 gap-2">
          <Search color={"white"} size={24} className="self-center" />
          <TextInput
            value={searchText}
            onChangeText={(newText) => setSearchText(newText)}
            placeholder="Search your library"
            placeholderTextColor="#ffffff80"
            style={{ color: "white", justifyContent: "center" }}
            className="h-10 placeholder:self-center flex-1"
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText("")}>
              <Text style={{ color: "white", fontSize: 16 }}>✕</Text>
            </Pressable>
          )}
        </View>
        {isSearchActive && !hasSearchResults && (
          <View className="items-center py-10">
            <Text
              style={[
                defaultStyles.defaultText,
                { color: "#fff", fontSize: 16 },
              ]}
            >
              No stories found for "{searchText}"
            </Text>
          </View>
        )}
        {/* Only show sections with results when searching, or all sections when not searching */}
        {(!isSearchActive || filteredContinueReading.length > 0) && (
          <HorizontalListSection
            title="Continue Reading"
            data={filteredContinueReading}
            navigateTo="continueReading"
          />
        )}

        {(!isSearchActive || filteredFavorites.length > 0) && (
          <HorizontalListSection
            title="Favorites"
            data={filteredFavorites}
            navigateTo="favourite"
          />
        )}

        {(!isSearchActive || filteredDownloads.length > 0) && (
          <HorizontalListSection
            title="Downloaded"
            data={filteredDownloads}
            navigateTo="downloads"
          />
        )}

        {(!isSearchActive || filteredCreatedStories.length > 0) && (
          <HorizontalListSection
            title="My creation"
            data={filteredCreatedStories}
            navigateTo="myCreations"
          />
        )}

        {(!isSearchActive || filteredCompletedStories.length > 0) && (
          <HorizontalListSection
            title="Completed Stories"
            data={filteredCompletedStories}
            navigateTo="completed"
          />
        )}
      </ScrollView>
    </View>
  );
}
