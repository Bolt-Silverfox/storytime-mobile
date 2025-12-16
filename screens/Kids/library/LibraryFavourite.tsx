import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  ImageBackground,
  TextInput,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowLeft2, Clock } from "iconsax-react-nativejs";
import defaultStyles from "../../../styles";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { KidsTabNavigatorProp } from "../../../Navigation/KidsTabNavigator";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import useGetStories, {
  Story,
} from "../../../hooks/tanstack/queryHooks/useGetStories";
import { Ellipsis, Search } from "lucide-react-native";
import ToddlerBookActionsModal from "../../../components/modals/ToddlerBookActionsModal";
import {
  KidsLibraryNavigatorParamList,
  KidsLibraryNavigatorProps,
} from "../../../Navigation/KidsLibraryNavigator";
import useGetKidFavorites from "../../../hooks/tanstack/queryHooks/useGetKidFavorites";
import { BookReading } from "./ContinueReading";
import { filterStoriesByTitle } from "../../../utils/utils";

type KidsLibraryNavigatorRouteProp = RouteProp<
  KidsLibraryNavigatorParamList,
  "continueReading"
>;

export default function LibraryFavourite() {
  const navigation = useNavigation<KidsLibraryNavigatorProps>();
  const { params } = useRoute<KidsLibraryNavigatorRouteProp>();
  const [searchText, setSearchText] = useState("");
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

  const filteredFavorites = useMemo(
    () => filterStoriesByTitle(favouriteStories || [], searchText),
    [favouriteStories, searchText]
  );

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
        className="gap-y-5 space-y-5 mx-4"
      >
        {favouriteStories?.length! > 0 && (
          <View className="border my-[10] border-white w-full py-1 items-center justify-center flex-row rounded-full px-3 gap-2">
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
        )}

        {favouriteStories?.length === 0 || !favouriteStories ? (
          <Text
            className="mt-4 mx-auto"
            style={[defaultStyles.defaultText, { color: "#fff", fontSize: 14 }]}
          >
            You have no stories in your continue reading list yet
          </Text>
        ) : (
          <>
            {filteredFavorites?.length === 0 ? (
              <Text
                style={[
                  defaultStyles.defaultText,
                  { color: "#fff", fontSize: 14 },
                ]}
                className="mt-4 mx-auto"
              >
                no results found for "{searchText}"
              </Text>
            ) : (
              <>
                {filteredFavorites?.map((story, i) => (
                  <BookReading key={i} story={story} />
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
