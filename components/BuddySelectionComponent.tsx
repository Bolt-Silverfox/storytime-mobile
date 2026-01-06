import { useSuspenseQuery } from "@tanstack/react-query";
import { Image, Pressable, Text, View } from "react-native";
import queryGetStoryBuddies from "../hooks/tanstack/queryHooks/useGetStoryBuddies";
import ErrorComponent from "./ErrorComponent";

const BuddySelectionComponent = ({
  setSelected,
  selected,
}: {
  selected: string;
  setSelected: (str: string) => void;
}) => {
  const { data, error, refetch } = useSuspenseQuery(queryGetStoryBuddies());
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return (
    <View className="flex flex-1 flex-row items-center flex-wrap gap-x-2 gap-y-4 justify-center">
      {data.map((buddy) => (
        <Pressable
          key={buddy.id}
          onPress={() => setSelected(buddy.id)}
          className={`rounded-3xl  h-[350px] py-10 w-[191px] ${selected === buddy.id ? "border-2  border-purple bg-white" : ""}`}
        >
          <View className="flex-1">
            <Image
              className="h-full w-full"
              source={{ uri: buddy.imageUrl }}
              alt={`Picture of ${buddy.name}`}
            />
          </View>
          <View className="bg-purple h-16 mt-5 rounded-full w-[153px] mx-auto flex justify-center items-center">
            <Text className="font-[quilka] text-xl capitalize text-white text-center">
              {buddy.name}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default BuddySelectionComponent;
