import React, { Suspense } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import Icon from "../../../components/Icon";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useAuth from "../../../contexts/AuthContext";
import Avatar from "../../../components/Avatar";
import CustomButton from "../../../components/UI/CustomButton";
import { PALETTE, storyTrackerData } from "../../../data";
import ProgressBar from "../../../components/parents/ProgressBar";
import CategoryGrid from "../../../components/parents/CategoryGrid";
import useGetUserKids from "../../../hooks/tanstack/queryHooks/useGetUserKids";
import ChildBanners from "../../../components/parents/ChildBanners";
import useGetStoryCategories from "../../../hooks/tanstack/queryHooks/useGetsStoryCategories";
import type { Category as UICategory } from "../../../types/parents.types";
import { useNavigation } from "@react-navigation/native";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import { kidsProfileNavigatorProp } from "../../../Navigation/KidsProfileNavigator";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import ParentFooter from "../../../components/parents/ParentFooter";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import { Story } from "../../../hooks/tanstack/queryHooks/useGetStories";
import useGetRecommendedStories from "../../../hooks/tanstack/queryHooks/useGetRecommendedStories";
import ImageWithFallback from "../../../components/parents/ImageWithFallback";
import ErrorComponent from "../../../components/ErrorComponent";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";

type Kid = { id: string; name?: string };

type SimpleCategory = {
  id: string;
  name?: string;
  colour?: string;
  bg?: string;
};

const FALLBACK = require("../../../assets/parents/unseen-world.jpg");

const ParentHomeScreen = () => {
  const { user, isLoading } = useAuth();
  const nav = useNavigation<ParntHomeNavigatorProp>();
  const navigator = useNavigation<ParentsNavigatorProp>();

  const handleCategoryPress = (cat: { id: string | number; name?: string }) => {
    nav.navigate("storiesList", {
      categoryId: String(cat.id),
      categoryName: cat.name,
    });
  };

  const handleViewCategories = () => {
    nav.navigate("categoriesList");
  };

  const {
    data: kidsData = [],
    isLoading: kidsLoading,
    isError: kidsIsError,
    error: kidsError,
    refetch: refetchKids,
  } = useGetUserKids();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <FlatList
      data={[]} // no vertical items
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
      }}
      ListHeaderComponent={() => (
        <View>
          {/* avatar row */}
          <View
            aria-labelledby="user avatar container"
            className="flex flex-row items-center gap-2 sticky top-0"
          >
            <View>
              <Avatar
                size={40}
                onPress={() =>
                  navigator.navigate("profile", { screen: "indexPage" })
                }
              />
            </View>
            <View className="flex flex-1 flex-col gap-y-1.5">
              <Text className="font-[abeezee] text-base">
                {user?.title} {user?.name}
              </Text>
              <Text className="font-[abeezee] text-[12px] text-[#616161]">
                {getGreeting()}
              </Text>
            </View>
            <Icon name="Bell" />
          </View>
          {/* Kids */}

          {/* kids loading / error */}
          {kidsLoading ? (
            <View style={{ marginVertical: 24 }}>
              <ActivityIndicator size="large" />
            </View>
          ) : kidsIsError ? (
            <ErrorComponent
              message={kidsError?.message ?? "Failed to load kids"}
              refetch={refetchKids}
            />
          ) : (
            <>
              {/* If there are kids: show KidsSection + StoryTracker */}
              {Array.isArray(kidsData) && kidsData.length > 0 ? (
                <>
                  <Suspense fallback={<ActivityIndicator size="large" />}>
                    <KidsSection />
                  </Suspense>

                  <Suspense fallback={<ActivityIndicator size="large" />}>
                    <StoryTrackerSection
                      handleCategoryPress={handleCategoryPress}
                    />
                  </Suspense>
                </>
              ) : (
                /* No kids: show Suggested stories */
                <Suspense fallback={<ActivityIndicator size="large" />}>
                  <SuggestedStoriesSection />
                </Suspense>
              )}
            </>
          )}

          {/* Categories */}
          <Suspense
            fallback={
              <View style={{ marginVertical: 24 }}>
                <ActivityIndicator size="large" />
              </View>
            }
          >
            <CategoriesSection
              onCategoryPress={handleCategoryPress}
              onViewCategories={handleViewCategories}
            />
          </Suspense>

          {/* Footer */}
          <ParentFooter />

          {/* global overlay if auth/user-level load */}
          <LoadingOverlay visible={isLoading} />
        </View>
      )}
      renderItem={null}
      keyExtractor={() => "empty"}
    />
  );
};

