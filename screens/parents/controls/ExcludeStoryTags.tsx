import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import {
  ParentControlNavigatorParamList,
  ParentControlNavigatorProp,
} from "../../../Navigation/ParentControlsNavigator";
import Icon from "../../../components/Icon";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import useGetKidById from "../../../hooks/tanstack/queryHooks/useGetKidById";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import useUpdateKids from "../../../hooks/tanstack/mutationHooks/useUpdateKids";

const tags = [
  "magic",
  "spells",
  "fear",
  "superpowers",
  "villains",
  "monsters",
  "scary",
  "witch",
  "romance",
  "battle",
  "loss",
];

type RouteProps = RouteProp<
  ParentControlNavigatorParamList,
  "excludeStoryTags"
>;
const ExcludeStoryTags = () => {
  const { params } = useRoute<RouteProps>();
  const { data, isPending, error, refetch } = useGetKidById(params.childId);
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(
    data?.excludedTags ?? []
  );
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const { mutate, isPending: isUpdating } = useUpdateKids({
    id: params.childId,
    onSuccess: () => navigator.goBack(),
  });

  useEffect(() => {
    setSelectedFilters(data?.excludedTags ?? []);
  }, [data]);

  const updatedFilters = tags.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSelect = (tag: string) => {
    setSelectedFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  return (
    <View className="flex flex-1 flex-col bg-bgLight gap-y-10 pb-10">
      <PageTitle goBack={() => navigator.goBack()} title="Exclude Story Tags" />
      <View className="flex-1 flex flex-col gap-y-10 max-w-screen-md mx-auto w-full">
        <View className="mx-5 relative">
          <TextInput
            className="text-base pl-12 h-12 rounded-full font-[abeezee] border border-black/50"
            value={searchText}
            onChangeText={setSearchText}
          />
          <Pressable className="absolute left-4 top-2">
            <Icon name="Search" />
          </Pressable>
        </View>
        <View className="mx-5 flex-wrap flex-1 gap-y-7 flex flex-row gap-x-5">
          {updatedFilters.map((tag) => (
            <Pressable
              onPress={() => handleSelect(tag)}
              key={tag}
              className={`${selectedFilters.includes(tag) ? "bg-blue text-white" : ""} px-9 rounded-full py-3 text-black border border-black/15`}
            >
              <Text
                className={`capitalize text-text font-[abeezee] ${selectedFilters.includes(tag) ? "text-white" : ""}`}
              >
                {tag}
              </Text>
            </Pressable>
          ))}
        </View>
        <CustomButton
          disabled={isUpdating ?? !selectedFilters.length}
          onPress={() =>
            mutate({
              excludedTags: selectedFilters,
            })
          }
          text={isUpdating ? "Saving" : "Save"}
        />
      </View>
      <LoadingOverlay visible={isPending} />
    </View>
  );
};

export default ExcludeStoryTags;
