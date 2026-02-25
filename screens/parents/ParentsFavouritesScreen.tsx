import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import CustomEmptyState from "../../components/emptyState/CustomEmptyState";
import ErrorComponent from "../../components/ErrorComponent";
import FavouriteStoryItem from "../../components/FavouriteStoryItem";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import FavouriteStoriesModal from "../../components/modals/FavouriteStoryModal";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";
import queryParentsFavourites from "../../hooks/tanstack/queryHooks/queryParentFavourites";
import useRefreshControl from "../../hooks/others/useRefreshControl";
import { AgeGroupType, FavouriteStory } from "../../types";

type AgeFilter = AgeGroupType | "ALL";
type AgeRangeFilter =
  | { key: "ALL"; label: string }
  | { key: AgeGroupType; label: string; min: number; max: number };

const AGE_FILTERS: readonly AgeRangeFilter[] = [
  { key: "ALL", label: "All" },
  { key: "1-3", label: "1 – 3 years", min: 1, max: 3 },
  { key: "4-6", label: "4 – 6 years", min: 4, max: 6 },
  { key: "7-9", label: "7 – 9 years", min: 7, max: 9 },
  { key: "10-12", label: "10 – 12 years", min: 10, max: 12 },
] as const;

const ParentsFavouritesScreen = () => {
  const { data, isPending, error, refetch } = useQuery(
    queryParentsFavourites()
  );
  const { refreshing, onRefresh } = useRefreshControl(refetch);

  const [activeItem, setActiveItem] = useState<FavouriteStory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterOption, setActiveFilterOption] = useState<
    "search" | "age" | null
  >(null);
  const [selectedAge, setSelectedAge] = useState<AgeFilter>("ALL");

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (isPending) return <LoadingOverlay visible />;

  const favourites = data ?? [];
  const filteredStories = favourites.filter((story) => {
    const q = searchQuery.trim().toLowerCase();

    if (q.length > 0) {
      return story.title.toLowerCase().includes(q);
    }

    if (selectedAge === "ALL") return true;

    const filter = AGE_FILTERS.find(
      (f): f is Extract<AgeRangeFilter, { min: number }> =>
        f.key === selectedAge && "min" in f && "max" in f
    );

    if (!filter) return true;

    const [sMin, sMax] = story.ageRange.split("-").map(Number);

    return sMin <= filter.max && sMax >= filter.min;
  });

  const showNoData = favourites.length === 0;
  const showNoMatches = favourites.length > 0 && filteredStories.length === 0;

  const resetFilters = () => {
    setSelectedAge("ALL");
    setSearchQuery("");
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 bg-bgLight">
        <View className="flex flex-row items-center justify-between border-b border-b-border-lighter bg-white px-4 pb-5 pt-2">
          <Text className="flex-1 font-[abeezee] text-xl text-black">
            Favourites
          </Text>
          <View className="flex flex-row items-center gap-x-5">
            <Icon
              name={activeFilterOption === "age" ? "X" : "Funnel"}
              onPress={() => {
                setActiveFilterOption((a) => (a === "age" ? null : "age"));
                resetFilters();
              }}
              color={activeFilterOption === "age" ? "red" : "black"}
            />
            <Icon
              name={activeFilterOption === "search" ? "X" : "Search"}
              onPress={() => {
                setActiveFilterOption((a) =>
                  a === "search" ? null : "search"
                );
                resetFilters();
              }}
              color={activeFilterOption === "search" ? "red" : "black"}
            />
          </View>
        </View>
        {activeFilterOption === "age" && (
          <View className="py-3">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="flex-row gap-x-2 px-4"
            >
              {AGE_FILTERS.map((age) => {
                const active = age.key === selectedAge;

                return (
                  <Pressable
                    key={age.key}
                    onPress={() => setSelectedAge(age.key)}
                    className={`h-10 items-center justify-center rounded-full px-6 ${
                      active ? "bg-blue" : "border border-border bg-white"
                    }`}
                  >
                    <Text
                      className={`font-[abeezee] text-base ${
                        active ? "text-white" : "text-text"
                      }`}
                    >
                      {age.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}
        {activeFilterOption === "search" && (
          <View className=" px-4 py-3 ">
            <View className="flex-row items-center rounded-full border px-4 py-1">
              <Icon name="Search" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search favourites..."
                placeholderTextColor="#666"
                className="flex-1 font-[abeezee] text-base"
                returnKeyType="search"
              />

              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Text className="px-2 text-lg">✕</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* BODY */}
        <ScrollView
          contentContainerClassName="flex flex-1 flex-col pb-10 gap-y-4 my-6 px-4"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {showNoData ? (
            <CustomEmptyState
              url={require("../../assets/images/favourites-empty-state.png")}
              message="No Favourites added yet"
              secondaryMessage="You do not have any favourite stories added yet"
            />
          ) : showNoMatches ? (
            <CustomEmptyState
              url={require("../../assets/images/favourites-empty-state.png")}
              message="No matching favourites"
              secondaryMessage="Try changing filters or search"
            />
          ) : (
            filteredStories.map((story) => (
              <FavouriteStoryItem
                key={story.id}
                story={story}
                setActiveStory={setActiveItem}
              />
            ))
          )}
        </ScrollView>
        {activeItem && (
          <FavouriteStoriesModal
            isOpen={activeItem !== null}
            onClose={() => setActiveItem(null)}
            story={activeItem}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default ParentsFavouritesScreen;
