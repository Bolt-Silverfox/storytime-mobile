// screens/parents/StoriesListScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import useGetUserKids from "../../../hooks/tanstack/queryHooks/useGetUserKids";
import useGetStories, {
  Story,
} from "../../../hooks/tanstack/queryHooks/useGetStories";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import {
  ParentHomeNavigatorParamList,
  ParntHomeNavigatorProp,
} from "../../../Navigation/ParentHomeNavigator";
import { ChevronLeft, Funnel, Heart, Search } from "lucide-react-native";
import CustomButton from "../../../components/UI/CustomButton";
import ParentFooter from "../../../components/parents/ParentFooter";
import StoryModeModal from "../../../components/modals/StoryModeModal";
import useAddFavorites from "../../../hooks/tanstack/mutationHooks/useAddFavorites";
import ImageWithFallback from "../../../components/parents/ImageWithFallback";
import ChildrenEmptyState from "../../../components/emptyState/ChildrenEmptyState";
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";

type StoriesRouteProp = RouteProp<ParentHomeNavigatorParamList, "storiesList">;

const StoriesListScreen: React.FC = () => {
  const route = useRoute<StoriesRouteProp>();
  const { categoryId, categoryName, kidId: passedKidId } = route.params ?? {};
  const nav = useNavigation<ParntHomeNavigatorProp>();
  const [imgFailed, setImgFailed] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<number | null>(1);
  const [showModeModal, setShowModeModal] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const {
    data: kids = [],
    isPending: kidsLoading,
    error: kidsError,
  } = useGetUserKids();
  const addFavoriteMutation = useAddFavorites();

  const chosenKidId = passedKidId ?? kids[0]?.id ?? undefined;

  if (kidsLoading)
    return <LoadingOverlay visible label="Loading children..." />;
  if (kidsError)
    return <ErrorComponent message={kidsError.message} refetch={() => {}} />;

  if (!chosenKidId) {
    return (
      <ChildrenEmptyState
        navigate={() =>
          nav.navigate("profile" as any, {
            screen: "addChild",
          })
        }
      />
    );
  }

  const storiesResult = useGetStories(String(chosenKidId));
  const FALLBACK = require("../../../assets/parents/unseen-world.jpg");

  // normalize to an array and optional loading/error flags
  const stories: Story[] = Array.isArray(storiesResult)
    ? (storiesResult as Story[])
    : ((storiesResult?.data as Story[]) ?? []);

  const isLoadingStories =
    !Array.isArray(storiesResult) &&
    (Boolean((storiesResult as any)?.isLoading) ||
      Boolean((storiesResult as any)?.isFetching));

  const storiesError = !Array.isArray(storiesResult)
    ? (storiesResult as any)?.error
    : null;

  if (isLoadingStories)
    return <LoadingOverlay visible label="Loading stories..." />;
  if (storiesError)
    return (
      <ErrorComponent
        message={String(storiesError?.message ?? storiesError)}
        refetch={() => {}}
      />
    );

  //Fixed filter logic: return true when no category filter
  const filtered = (stories ?? []).filter((s: any) => {
    if (categoryId) {
      if (Array.isArray(s.categories)) {
        return s.categories.some(
          (c: any) => String(c.id) === String(categoryId)
        );
      }
      if (s.categoryId) return String(s.categoryId) === String(categoryId);
      if (categoryName && s.category)
        return String(s.category) === String(categoryName);
      return false;
    }

    if (categoryName) {
      if (Array.isArray(s.categories)) {
        return s.categories.some(
          (c: any) =>
            String(c.name).toLowerCase() === String(categoryName).toLowerCase()
        );
      }
      if (s.category)
        return (
          String(s.category).toLowerCase() ===
          String(categoryName).toLowerCase()
        );
      return false;
    }

    return true;
  });

  // finalStories is filtered by difficulty (if selected)
  let finalStories = filtered;
  if (difficultyFilter) {
    finalStories = finalStories.filter(
      (s) => s.difficultyLevel === difficultyFilter
    );
  }

  const getDifficultyLabel = (level: number) => {
    if (level === 1) return "1–4";
    if (level === 2) return "5–8";
    if (level === 3) return "9–12";
    return "";
  };

  return (
    <FlatList
      data={[]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40, backgroundColor: "#fff" }}
      ListHeaderComponent={() => (
        <>
          {/* Header image */}
          <ImageBackground
            source={require("../../../assets/parents/unseen-world.jpg")}
            style={{ width: "100%", height: 240 }}
            imageStyle={{
              borderBottomLeftRadius: 36,
              borderBottomRightRadius: 36,
            }}
          >
            <View className="flex-row items-center justify-between mb-4 p-4">
              <View className="flex-row gap-4">
                <TouchableOpacity onPress={() => nav.goBack()}>
                  <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-xl font-[abeezee] text-white">
                  {categoryName ?? "Stories"}
                </Text>
              </View>
              <View className="flex-row gap-6">
                <Pressable>
                  <Funnel color="#fff" />
                </Pressable>
                <Pressable>
                  <Search color="#fff" />
                </Pressable>
              </View>
            </View>
          </ImageBackground>

          {/* Title */}
          <Text className="text-xl font-[abeezee] p-4 mt-2">
            {categoryName} Stories Top Picks
          </Text>

          {/* Horizontal carousel */}
          {filtered.length === 0 ? (
            <View className="items-center justify-center px-4 py-8">
              <Text className="font-[abeezee] text-lg text-text">
                No stories found for this category.
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
              keyExtractor={(s: any) => String(s.id)}
              renderItem={({ item }: { item: Story }) => {
                const handleToggleFavorite = () => {
                  if (!passedKidId) {
                    Alert.alert(
                      "Select child",
                      "Please select a child before adding favorites."
                    );
                    return;
                  }
                  if (!item?.id) {
                    console.warn("No story id available:", item);
                    return;
                  }
                  addFavoriteMutation.mutate(
                    { kidId: passedKidId, storyId: item.id },
                    {
                      onError: (err) => {
                        // optional per-call handling
                        console.warn("Add favorite failed", err);
                        Alert.alert("Could not add favorite");
                      },
                      onSuccess: () => {
                        Alert.alert("Story was successfully added to faves");
                      },
                    }
                  );
                };

                return (
                  <TouchableOpacity
                    className="mb-4 rounded-2xl bg-white shadow p-2 w-[300px] h-full mr-6"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.15,
                      shadowRadius: 3.5,
                      elevation: 4,
                      borderRadius: 20,
                    }}
                    onPress={() => {
                      setSelectedStoryId(item.id);
                      setShowModeModal(true);
                    }}
                  >
                    <View className="relative w-full">
                      <ImageWithFallback
                        sourceUri={item.coverImageUrl}
                        fallbackRequire={FALLBACK}
                        className="w-full h-[250px] rounded-2xl"
                        resizeMode="cover"
                      />

                      {/* Fav Icon */}
                      <TouchableOpacity
                        className="absolute top-2 right-2 p-4 rounded-full"
                        onPress={handleToggleFavorite}
                        style={{
                          shadowColor: "#000",
                          shadowOpacity: 0.2,
                          shadowRadius: 3,
                        }}
                      >
                        <Heart color="#fff" />
                      </TouchableOpacity>
                    </View>

                    <Text className="text-2xl font-[abeezee] mt-2 px-2">
                      {item.title}
                    </Text>

                    <Text className="font-[abeezee] text-lg mt-2 px-2">
                      {item.description}
                    </Text>
                    <Text className="font-[abeezee] text-lg mt-1 px-2">
                      Written by: Samuel Liu
                    </Text>
                    <Text className="text-base font-[abeezee] mt-2 px-2">
                      {getDifficultyLabel(item.difficultyLevel)} years
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {/* Difficulty Filter Buttons (under the cards) */}
          <View className="flex-col gap-4 px-4 mt-8 mb-2">
            <Text className="font-[abeezee] text-xl">Others</Text>
            <View className="flex-row gap-2 mb-2">
              {[1, 2, 3].map((level) => {
                const active = difficultyFilter === level;
                return (
                  <TouchableOpacity
                    key={level}
                    onPress={() =>
                      setDifficultyFilter((prev) =>
                        prev === level ? null : level
                      )
                    }
                    className={`flex-1 mx-1 py-3 items-center rounded-full ${active ? "bg-[#4807EC]" : "border border-text"}`}
                  >
                    <Text
                      className={`font-[abeezee] ${active ? "text-white" : "text-gray-700"}`}
                    >
                      {level === 1 && "1–4 years"}
                      {level === 2 && "5–8 years"}
                      {level === 3 && "9–12 years"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Difficulty section: show vertical list when a difficulty is selected */}
          {difficultyFilter ? (
            <>
              {finalStories.length === 0 ? (
                <View className="px-4 py-6">
                  <Text className="text-center font-[abeezee] text-gray-600">
                    No stories found for this difficulty level.
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={finalStories}
                  numColumns={2}
                  keyExtractor={(s: any) => String(s.id)}
                  scrollEnabled={false}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    paddingHorizontal: 16,
                  }}
                  contentContainerStyle={{ paddingBottom: 16, paddingTop: 8 }}
                  renderItem={({ item }) => {
                    const handleToggleFavorite = () => {
                      if (!passedKidId) {
                        Alert.alert(
                          "Select child",
                          "Please select a child before adding favorites."
                        );
                        return;
                      }
                      if (!item?.id) {
                        console.warn("No story id available:", item);
                        return;
                      }
                      addFavoriteMutation.mutate(
                        { kidId: passedKidId, storyId: item.id },
                        {
                          onError: (err) => {
                            // optional per-call handling
                            console.warn("Add favorite failed", err);
                            Alert.alert("Could not add favorite");
                          },
                          onSuccess: () => {
                            Alert.alert(
                              "Story was successfully added to faves"
                            );
                          },
                        }
                      );
                    };

                    return (
                      <TouchableOpacity
                        className="bg-white p-2 w-[48%] gap-1 justify-between mt-3"
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.12,
                          shadowRadius: 3,
                          elevation: 3,
                          borderRadius: 20,
                        }}
                        onPress={() => {
                          setSelectedStoryId(item.id);
                          setShowModeModal(true);
                        }}
                      >
                        <View className="relative w-full">
                          <ImageWithFallback
                            sourceUri={item.coverImageUrl}
                            fallbackRequire={FALLBACK}
                            className="w-full h-[120px] rounded-2xl"
                            resizeMode="cover"
                          />

                          {/* Fav Icon */}
                          <TouchableOpacity
                            className="absolute top-2 right-2 p-2 rounded-full"
                            onPress={handleToggleFavorite}
                            style={{
                              shadowColor: "#000",
                              shadowOpacity: 0.15,
                              shadowRadius: 3,
                              elevation: 3,
                            }}
                          >
                            <Heart size={18} color="#fff" />
                          </TouchableOpacity>
                        </View>

                        <Text className="text-sm font-[abeezee] px-2">
                          {getDifficultyLabel(item.difficultyLevel)} years
                        </Text>
                        <Text className="text-base font-[abeezee] px-2">
                          {item.title}
                        </Text>

                        <Text
                          className="text-text font-[abeezee] px-2"
                          numberOfLines={3}
                        >
                          {item.description}
                        </Text>
                        <Text className="font-[abeezee] text-text text-sm px-2 pb-2">
                          Written by: Samuel Liu
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </>
          ) : null}

          {/* Footer */}
          <ParentFooter />

          <StoryModeModal
            visible={showModeModal}
            onClose={() => setShowModeModal(false)}
            storyId={selectedStoryId}
          />
        </>
      )}
      renderItem={() => null}
      keyExtractor={() => "empty"}
    />
  );
};

export default StoriesListScreen;
