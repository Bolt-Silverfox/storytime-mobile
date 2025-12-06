import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ListRenderItem,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import useGetStory from "../../../hooks/tanstack/queryHooks/useGetStory";
import useGetParentFavorites, {
  ParentFavorite,
} from "../../../hooks/tanstack/queryHooks/useGetParentFavorites";
import { Story } from "../../../hooks/tanstack/queryHooks/useGetStories";
import ImageWithFallback from "../../../components/parents/ImageWithFallback";
import { Funnel, Heart, Search, X } from "lucide-react-native";
import useDeleteParentFavorite from "../../../hooks/tanstack/mutationHooks/useDeleteParentFavorite";
import useAddParentFavorite from "../../../hooks/tanstack/mutationHooks/useAddParentFavorites";
import { useNavigation } from "@react-navigation/native";
import StoryModeModal from "../../../components/modals/StoryModeModal";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";

type FavoriteItemRowProps = {
  favorite: ParentFavorite;
  isFavorited?: boolean;
  onPress?: (story: Story | null) => void;
  searchQuery?: string;
  selectedAge?: AgeRangeKey;
};

const FALLBACK = require("../../../assets/parents/unseen-world.jpg");
type AgeRangeKey = "ALL" | "0-3" | "4-7" | "8-12";
const AGE_RANGES: {
  key: AgeRangeKey;
  label: string;
  min?: number;
  max?: number;
}[] = [
  { key: "ALL", label: "All" },
  { key: "0-3", label: "1 - 4 years", min: 1, max: 4 },
  { key: "4-7", label: "5 - 8 years", min: 5, max: 8 },
  { key: "8-12", label: "9 - 12 years", min: 9, max: 12 },
];