export default ParentHomeScreen;

const KidsSection: React.FC = () => {
  const {
    data: kidsData = [],
    isLoading: kidsLoading,
    isError: kidsIsError,
    error: kidsError,
    refetch: refetchKids,
  } = useGetUserKids();

  const kids = Array.isArray(kidsData)
    ? kidsData.map((k: any) => ({
        id: k.id,
        name: k.name,
        registered: !!k.registered,
        subtitle: k.subtitle,
        days: k.days ?? ["Sun", "Mon", "Tue", "Wed"],
      }))
    : [];

  if (kidsIsError) {
    return (
      <View className="flex-1 p-4 bg-white">
        <ErrorMessageDisplay
          errorMessage={kidsError?.message ?? "Failed to load children."}
        />
        <CustomButton text="Retry" onPress={() => refetchKids?.()} />
      </View>
    );
  }

  return (
    <View className="flex my-7 max-w-screen-md mx-auto w-full">
      <ChildBanners kids={kids} />
    </View>
  );
};

const StoryTrackerSection: React.FC<{
  handleCategoryPress: (c: any) => void;
}> = ({ handleCategoryPress }) => {
  const {
    data: kidsData = [],
    isLoading: kidsLoading,
    isError: kidsIsError,
    error: kidsError,
    refetch: refetchKids,
  } = useGetUserKids();

  const categoriesQuery = useGetStoryCategories();
  const categories = categoriesQuery.data ?? [];
  const catsIsLoading = Boolean(categoriesQuery?.isLoading);
  const catsIsError = Boolean(categoriesQuery?.isError);
  const catsError = (categoriesQuery as any)?.error;

  if (kidsIsError) {
    return (
      <View className="flex-1 p-4 bg-white">
        <ErrorMessageDisplay
          errorMessage={kidsError?.message ?? "Failed to load children."}
        />
        <CustomButton text="Retry" onPress={() => refetchKids?.()} />
      </View>
    );
  }

  if (catsIsError) {
    return (
      <View className="flex-1 p-4 bg-white">
        <ErrorMessageDisplay
          errorMessage={catsError?.message ?? "Failed to load categories."}
        />
        <CustomButton
          text="Retry"
          onPress={() => (categoriesQuery as any)?.refetch?.()}
        />
      </View>
    );
  }

  // map categories to UI category
  const apiCats = Array.isArray(categories)
    ? categories
    : ((categoriesQuery as any)?.data ?? []);
  const uiCategories: UICategory[] = apiCats.map((c: any, i: number) => {
    const match = PALETTE.find(
      (p) => p.name.toLowerCase() === (c.name ?? "").toLowerCase()
    );
    const pick = match ?? PALETTE[i % PALETTE.length];
    return {
      id: String(c.id ?? pick.id ?? i),
      name: c.name ?? pick.name,
      colour: pick.colour,
      bg: pick.bg,
      image: (c as any).image ?? undefined,
      description: (c as any).description ?? undefined,
    } as unknown as UICategory;
  });

  const kids = Array.isArray(kidsData)
    ? kidsData.map((k: any) => ({ id: k.id, name: k.name }))
    : [];

  return (
    <View
      aria-labelledby="Child’s Story Tracker"
      className="flex flex-col gap-y-2 mt-6"
    >
      <View className="flex flex-row justify-between items-center">
        <Text className="text-xl font-[quilka]">Child’s Story Tracker</Text>
        <Text className="font-[abeezee] text-base text-link">View all</Text>
      </View>
      <HorizontalList categories={uiCategories} kids={kids} />
    </View>
  );
};

