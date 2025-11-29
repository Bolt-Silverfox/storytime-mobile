import React, { Suspense } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import Icon from "../../../components/Icon";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useAuth from "../../../contexts/AuthContext";
import Avatar from "../../../components/Avatar";
import CustomButton from "../../../components/UI/CustomButton";
import { storyTrackerData } from "../../../data";
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

type Kid = { id: string; name?: string };

type SimpleCategory = {
  id: string;
  name?: string;
  colour?: string;
  bg?: string;
};

const PALETTE = [
  { id: 1, name: "Adventure", colour: "#039222", bg: "#CDFBD7" },
  { id: 2, name: "Coming of Age", colour: "#925403", bg: "#FBE5CD" },
  { id: 3, name: "Courage/Bravery", colour: "#926903", bg: "#FBF9CD" },
  { id: 4, name: "Mystery", colour: "#008D81", bg: "#CDFBF7" },
  { id: 5, name: "Fantasy", colour: "#5B007C", bg: "#EFCDFB" },
  { id: 6, name: "Love & Family", colour: "#039222", bg: "#CDFBD7" },
  { id: 7, name: "Transformation", colour: "#925403", bg: "#FBE5CD" },
  { id: 8, name: "Honesty", colour: "#926903", bg: "#FBF9CD" },
];

const ParentHomeScreen = () => {
  const { user, isLoading } = useAuth();
  const nav = useNavigation<ParntHomeNavigatorProp>();
  const navigator = useNavigation<ParentProfileNavigatorProp>();

  const handleCategoryPress = (cat: { id: string | number; name?: string }) => {
    nav.navigate("storiesList", {
      categoryId: String(cat.id),
      categoryName: cat.name,
    });
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
                onPress={() => navigator.navigate("indexPage")}
              />
            </View>
            <View className="flex flex-1 flex-col gap-y-1.5">
              <Text className="font-[abeezee] text-base">
                {user?.title} {user?.name}
              </Text>
              <Text className="font-[abeezee] text-[12px] text-[#616161]">
                Good Morning
              </Text>
            </View>
            <Icon name="Bell" />
          </View>
          {/* Kids */}
          <Suspense
            fallback={
              <View style={{ marginVertical: 24 }}>
                <ActivityIndicator size="large" />
              </View>
            }
          >
            <KidsSection />
          </Suspense>

          {/* Story tracker */}
          <Suspense
            fallback={
              <View style={{ marginVertical: 24 }}>
                <ActivityIndicator size="large" />
              </View>
            }
          >
            <StoryTrackerSection handleCategoryPress={handleCategoryPress} />
          </Suspense>

          {/* Categories */}
          <Suspense
            fallback={
              <View style={{ marginVertical: 24 }}>
                <ActivityIndicator size="large" />
              </View>
            }
          >
            <CategoriesSection onCategoryPress={handleCategoryPress} />
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
    <View className="flex flex-col gap-y-2 my-7 max-w-screen-md mx-auto w-full">
      <Text className="text-xl font-[quilka]">Daily Challenge</Text>
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

const CategoriesSection: React.FC<{ onCategoryPress: (c: any) => void }> = ({
  onCategoryPress,
}) => {
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
  const uiCategories = apiCats.map((c: any, i: number) => {
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
        onViewAll={() => {
          console.log("View all pressed");
        }}
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
            className="w-[300px] h-100 sm:h-[250px] sm:w-[250px] mr-6 my-2 rounded-2xl bg-white"
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
