import { Dispatch, SetStateAction } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { ageGroups, AgeGroupType } from "../../types";

type Props = {
  selectedAgeGroup: AgeGroupType;
  setSelectedAgeGroup: Dispatch<SetStateAction<AgeGroupType>>;
};

const AgeSelectionComponent = ({
  selectedAgeGroup,
  setSelectedAgeGroup,
}: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex flex-row gap-x-2 items-center h-full"
    >
      {ageGroups.map((age) => (
        <Pressable
          key={age}
          onPress={() => setSelectedAgeGroup(age)}
          className={`flex h-10 w-[126px] flex-row items-center justify-center rounded-full ${age === selectedAgeGroup ? "bg-blue" : "border bg-white "}`}
        >
          <Text
            className={`font-[abeezee] text-base ${age === selectedAgeGroup ? "text-white" : "text-text"}`}
          >
            {age}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default AgeSelectionComponent;
