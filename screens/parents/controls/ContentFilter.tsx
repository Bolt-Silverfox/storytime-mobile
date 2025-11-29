import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Suspense, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import {
  ParentControlNavigatorParamList,
  ParentControlNavigatorProp,
} from "../../../Navigation/ParentControlsNavigator";
import ContentFilterCategories from "../../../components/ContentFilterCategories";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import useUpdateKids from "../../../hooks/tanstack/mutationHooks/useUpdateKids";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";

type ContentFilterPropList = RouteProp<
  ParentControlNavigatorParamList,
  "contentFilter"
>;

const ContentFilter = () => {
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const [filterByAge, setFilterByAge] = useState("1 - 4");
  const { params } = useRoute<ContentFilterPropList>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { data, isPending, error, refetch } = useGetKidById(params.childId);
  const { mutate, isPending: isUpdating } = useUpdateKids({
    id: params.childId,
    onSuccess: () => navigator.goBack(),
  });

  useEffect(() => {
    data?.preferredCategories
      ? data.preferredCategories.map((category) =>
          setSelectedCategories((c) => [...c, category.id])
        )
      : null;
    setFilterByAge(data?.ageRange ?? "");
  }, [data]);

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="min-h-full max-w-screen-md mx-auto w-full "
    >
      <PageTitle title="Content Filters" goBack={() => navigator.goBack()} />

      <Text className="text-base font-[abeezee] my-5 text-center">
        Select the stories your child can read
      </Text>
      <View className="flex flex-col mx-5 rounded-3xl p-4 bg-white">
        <Text className="text-[18px] font-[abeezee] my-3">FILTER BY AGE</Text>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => setFilterByAge("1 - 4")}
        >
          <Text className="flex-1 text-base text-black font-[abeezee]">
            1 – 4 years
          </Text>
          <Switch
            value={filterByAge === "1 - 4"}
            onValueChange={() => setFilterByAge("1 - 4")}
          />
        </Pressable>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => setFilterByAge("5 - 8")}
        >
          <Text className="flex-1 text-base text-black font-[abeezee]">
            5 – 8 years
          </Text>
          <Switch
            value={filterByAge === "5 - 8"}
            onValueChange={() => setFilterByAge("5 - 8")}
          />
        </Pressable>

        <Pressable
          className="flex py-4 flex-row items-center gap-x-10"
          onPress={() => setFilterByAge("9 - 12")}
        >
          <Text className="flex-1 text-base text-black font-[abeezee]">
            9+ years
          </Text>
          <Switch
            value={filterByAge === "9 - 12"}
            onValueChange={() => setFilterByAge("9 - 12")}
          />
        </Pressable>
      </View>

      <View className="flex flex-col mx-5 rounded-3xl p-4 bg-white mt-6">
        <View className="my-3 flex flex-col gap-y-1">
          <Text className="text-[18px] font-[abeezee] ">
            FILTER BY CATEGORY
          </Text>
          <Text className="text-xs font-[abeezee]">
            Select the categories you prefer
          </Text>
        </View>
        <Suspense fallback={<ActivityIndicator size={"large"} />}>
          <ContentFilterCategories
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
          />
        </Suspense>
      </View>
      <View className="m-10">
        <CustomButton
          disabled={isUpdating || !filterByAge}
          text={isUpdating ? "Saving..." : "Save Changes"}
          onPress={() =>
            mutate({
              ageRange: filterByAge,
              preferredCategoryIds: selectedCategories,
            })
          }
        />
      </View>
      <LoadingOverlay visible={isPending} />
    </ScrollView>
  );
};
export default ContentFilter;
