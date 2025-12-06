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
import React, { useEffect, useState } from "react";
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
  const [text, setText] = useState("");

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

  // const { data: storiesById } = useGetStoriesById(
  //   "00e031c6-daf5-4191-830f-81d6aab2dbc0"
  // );
  // console.log("stories by id", storiesById);
  const favouriteStoryIds = kidsFavorites?.map((f) => f.storyId);
  const favouriteStories = stories.filter((story) =>
    favouriteStoryIds?.includes(story.id)
  );
  // const downloadedStoriesId = kidDownloads?.map((d) => d.storyId);
  // const downloadedStories = stories.filter((story) =>
  //   downloadedStoriesId?.includes(story.id)
  // );


  console.log("downloads", kidDownloads);
  // console.log("created stories", createdStories);
  // console.log("completed stories", completedStories);

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

    //  useEffect(() => {
    //    const loadKid = async () => {
    //      const id = await AsyncStorage.getItem("currentKid");
    //      console.log("id", id);
    //      setCurrentKidId(id);
    //    };

    //    loadKid();
    //  }, []);

    return (
      <Pressable
        onPress={() =>
          navigator.navigate("setup" as any, {
            screen: "storyInteraction",
            params: { storyId: item.id },
          })
        }
        className="bg-white w-[249] h-[347] rounded-[10px] mr-5 gap-5"
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
              {storyProgress?.progress}% complete
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
      <View className="mb-[32]">
        <View className="flex-row mb-[24] justify-between w-full">
          <Text
            style={[
              defaultStyles.heading,
              { fontSize: 20, color: "black" },
              title == "Continue Reading" && { color: "white" },
            ]}
          >
            {title}
          </Text>
          {data?.length > 0 && (
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
          )}
        </View>

        {data?.length > 0 ? (
          <FlatList
            data={data}
            keyExtractor={(item) => `${title}-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => <StoryCard item={item} />}
          />
        ) : (
          <Text
            style={[
              defaultStyles.defaultText,
              { color: "black", fontSize: 14 },
            ]}
          >
            No stories yet
          </Text>
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
            value={text}
            onChangeText={(newText) => setText(newText)}
            placeholder="Search your library"
            placeholderTextColor="#ffffff80"
            style={{ color: "white", justifyContent: "center" }}
            className="h-10   placeholder:self-center flex-1"
          />
        </View>

        <HorizontalListSection
          title="Continue Reading"
          data={continueReading || []}
          navigateTo="continueReading"
        />

        <HorizontalListSection
          title="Favorites"
          data={favouriteStories || []}
          navigateTo="favourite"
        />

        <HorizontalListSection
          title="Downloaded"
          data={kidDownloads || []}
          navigateTo="downloads"
        />

        <HorizontalListSection
          title="My creation"
          data={createdStories || []}
          navigateTo="myCreations"
        />

        <HorizontalListSection
          title="Completed Stories"
          data={completedStories || []}
          navigateTo="completed"
        />
      </ScrollView>
    </View>
  );
}
