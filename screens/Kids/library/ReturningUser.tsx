import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import defaultStyles from "../../../styles";
import { Search } from "lucide-react-native";
import useGetStories from "../../../hooks/tanstack/queryHooks/useGetStories";
import { RotuteProps } from "./KidsLibraryScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  KidsLibraryNavigatorParamList,
  KidsLibraryNavigatorProps,
} from "../../../Navigation/KidsLibraryNavigator";

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

  // Component for rendering each story card
  const StoryCard = ({ item }: { item: any }) => (
    <Pressable className="bg-white w-[249] h-[347] rounded-[10px] mr-5 gap-5">
      <Image
        source={{ uri: item.coverImageUrl }}
        className="h-[217] w-full rounded-t-[10px]"
      />
      <View className="h-[100]">
        <View className="px-4">
          <Text
            style={[
              defaultStyles.defaultText,
              { fontSize: 16, color: "black" },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              defaultStyles.defaultText,
              { fontSize: 16, color: "black" },
            ]}
          >
            % complete
          </Text>
        </View>
      </View>
    </Pressable>
  );

  // Component for rendering each horizontal list section
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
            style={[defaultStyles.heading, { fontSize: 20, color: "#fff" }]}
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
            style={[defaultStyles.defaultText, { color: "#fff", fontSize: 14 }]}
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
    <View className="flex-1 bg-[#866EFF] items-center gap-x-3 pb-4 px-[16]">
      <Text
        style={[defaultStyles.heading, { fontSize: 24, color: "#fff" }]}
        className="py-3"
      >
        Library
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        {/* Search Bar */}
        <View className="border mt-[24] mb-[40] border-white w-full py-1 items-center flex-row rounded-full px-3 gap-2">
          <Search color={"white"} size={24} className="self-center" />
          <TextInput
            value={text}
            onChangeText={(newText) => setText(newText)}
            placeholder="Search your library"
            placeholderTextColor="#ffffff80"
            style={{ color: "white" }}
            className="h-10 flex-1"
          />
        </View>

        <HorizontalListSection
          title="Continue Reading"
          data={stories || []}
          navigateTo="continueReading"
        />

        <HorizontalListSection
          title="Favorites"
          data={stories || []}
          navigateTo="favourite"
        />

        <HorizontalListSection
          title="Downloaded"
          data={stories || []}
          navigateTo="downloads"
        />

        <HorizontalListSection
          title="My creation"
          data={stories || []}
          navigateTo="myCreations"
        />

        <HorizontalListSection
          title="Completed Stories"
          data={stories || []}
          navigateTo="completed"
        />
      </ScrollView>
    </View>
  );
}
