import { View, Text, Pressable, Image, ScrollView } from "react-native";
import React, { useState } from "react";
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
import useGetDownloadStories from "../../../hooks/tanstack/queryHooks/useGetDownloadStories";

export default function LibraryDownloads() {
  const { params } = useRoute<RotuteProps>();
  const [isOpen, setIsOpen] = useState(false);

  const { isPending, error, data, refetch } = useGetKidById(params.childId);
  const {
    isPending: storiesIsPending,
    error: storiesError,
    refetch: refetchStories,
    data: stories,
  } = useGetStories(params.childId);
  const { data: kidDownloads } = useGetDownloadStories(params.childId);
  const downloadedStoriesId = kidDownloads?.map((d) => d.storyId);
  const downloadedStories = stories.filter((story) =>
    downloadedStoriesId?.includes(story.id)
  );
  const navigation = useNavigation<KidsLibraryNavigatorProps>();
  return (
    <View className="flex-1 bg-[#866EFF]  items-center gap-x-3 pb-2 h-[60vh]">
      <View className="flex-row p-4">
        <Pressable className="px-2" onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={20} color="white" className="p-2" />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { fontSize: 18, color: "#fff" }]}
          className="flex-1 w-full  text-center"
        >
          Downloads
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className=" gap-y-5 space-y-5"
      >
        {downloadedStories.map((story) => (
          <BookReading key={story.id} story={story} setIsOpen={setIsOpen} />
        ))}
      </ScrollView>
      <ToddlerBookActionsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </View>
  );
}

const BookReading = ({
  story,
  setIsOpen,
}: {
  story: Story;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Pressable
      key={story.id}
      className="bg-white flex-row mt-5 rounded-xl p-4 gap-3"
    >
      <Image
        source={{ uri: story.coverImageUrl }}
        // style={{ position: "absolute", right: 0 }}
        className="h-[117px] w-[98px] rounded-md"
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
        <View className="text-text">
          <Clock size={16} />
          <Text></Text>
        </View>
        <Text className="text-text">% Complete</Text>
      </View>
    </Pressable>
  );
};
