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
import { Ellipsis, Search } from "lucide-react-native";
import ToddlerBookActionsModal from "../../../components/modals/ToddlerBookActionsModal";
import {
  KidsLibraryNavigatorParamList,
  KidsLibraryNavigatorProps,
} from "../../../Navigation/KidsLibraryNavigator";
import useGetContinueReading from "../../../hooks/tanstack/queryHooks/useGetContinueReading";
import useGetStoryProgress from "../../../hooks/tanstack/queryHooks/useGetStoryProgress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { filterStoriesByTitle } from "../../../utils/utils";
import { fi } from "zod/v4/locales";

type KidsLibraryNavigatorRouteProp = RouteProp<
  KidsLibraryNavigatorParamList,
  "continueReading"
>;

export default function ContinueReadingLibrary() {
  const { params } = useRoute<KidsLibraryNavigatorRouteProp>();
  const [searchText, setSearchText] = useState("");
  const {
    isPending: ContinueReadingIsPending,
    error: ContinueReadingError,
    refetch: refetchContinueReadingStories,
    data: continueReading,
  } = useGetContinueReading(params.childId);

  const filteredContinueReading = useMemo(
    () => filterStoriesByTitle(continueReading || [], searchText),
    [continueReading, searchText]
  );

  const navigation = useNavigation<KidsLibraryNavigatorProps>();

  return (
    <View className="flex-1 gap-x-3 pb-2 h-[60vh]">
      <ImageBackground
        source={require("../../../assets/images/story-generation-bg.png")}
        className=" bg-contain h-[572]  w-full "
        style={{ position: "absolute" }}
        resizeMode="cover"
      >
        <View className="flex bg-[#866EFF] h items-center gap-x-3 pb-4 h-[45vh]" />
      </ImageBackground>
      <View className="flex-row p-4">
        <Pressable onPress={() => navigation.goBack()} className="px-2">
          <ArrowLeft2 size={20} color="white" />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { fontSize: 18, color: "#fff" }]}
          className="flex-1 w-full  text-center"
        >
          Continue reading
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="gap-y-5 space-y-5 mx-4"
      >
        {continueReading?.length! > 0 && (
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

        {continueReading?.length === 0 || !continueReading ? (
          <Text
            className="mt-4 mx-auto"
            style={[defaultStyles.defaultText, { color: "#fff", fontSize: 14 }]}
          >
            You haven't read any stories yet
          </Text>
        ) : (
          <>
            {filteredContinueReading?.length === 0 ? (
              <Text
                style={[
                  defaultStyles.defaultText,
                  { color: "#fff", fontSize: 14 },
                ]}
                className="mt-4 mx-auto"
              >
                No results found for "{searchText}"
              </Text>
            ) : (
              <>
                {filteredContinueReading?.map((story, i) => (
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

export const BookReading = ({
  story,
  category,
}: {
  story: any;
  category?: string;
}) => {
  const [currentKidId, setCurrentKidId] = useState<string | null>(null);
  const { data: storyProgress } = useGetStoryProgress(currentKidId!, story?.id);
  const progress = (storyProgress?.progress! / 100) * 211;
  const navigator = useNavigation<KidsLibraryNavigatorProps>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadKid = async () => {
      const id = await AsyncStorage.getItem("currentKid");
      setCurrentKidId(id);
    };

    loadKid();
  }, []);

  return (
    <Pressable
      className="bg-white flex-row mt-5 rounded-xl p-4 gap-3 "
      onPress={() =>
        navigator.navigate("setup" as any, {
          screen: "storyInteraction",
          params: { storyId: story.id },
        })
      }
    >
      <Image
        source={{ uri: story.coverImageUrl }}
        // style={{ position: "absolute", right: 0 }}
        className="h-[127px] w-[98px] rounded-md"
      />
      <View>
        <View className="flex-row gap-x-1">
          <Text
            style={[
              defaultStyles.defaultText,
              { fontSize: 18, color: "black" },
            ]}
            className="text-wrap mb-1 w-[190] "
          >
            {story.title}
          </Text>
          <Pressable onPress={() => setIsOpen(true)}>
            <Ellipsis size={30} className="self-center" />
          </Pressable>
        </View>
        <View className="text-text flex-row mb-1">
          <Clock size={16} />
          <Text></Text>
        </View>
        <Text className="text-text">
          {Math.round(storyProgress?.progress!)}% Complete
        </Text>
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
      <ToddlerBookActionsModal
        kidId={currentKidId!}
        storyId={story.id}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        category={category}
      />
    </Pressable>
  );
};
