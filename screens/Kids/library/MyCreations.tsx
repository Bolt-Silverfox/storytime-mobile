import { RouteProp, useNavigation } from "@react-navigation/native";
import { ArrowLeft2 } from "iconsax-react-nativejs";
import { Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import {
  KidsLibraryNavigatorParamList,
  KidsLibraryNavigatorProps,
} from "../../../Navigation/KidsLibraryNavigator";
import useKidNavigator from "../../../contexts/KidNavigatorContext";
import useGetCreatedStories from "../../../hooks/tanstack/queryHooks/useGetCreatedStories";
import defaultStyles from "../../../styles";
import { filterStoriesByTitle } from "../../../utils/utils";
import { BookReading } from "./ContinueReading";
export type KidsLibraryNavigatorRouteProp = RouteProp<
  KidsLibraryNavigatorParamList,
  "myCreations"
>;

export default function MyCreations() {
  const { childId } = useKidNavigator();
  const [searchText, setSearchText] = useState("");
  const { data: createdStories } = useGetCreatedStories(childId!);
  const navigation = useNavigation<KidsLibraryNavigatorProps>();

  const filteredCreatedStories = useMemo(
    () => filterStoriesByTitle(createdStories || [], searchText),
    [createdStories, searchText]
  );

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
        className="gap-y-5 space-y-5 mx-4"
      >
        {createdStories?.length! > 0 && (
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

        {createdStories?.length === 0 || !createdStories ? (
          <Text
            className="mt-4 mx-auto"
            style={[defaultStyles.defaultText, { color: "#fff", fontSize: 14 }]}
          >
            You have no stories in your continue reading list yet
          </Text>
        ) : (
          <>
            {filteredCreatedStories?.length === 0 ? (
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
                {filteredCreatedStories?.map((story, i) => (
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
