import { Dispatch, SetStateAction } from "react";
import { ImageSourcePropType, Text, View } from "react-native";
import { AgeGroupType, Story } from "../types";
import GroupedStoriesStoryCarousel from "./GroupedStoriesStoryCarousel";
import { CustomImageBackground } from "./UI/CustomImage";
import SafeAreaWrapper from "./UI/SafeAreaWrapper";

type PropTypes = {
  imageSource?: ImageSourcePropType;
  title: string;
  description: string;
  showAges?: boolean;
  setSelectedAgeGroup?: Dispatch<SetStateAction<AgeGroupType>>;
  selectedAgeGroup?: AgeGroupType;
  stories: Story[] | undefined;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
};

const GroupedStoriesContainer = ({
  imageSource,
  title,
  description,
  selectedAgeGroup,
  setSelectedAgeGroup,
  stories,
  isPending,
  error,
  refetch,
  showAges = true,
}: PropTypes) => {
  return (
    <SafeAreaWrapper variant="transparent">
      <View className="flex flex-1 bg-bgLight">
        <CustomImageBackground
          isPending={isPending}
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
          isPending={isPending}
          refetch={refetch}
          error={error}
          stories={stories}
          showAges={showAges}
          selectedAgeGroup={selectedAgeGroup}
          setSelectedAgeGroup={setSelectedAgeGroup}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default GroupedStoriesContainer;