const CategoriesSection: React.FC<{
  onCategoryPress: (c: any) => void;
  onViewCategories: () => void;
}> = ({ onCategoryPress, onViewCategories }) => {
  const categoriesQuery = useGetStoryCategories();
  const categories = categoriesQuery.data ?? [];
  const catsLoading = Boolean(categoriesQuery?.isLoading);
  const catsIsError = Boolean(categoriesQuery?.isError);
  const catsError = (categoriesQuery as any)?.error;

  if (catsIsError) {
    return (
      <View className="flex-1 p-4 bg-white">
        <ErrorMessageDisplay
          errorMessage={catsError?.message ?? "Failed to load categories."}
        />
        <CustomButton
          text="Retry"
          onPress={() => (categoriesQuery as any)?.refetch?.()}
        />
      </View>
    );
  }

  const apiCats = Array.isArray(categories)
    ? categories
    : ((categoriesQuery as any)?.data ?? []);
  const uiCategories = apiCats.slice(0, 8).map((c: any, i: number) => {
    const match = PALETTE.find(
      (p) => p.name.toLowerCase() === (c.name ?? "").toLowerCase()
    );
    const pick = match ?? PALETTE[i % PALETTE.length];
    return {
      id: String(c.id ?? pick.id ?? i),
      name: c.name ?? pick.name,
      colour: pick.colour,
      bg: pick.bg,
      image: (c as any).image ?? undefined,
      description: (c as any).description ?? undefined,
    } as unknown as UICategory;
  });

  return (
    <View
      aria-labelledby="Categories"
      className="flex flex-col max-w-screen-md flex-1 mx-auto w-full gap-y-2 mt-7"
    >
      <CategoryGrid
        categories={uiCategories}
        onCategoryPress={(idOrCat) => {
          if (typeof idOrCat === "object") {
            onCategoryPress(idOrCat as any);
          } else {
            const clicked = uiCategories.find(
              (c: SimpleCategory) => String(c.id) === String(idOrCat)
            );
            if (clicked) onCategoryPress(clicked);
          }
        }}
        onViewAll={onViewCategories}
      />
    </View>
  );
};

const HorizontalList: React.FC<{
  categories: { name?: string; colour?: string; bg?: string }[];
  kids: { id: string; name: string }[];
}> = ({ categories, kids }) => {
  // Instead of using storyTrackerData directly,
  // we duplicate each storyTrackerData item for every kid.
  const expandedData = kids.flatMap((kid) =>
    storyTrackerData.map((story) => ({
      ...story,
      kidId: kid.id,
      kidName: kid.name,
    }))
  );

  return (
    <FlatList
      horizontal
      data={expandedData}
      keyExtractor={(item) => `${item.id}-${item.kidId}`}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        const matched = categories.find((c) => c.name === item.category);
        const bgColor = matched?.bg ?? "#fff";
        const textColor = matched?.colour ?? "#000";

        const progressFraction = (() => {
          const n = Number(item.progress);
          if (Number.isNaN(n)) return 0;
          return n > 1 ? Math.min(n / 100, 1) : Math.max(Math.min(n, 1), 0);
        })();

        return (
          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3.5,
              elevation: 4,
            }}
            className="w-[250px] h-100 sm:h-[250px] sm:w-[250px] mr-[16px] my-2 rounded-2xl bg-white"
          >
            <Image
              source={item.source}
              className="w-full h-60 rounded-t-2xl"
              style={{ resizeMode: "cover" }}
            />

            <View className="p-4">
              <Text
                style={{
                  color: textColor,
                  fontFamily: "abeezee",
                  backgroundColor: bgColor,
                  alignSelf: "flex-start",
                }}
                className="px-6 py-2 w-fit inline rounded-full"
              >
                {item.category}
              </Text>

              <Text className="text-lg font-[abeezee] mt-2">{item.name}</Text>

              <Text className="text-text text-base font-[abeezee] mt-4">
                {item.kidName}'s progress
              </Text>

              <Text className="text-text font-[abeezee] mt-2">
                {item.progress}%
              </Text>

              <ProgressBar progress={progressFraction} color={textColor} />
            </View>
          </View>
        );
      }}
    />
  );
};