const FavoriteItemRow: React.FC<FavoriteItemRowProps> = ({
  favorite,
  isFavorited = true,
  onPress,
  searchQuery = "",
  selectedAge = "ALL",
}) => {
  // normalize favorite shape (supports plain object or { data: {...} })
  const fav: any = (favorite as any)?.data ?? favorite;
  const storyId = fav?.storyId ?? null;
  const [optimisticFav, setOptimisticFav] = useState<boolean>(
    Boolean(isFavorited)
  );

  useEffect(() => {
    setOptimisticFav(Boolean(isFavorited));
  }, [isFavorited]);

  const addFav = useAddParentFavorite();
  const deleteFav = useDeleteParentFavorite();

  const loading = addFav.status === "pending" || deleteFav.status === "pending";

  const toggleFavorite = () => {
    if (!storyId || loading) return;
    const prev = optimisticFav;
    setOptimisticFav(!prev);
    if (prev) {
      deleteFav.mutate(storyId, { onError: () => setOptimisticFav(prev) });
    } else {
      addFav.mutate(storyId, { onError: () => setOptimisticFav(prev) });
    }
  };

  const { data: storyResp, isLoading, error } = useGetStory(storyId);
  const story: Story | null =
    (storyResp as any)?.data ?? (storyResp as any) ?? null;

  const matchesFilters = (): boolean => {
    if (!story) return true;
    const q = (searchQuery ?? "").trim().toLowerCase();
    // If there's a search query, MATCH ACROSS ALL FAVORITES (ignore age filter)
    if (q.length > 0) {
      const title = (story.title ?? "").toString().toLowerCase();
      return title.includes(q);
    }

    // Age range filter
    const range = AGE_RANGES.find((r) => r.key === selectedAge);
    if (!range || range.key === "ALL") return true;

    // If story has ageMin/ageMax fields, use them. Otherwise show it.
    const ageMin = typeof story.ageMin === "number" ? story.ageMin : undefined;
    const ageMax = typeof story.ageMax === "number" ? story.ageMax : undefined;
    if (ageMin == null && ageMax == null) return true;

    // If either min or max is missing, use the one available
    const sMin = ageMin ?? ageMax ?? 0;
    const sMax = ageMax ?? ageMin ?? 100;

    if (range.min != null && range.max != null) {
      // overlap test: ranges overlap if sMin <= range.max && sMax >= range.min
      return sMin <= (range.max ?? sMax) && sMax >= (range.min ?? sMin);
    }

    return true;
  };

  if (isLoading) {
    return (
      <View className="flex-row items-center p-3 bg-white rounded-xl shadow-sm">
        <ActivityIndicator />
        <Text className="ml-3 text-sm">Loading story...</Text>
      </View>
    );
  }

  if (error || !story) {
    return (
      <View className="flex-row items-center p-3 bg-white rounded-xl shadow-sm">
        <Text className="ml-3 text-sm text-red-600">Failed to load story</Text>
      </View>
    );
  }

  if (!matchesFilters()) return null;

  return (
    <Pressable
      className="flex-row items-center gap-4 p-3 bg-white rounded-xl shadow-sm"
      style={{
        borderRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
      }}
      onPress={() => onPress?.(story)}
    >
      <ImageWithFallback
        sourceUri={story.coverImageUrl}
        fallbackRequire={FALLBACK}
        className="w-[50%] h-full aspect-square rounded-2xl"
        resizeMode="cover"
      />
      {/* </View> */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">
          {story.title ?? "Untitled story"}
        </Text>
        <Text
          className="text-base text-text mt-1"
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {story.description}
        </Text>
        <Text className="text-sm text-text mt-1">Written by: Samuel Liu</Text>
        <Text className="text-sm text-text mt-1">
          {story.ageMin} - {story.ageMax} years
        </Text>

        <View className="self-end rounded-full pr-2 pb-2">
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <TouchableOpacity
              onPress={toggleFavorite}
              // hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View>
                {optimisticFav ? (
                  <Image
                    source={require("../../../assets/parents/favorite.png")}
                  />
                ) : (
                  <Heart size={24} color="#000" />
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const FavoritesScreen: React.FC = () => {
  const {
    data: rawFavorites = [],
    isLoading,
    error,
    refetch,
  } = useGetParentFavorites();

  const favorites: ParentFavorite[] =
    (rawFavorites as any)?.data ?? (rawFavorites as any) ?? [];

  const [refreshing, setRefreshing] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedAge, setSelectedAge] = useState<AgeRangeKey>("ALL");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const nav = useNavigation<ParentsNavigatorProp>();
  const [showModeModal, setShowModeModal] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const openStory = (story: Story | null) => {
    if (!story) return;
    setSelectedStoryId(story.id ?? null);
    setShowModeModal(true);
  };

  const handleModalSelect = (
    mode: "plain" | "interactive",
    storyId: string
  ) => {
    setShowModeModal(false);
    setSelectedStoryId(null);

    const routeName = mode === "plain" ? "plainStories" : "interactiveStories";
    nav.navigate("home" as any, {
      screen: routeName,
      params: { storyId, mode },
    });
  };

  const renderItem: ListRenderItem<ParentFavorite> = ({ item }) => (
    <FavoriteItemRow
      favorite={item}
      onPress={openStory}
      searchQuery={searchQuery}
      selectedAge={selectedAge}
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <ErrorMessageDisplay errorMessage={error.message} />
        <TouchableOpacity onPress={() => refetch()}>
          <Text className="text-blue-500 mt-2">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!favorites.length) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-lg font-semibold mb-2">No favorites yet</Text>
        <Text className="text-sm text-gray-500 text-center">
          Tap the star on a story to add it to favorites.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* HEADER */}
      <View className="p-4 flex-row items-center justify-between gap-4 bg-[#FFFCFB]">
        <Text className="text-xl font-[abeezee]">Favorites</Text>
        <View className="flex-row gap-6">
          <Pressable
            onPress={() => {
              setShowFilter((s) => !s);
              // hide search when opening filter
              setShowSearch(false);
            }}
            hitSlop={8}
          >
            <Funnel />
          </Pressable>
          <Pressable
            onPress={() => {
              setShowSearch((s) => !s);
              // hide filter when opening search
              setShowFilter(false);
              if (showSearch) setSearchQuery(""); // clear when hiding
            }}
            hitSlop={8}
          >
            <Search />
          </Pressable>
        </View>
      </View>

      <View className="flex-1">
        <FlatList
          data={favorites}
          keyExtractor={(f) =>
            String((f as any).id ?? (f as any)?._id ?? JSON.stringify(f))
          }
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            paddingTop: 16,
          }}
          ListHeaderComponent={
            <View>
              {/* FILTER BAR INSIDE FLATLIST */}
              {showFilter && (
                <View className="py-3 flex-row flex-wrap items-center gap-3">
                  {AGE_RANGES.map((r) => {
                    const active = r.key === selectedAge;
                    return (
                      <Pressable
                        key={r.key}
                        onPress={() => setSelectedAge(r.key)}
                        className={`px-4 py-2 rounded-full ${
                          active ? "bg-[#4807EC]" : ""
                        } ${active ? "" : "border"}`}
                      >
                        <Text className={active ? "text-white" : "text-black"}>
                          {r.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {/* SEARCH BAR INSIDE FLATLIST */}
              {showSearch && (
                <View className="py-4">
                  <View className="flex-row items-center gap-2 rounded-full border p-3">
                    {/* Left search icon */}
                    <Search size={24} color="#555" />

                    {/* Text input */}
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search..."
                      className="flex-1 items-center ml-2 text-xl pb-1 leading-[24px]"
                      placeholderTextColor="#555"
                      returnKeyType="search"
                    />

                    {/* Right clear (×) button */}
                    {searchQuery.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setSearchQuery("")}
                        className="mr-2"
                      >
                        <X size={24} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      </View>
      <StoryModeModal
        visible={showModeModal}
        storyId={selectedStoryId}
        onClose={() => setShowModeModal(false)}
        onSelect={handleModalSelect}
      />
    </View>
  );
};

export default FavoritesScreen;
