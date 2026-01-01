import { useNavigation } from "@react-navigation/native";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pressable, ScrollView, Text, View } from "react-native";
import { queryGetUserKids } from "../hooks/tanstack/queryHooks/useGetUserKids";
import { ParntHomeNavigatorProp } from "../Navigation/ParentHomeNavigator";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { KidProfile } from "../types";
import ChildrenEmptyState from "./emptyState/ChildrenEmptyState";
import ErrorComponent from "./ErrorComponent";
import Icon from "./Icon";

const TrackChallengeComponent = () => {
  const { error, data, refetch } = useSuspenseQuery(queryGetUserKids());
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();

  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  if (!data.length)
    return (
      <ChildrenEmptyState navigate={() => navigator.navigate("addChild")} />
    );

  return (
    <ScrollView
      contentContainerClassName="flex flex-col p-4 gap-y-6 justify-center items-center"
      showsVerticalScrollIndicator={false}
    >
      {data.map((child) => (
        <ChallengeCard child={child} key={child.id} />
      ))}
    </ScrollView>
  );
};

export default TrackChallengeComponent;

const ChallengeCard = ({ child }: { child: KidProfile }) => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  return (
    <View className="flex flex-col p-6 bg-purple rounded-xl">
      <Text className="font-[quilka] text-white text-2xl text-center">
        {child.name}'s Challenge
      </Text>
      <Text className="font-[abeezee] text-white text-sm text-center">
        Track and encourage {child.name} to keep up with the good work
      </Text>
      <ChallengeDays />
      <Pressable
        onPress={() =>
          navigator.navigate("trackChallenge", {
            screen: "childChallengeDetails",
            params: { childId: child.id },
          })
        }
        className="flex flex-row mt-6 rounded-full border border-[#814FFF] bg-[#6021FF] py-2 px-3 justify-between items-center"
      >
        <Text className="font-[abeezee] text-xs text-white">
          See {child.name}'s challenge
        </Text>
        <Icon name="ArrowRight" color="white" />
      </Pressable>
    </View>
  );
};

const ChallengeDays = () => {
  return (
    <View className="flex flex-row gap-x-2 gap-y-4 flex-wrap mt-6 pb-6 border-b border-b-[#5F22F8]">
      {weekDays.map((day) => (
        <Pressable
          key={day}
          className="h-9 flex px-7 justify-center items-center rounded-full border border-[#814FFF] bg-[#5D20F880] "
        >
          <Text className="font-[abeezee] text-sm text-white">{day}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
