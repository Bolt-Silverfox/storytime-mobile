import { Image, Pressable, Text, View } from "react-native";
import useGetStoryBuddies from "../hooks/tanstack/queryHooks/useGetStoryBuddies";
import ErrorComponent from "./ErrorComponent";

const BuddySelectionComponent = ({
  setSelected,
  selected,
}: {
  selected: string;
  setSelected: (str: string) => void;
}) => {
  const { data, error, refetch } = useGetStoryBuddies();
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return (
    <View className="flex flex-1 flex-row items-center flex-wrap gap-x-2 justify-center">
      {data?.map((buddy) => (
        <Pressable
          key={buddy.id}
          onPress={() => setSelected(buddy.id)}
          className={`rounded-3xl h-[275px] py-10 w-[180px] border ${selected === buddy.id ? "border-2 border-purple bg-purple/10" : "border-black/20 border"}`}
        >
          <View className="flex-1">
            <Image
              className="h-full w-full"
              source={{ uri: buddy.imageUrl }}
              alt={`Picture of ${buddy.name}`}
            />
          </View>
          <Text className="font-[quilka] text-xl text-center">
            {buddy.name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

export default BuddySelectionComponent;
