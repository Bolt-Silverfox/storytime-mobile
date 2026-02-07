import { Dispatch, SetStateAction, useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { ageGroups, AgeGroupType } from "../../types";

const AgeSelectionComponent = ({
  setSelectedCallback,
  selectedGroupProp,
}: {
  setSelectedCallback?: Dispatch<SetStateAction<AgeGroupType>>;
  selectedGroupProp?: AgeGroupType;
}) => {
  const [selectedGroup, setSelectedGroup] = useState<AgeGroupType>("1-3");

  const handleSelectAgeGroup = (ageGroup: AgeGroupType) => {
    if (setSelectedCallback) {
      setSelectedCallback(ageGroup);
    }
    setSelectedGroup(ageGroup);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="flex flex-row gap-x-2 items-center h-full"
    >
      {ageGroups.map((age) => {
        const isSelected = selectedGroupProp
          ? age === selectedGroupProp
          : age === selectedGroup;
        return (
          <Pressable
            key={age}
            onPress={() => handleSelectAgeGroup(age)}
            className={`flex h-10 w-[126px] flex-row items-center justify-center rounded-full ${isSelected ? "bg-blue" : "border bg-white "}`}
          >
            <Text
              className={`font-[abeezee] text-base ${isSelected ? "text-white" : "text-text"}`}
            >
              {age}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};

export default AgeSelectionComponent;
