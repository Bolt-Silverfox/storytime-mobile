// screens/parents/StoriesListScreen.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import useGetUserKids from "../../../hooks/tanstack/queryHooks/useGetUserKids";
import useGetStories, { Story } from "../../../hooks/tanstack/queryHooks/useGetStories";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import { ParentHomeNavigatorParamList, ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";

type StoriesRouteProp = RouteProp<ParentHomeNavigatorParamList, "storiesList">;

const StoriesListScreen: React.FC = () => {
  const route = useRoute<StoriesRouteProp>();
  const { categoryId, categoryName, kidId: passedKidId } = route.params ?? {};
  const nav = useNavigation<ParntHomeNavigatorProp>();

  // get kids to pick a kid if not supplied
  const { data: kids = [], isPending: kidsLoading, error: kidsError } = useGetUserKids();
  const chosenKidId = passedKidId ?? (kids[0]?.id ?? undefined);

  if (kidsLoading) return <LoadingOverlay visible label="Loading children..." />;
  if (kidsError)
    return <ErrorComponent message={kidsError.message} refetch={() => {}} />;

  if (!chosenKidId) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-white">
        <Text>No child selected — add a child first.</Text>
      </View>
    );
  }

  const storiesResult = useGetStories(String(chosenKidId));

  // normalize to an array and optional loading/error flags
  const stories: Story[] = Array.isArray(storiesResult)
    ? (storiesResult as Story[])
    : (storiesResult?.data as Story[]) ?? [];

  const isLoadingStories =
    !Array.isArray(storiesResult) &&
    (Boolean((storiesResult as any)?.isLoading) || Boolean((storiesResult as any)?.isFetching));

  const storiesError = !Array.isArray(storiesResult) ? (storiesResult as any)?.error : null;

  if (isLoadingStories) return <LoadingOverlay visible label="Loading stories..." />;
  if (storiesError)
    return <ErrorComponent message={String(storiesError?.message ?? storiesError)} refetch={() => {}} />;

  // Filter logic (supports common server shapes):
  // - story.categories = [{ id, name }, ...]
  // - story.categoryId or story.category (string)
  const filtered = (stories ?? []).filter((s: any) => {
    if (categoryId) {
      if (Array.isArray(s.categories)) {
        return s.categories.some((c: any) => String(c.id) === String(categoryId));
      }
      if (s.categoryId) return String(s.categoryId) === String(categoryId);
      if (categoryName && s.category) return String(s.category) === String(categoryName);
      return false;
    }

    if (categoryName) {
      if (Array.isArray(s.categories)) {
        return s.categories.some((c: any) => String(c.name).toLowerCase() === String(categoryName).toLowerCase());
      }
      if (s.category) return String(s.category).toLowerCase() === String(categoryName).toLowerCase();
    }

    return false;
  });

  return (
    <View className="flex-1 bg-white p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => nav.goBack()}>
          <Text className="text-base">Back</Text>
        </TouchableOpacity>
        <Text className="text-lg font-['quilka']">{categoryName ?? "Stories"}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Empty */}
      {filtered.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text>No stories found for this category.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(s: any) => String(s.id)}
          renderItem={({ item }: { item: Story }) => (
            <TouchableOpacity
              className="mb-4 rounded-lg bg-white shadow p-3"
              onPress={() => nav.navigate("childStoryDetails", { storyId: item.id })}
            >
              {item.coverImageUrl ? (
                <Image
                  source={{ uri: item.coverImageUrl }}
                  style={{ width: "100%", height: 160, borderRadius: 8 }}
                />
              ) : null}
              <Text className="text-base font-['quilka'] mt-2">{item.title}</Text>
              {item.description ? (
                <Text className="text-sm text-gray-600 mt-1">{item.description}</Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default StoriesListScreen;
