import { useNavigation } from "@react-navigation/native";
import { ArrowLeft2 } from "iconsax-react-nativejs";
import { Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { KidsLibraryNavigatorProps } from "../../../Navigation/KidsLibraryNavigator";
import useKidNavigator from "../../../contexts/KidNavigatorContext";
import useGetCompletedStories from "../../../hooks/tanstack/queryHooks/useGetCompletedStories";
import defaultStyles from "../../../styles";
import { filterStoriesByTitle } from "../../../utils/utils";
import { BookReading } from "./ContinueReading";

export default function LibraryCompleted() {
  const { childId } = useKidNavigator();
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation<KidsLibraryNavigatorProps>();
  const { data: completedStories } = useGetCompletedStories(childId!);
  const filteredCompletedStories = useMemo(
    () => filterStoriesByTitle(completedStories || [], searchText),
    [completedStories, searchText]
  );

  return (
    <View className="flex-1 bg-[#866EFF]   gap-x-3 pb-2 h-[60vh]">
      <View className="flex-row p-4">
        <Pressable className="px-2" onPress={() => navigation.goBack()}>
          <ArrowLeft2 size={20} color="white" className="p-2" />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { fontSize: 18, color: "#fff" }]}
          className="flex-1 w-full  text-center"
        >
          Completed stories
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className=" gap-y-5 space-y-5 mx-4 "
      >
        {completedStories?.length! > 0 && (
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

        {completedStories?.length === 0 || !completedStories ? (
          <Text
            className="mt-4 mx-auto"
            style={[defaultStyles.defaultText, { color: "#fff", fontSize: 14 }]}
          >
            You have no completed stories yet
          </Text>
        ) : (
          <>
            {filteredCompletedStories?.length === 0 ? (
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
                {filteredCompletedStories?.map((story, i) => (
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
