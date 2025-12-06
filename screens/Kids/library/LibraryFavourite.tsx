import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowLeft2, Clock } from "iconsax-react-nativejs";
import defaultStyles from "../../../styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { KidsTabNavigatorProp } from "../../../Navigation/KidsTabNavigator";
import { RotuteProps } from "./KidsLibraryScreen";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import useGetStories, {
  Story,
} from "../../../hooks/tanstack/queryHooks/useGetStories";
import { Ellipsis } from "lucide-react-native";
import ToddlerBookActionsModal from "../../../components/modals/ToddlerBookActionsModal";
import { KidsLibraryNavigatorProps } from "../../../Navigation/KidsLibraryNavigator";
import useGetKidFavorites from "../../../hooks/tanstack/queryHooks/useGetKidFavorites";
import { BookReading } from "./ContinueReading";

export default function LibraryFavourite() {
  const { params } = useRoute<RotuteProps>();

  const { isPending, error, data, refetch } = useGetKidById(params.childId);
  const {
    isPending: storiesIsPending,
    error: storiesError,
    refetch: refetchStories,
    data: stories,
  } = useGetStories(params.childId);
  const { data: kidsFavorites } = useGetKidFavorites(params.childId);
  const favouriteStoryIds = kidsFavorites?.map((f) => f.storyId);
  const favouriteStories = stories.filter((story) =>
    favouriteStoryIds?.includes(story.id)
  );

  const navigation = useNavigation<KidsLibraryNavigatorProps>();

  //  useEffect(() => {
  //     if (favouriteStories?.length === 0) {
  //       navigation.replace("indexPage", { childId: params.childId });
  //     }
  //   }, [favouriteStories]);

  return (
    <View className="flex-1   items-center gap-x-3 pb-2 h-[60vh]">
      <ImageBackground
        source={require("../../../assets/images/story-generation-bg.png")}
        className=" bg-contain h-[572]  w-full "
        style={{ position: "absolute" }}
        resizeMode="cover"
      >
        <View className="flex bg-[#866EFF] h items-center gap-x-3 pb-4 h-[45vh]" />
      </ImageBackground>
      <View className="flex-row p-4">
        <Pressable className="px-2" onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={20} color="white" className="p-2" />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { fontSize: 18, color: "#fff" }]}
          className="flex-1 w-full  text-center"
        >
          Favourites
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className=" gap-y-5 space-y-5 "
      >
        {favouriteStories?.length === 0 || !favouriteStories ? (
          <View className="">
            <Text
              style={[
                defaultStyles.defaultText,
                { color: "#fff", fontSize: 14 },
              ]}
            >
              No favorite stories yet
            </Text>
          </View>
        ) : (
          <>
            {favouriteStories?.map((story, i) => (
              <BookReading key={i} story={story} category="favorite" />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
