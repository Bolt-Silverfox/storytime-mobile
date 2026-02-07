import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ImageSourcePropType, Text, View } from "react-native";
import queryGetStories, {
  GetStoriesParam,
} from "../hooks/tanstack/queryHooks/queryGetStories";
import { AgeGroupType } from "../types";
import GroupedStoriesStoryCarousel from "./GroupedStoriesStoryCarousel";
import { CustomImageBackground } from "./UI/CustomImage";
import SafeAreaWrapper from "./UI/SafeAreaWrapper";

type PropTypes = {
  imageSource?: ImageSourcePropType;
  title: string;
  description: string;
  showAges?: boolean;
  params: GetStoriesParam;
};

const GroupedStoriesContainer = ({
  imageSource,
  title,
  description,
  params,
  showAges = true,
}: PropTypes) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroupType>("All");
  const { data: stories } = useQuery(
    queryGetStories({ ...params, ageGroup: selectedAgeGroup })
  );

  return (
    <SafeAreaWrapper variant="transparent">
      <View className="flex flex-1 bg-bgLight">
        <CustomImageBackground
          source={
            imageSource ?? {
              uri:
                stories?.[0]?.coverImageUrl ??
                "https://res.cloudinary.com/billmal/image/upload/v1769762827/storytime/assets/generate_an_children_story_book_image_for_the_theme__Mystery_problem_solving__3_1_b57i6x.jpg",
            }
          }
          className="flex h-[30vh] max-h-[500px] w-full flex-col justify-end px-4 pb-8"
        >
          <View className="flex flex-col gap-y-1.5">
            <Text className="font-[quilka] text-3xl capitalize text-white">
              {title}
            </Text>
            <Text className="font-[abeezee] text-base text-white">
              {description}
            </Text>
          </View>
        </CustomImageBackground>

        <GroupedStoriesStoryCarousel
          showAges={showAges}
          params={params}
          selectedAgeGroup={selectedAgeGroup}
          setSelectedAgeGroup={setSelectedAgeGroup}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default GroupedStoriesContainer;
