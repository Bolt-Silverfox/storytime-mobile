import { useSuspenseQuery } from "@tanstack/react-query";
import { Pressable, Text, View } from "react-native";
import queryLearningExpectations from "../hooks/tanstack/queryHooks/useGetLearningExpectations";
import ErrorComponent from "./ErrorComponent";

type Proptypes = {
  handleSelect: (s: string) => void;
  learningExpectations: string[];
};
const LearningExpectations = ({
  handleSelect,
  learningExpectations,
}: Proptypes) => {
  const { data, error, refetch } = useSuspenseQuery(
    queryLearningExpectations()
  );

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  return (
    <View className="flex-wrap  gap-y-7 flex flex-row gap-x-5">
      {data.map((expectation) => (
        <Pressable
          onPress={() => handleSelect(expectation.name)}
          key={expectation.id}
          className={`${learningExpectations.includes(expectation.name) ? "bg-blue" : ""} px-6 rounded-full py-3 text-black border border-black/15`}
        >
          <Text
            className={`capitalize text-text font-[abeezee] ${learningExpectations.includes(expectation.name) ? "text-white" : ""}`}
          >
            {expectation.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default LearningExpectations;
