import { FlatList, Image, ScrollView, Text, View } from "react-native";
import Icon from "../../../components/Icon";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useAuth from "../../../contexts/AuthContext";
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

type Kid = { id: string; name?: string };

const ParentHomeScreen = () => {
  const { user, isLoading } = useAuth();
  const { data: kidsData = [] } = useGetUserKids();
  const categoriesQuery = useGetStoryCategories();
  const categories = categoriesQuery.data ?? [];

  const kids = kidsData.map((k: any) => ({
    id: k.id,
    name: k.name,
    registered: !!k.registered,
    subtitle: k.subtitle,
    days: k.days ?? ["Sun", "Mon", "Tue", "Wed"],
  }));

  const PALETTE = [
    { id: 1, name: "Adventure", colour: "#039222", bg: "#99CDA5" },
    { id: 2, name: "Coming of Age", colour: "#925403", bg: "#FBE5CD" },
    { id: 3, name: "Courage/Bravery", colour: "#926903", bg: "#FBF9CD" },
    { id: 4, name: "Mystery", colour: "#008D81", bg: "#CDFBF7" },
    { id: 5, name: "Fantasy", colour: "#5B007C", bg: "#EFCDFB" },
    { id: 6, name: "Love & Family", colour: "#039222", bg: "#99CDA5" },
    { id: 7, name: "Transformation", colour: "#925403", bg: "#FBE5CD" },
    { id: 8, name: "Honesty", colour: "#926903", bg: "#FBF9CD" },
  ];

  const apiCats = Array.isArray(categories)
    ? categories
    : categoriesQuery?.data;
  // map API -> UI Category shape expected by CategoryGrid
  const uiCategories: UICategory[] = apiCats.map((c: any, i: number) => {
    // try to find exact name match in palette
    const match = PALETTE.find(
      (p) => p.name.toLowerCase() === (c.name ?? "").toLowerCase()
    );
    const pick = match ?? PALETTE[i % PALETTE.length];
    return {
      id: String(c.id ?? pick.id ?? i),
      name: c.name ?? pick.name,
      // UI expects `colour` and `bg`
      colour: pick.colour,
      bg: pick.bg,
      // optional fields
      image: (c as any).image ?? undefined,
      description: (c as any).description ?? undefined,
    } as unknown as UICategory;
  });

  const nav = useNavigation<ParntHomeNavigatorProp>();

  const handleCategoryPress = (cat: { id: string | number; name?: string }) => {
    nav.navigate("storiesList", {
      categoryId: String(cat.id),
      categoryName: cat.name,
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1"
      contentContainerClassName="flex min-h-full px-5 pt-4 pb-10 bg-white"
    >
      <View
        aria-labelledby="user avatar container"
        className="flex flex-row items-center gap-2 sticky top-0 "
      >
        <View>
          <Image source={require("../../../assets/placeholder-pfp.png")} />
        </View>
        <View className="flex flex-1  flex-col gap-y-1.5">
          <Text className="font-[abeezee] text-base">
            {user?.title} {user?.name}
          </Text>
          <Text className="font-[abeezee] text-[12px] text-[#616161]">
            Good Morning
          </Text>
        </View>
        <Icon name="Bell" />
      </View>

      <View className="flex flex-col gap-y-2 my-7 max-w-screen-md mx-auto w-full">
        <Text className="text-xl font-[quilka]">Daily Challenge</Text>
        <ChildBanners kids={kids} />
      </View>
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

      <View
        aria-labelledby="Categories"
        className="flex flex-col max-w-screen-md flex-1 mx-auto w-full gap-y-2 mt-7"
      >
        <CategoryGrid
          categories={uiCategories}
          onCategoryPress={(idOrCat) => {
            if (typeof idOrCat === "object") {
              handleCategoryPress(idOrCat as any);
            } else {
              const clicked = uiCategories.find(
                (c) => String(c.id) === String(idOrCat)
              );
              if (clicked) handleCategoryPress(clicked);
            }
          }}
          onViewAll={() => {
            console.log("View all pressed");
            // navigate to full categories list
          }}
        />
      </View>

      <View
        aria-labelledby="Footer information"
        className="flex flex-col gap-y-3 mt-16"
      >
        <Text className="font-[abeezee] text-xl  text-black text-center">
          You are on free mode
        </Text>
        <Text className="font-[abeezee]  text-black text-center">
          You can only access one story per day. Unlock our full library for
          unlimited stories
        </Text>
        <CustomButton text="Subscribe to Storytime Premium" />
      </View>
      <LoadingOverlay visible={isLoading} />
    </ScrollView>
  );
};
export default ParentHomeScreen;

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

              <Text className="text-lg font-[abeezee] mt-2">
                {item.name}
              </Text>

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