const SuggestedStoriesSection: React.FC = () => {
  const nav = useNavigation<ParntHomeNavigatorProp>();
  const storiesQuery = useGetRecommendedStories(50);

  const isLoading = Boolean((storiesQuery as any)?.isLoading);
  const isError = Boolean((storiesQuery as any)?.isError);
  const allStories: Story[] = Array.isArray(storiesQuery)
    ? (storiesQuery as Story[])
    : ((storiesQuery as any)?.data ?? []);

  // pick random 10
  const pickRandom = (arr: Story[], n = 10) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, Math.min(n, copy.length));
  };

  const suggestions = pickRandom(allStories, 10);

  if (isLoading) {
    return (
      <View className="py-6 items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="py-6 px-4 bg-white rounded-md">
        <Text className="font-[abeezee]">
          Failed to load story suggestions.
        </Text>
      </View>
    );
  }

  if (!suggestions.length) {
    return null;
  }

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center px-1 mb-3">
        <Text className="text-xl font-[quilka]">Suggested stories</Text>
        <Pressable onPress={() => nav.navigate("storiesList", {})}>
          <Text className="font-[abeezee] text-link">View all</Text>
        </Pressable>
      </View>

      <FlatList
        horizontal
        data={suggestions}
        keyExtractor={(s) => String((s as any).id)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
        renderItem={({ item }) => {
          // age -> choose palette index: 1-4 => 0, 5-8 => 1, 9-12 => 2, else fallback
          const ageMin = Number(item.ageMin ?? 1);
          const ageIndex =
            ageMin <= 4 ? 0 : ageMin <= 8 ? 1 : ageMin <= 12 ? 2 : -1;
          const ageMatch =
            (ageIndex >= 0 ? PALETTE[ageIndex % PALETTE.length] : null) ??
            PALETTE[ageMin % PALETTE.length || 0];

          const ageBg = ageMatch?.bg ?? "#F3F3F3";
          const ageColor = ageMatch?.colour ?? "#333";
          return (
            <Pressable
              onPress={() => nav.navigate("storiesList", { storyId: item.id })}
              className="mr-4 w-[250px] bg-white rounded-2xl overflow-hidden"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <ImageWithFallback
                sourceUri={item.coverImageUrl}
                fallbackRequire={FALLBACK}
                className="w-full h-[250px] rounded-t-2xl"
                resizeMode="cover"
              />
              <View className="p-3 flex-col justify-between gap-1">
                <View className="flex-row gap-4 items-center">
                  <View
                    style={{ backgroundColor: ageBg }}
                    className="px-3 py-1 rounded-full"
                  >
                    <Text
                      style={{
                        color: ageColor,
                        fontFamily: "abeezee",
                        backgroundColor: ageBg,
                        alignSelf: "flex-start",
                      }}
                      className="text-sm rounded-full text-center"
                    >
                      {(item as any).categories
                        ? (item.categories as any[])
                            .map((c) => c.name)
                            .join(", ")
                        : ""}
                    </Text>
                  </View>
                  <View
                    style={{ backgroundColor: ageBg }}
                    className="px-3 py-1 rounded-full"
                  >
                    <Text
                      style={{ color: ageColor }}
                      className="font-[abeezee] text-sm"
                    >
                      {item.ageMin}-{item.ageMax} years
                    </Text>
                  </View>
                </View>

                <Text className="text-lg font-[abeezee] mt-1">
                  {item.title}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
};
