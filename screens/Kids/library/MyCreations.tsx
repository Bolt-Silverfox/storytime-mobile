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
import useGetCreatedStories from "../../../hooks/tanstack/queryHooks/useGetCreatedStories";
import { ContinueReading } from "../../../hooks/tanstack/queryHooks/useGetContinueReading";
import { BookReading } from "./ContinueReading";

export default function MyCreations() {
  const { params } = useRoute<RotuteProps>();
  const [isOpen, setIsOpen] = useState(false);

  const { isPending, error, data, refetch } = useGetKidById(params.childId);
  const {
    isPending: storiesIsPending,
    error: storiesError,
    refetch: refetchStories,
    data: stories,
  } = useGetStories(params.childId);
  const { data: createdStories } = useGetCreatedStories(params.childId);

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
          My creations
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className=" gap-y-5 space-y-5"
      >
        {createdStories?.length === 0 || !createdStories ? (
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
            {createdStories?.map((story, i) => (
              <BookReading key={i} story={story} category="creation" />
            ))}
          </>
        )}
       
      </ScrollView>
    </View>
  );
}

