import { Pressable, ScrollView, Text, View } from "react-native";
import PageTitle from "../../../../components/PageTitle";
import { useNavigation } from "@react-navigation/native";
import { ParntHomeNavigatorProp } from "../../../../Navigation/ParentHomeNavigator";
import Icon from "../../../../components/Icon";

const TrackChallengeScreen = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();

  return (
    <View className="flex-1 flex-col flex bg-bgLight">
      <PageTitle title="Track Challenge" goBack={() => navigator.goBack()} />
      <ScrollView
        contentContainerClassName="flex flex-col p-4 gap-y-6 justify-center items-center"
        showsVerticalScrollIndicator={false}
      >
        {dummyChildren.map((child) => (
          <ChallengeCard child={child} key={child.id} />
        ))}
      </ScrollView>
    </View>
  );
};

export default TrackChallengeScreen;

const ChallengeCard = ({ child }: { child: { name: string; id: string } }) => {
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

export const dummyChildren = [
  {
    name: "Kosi",
    id: "1",
  },
  {
    name: "Grace",
    id: "2",
  },
  {
    name: "Leonie",
    id: "3",
  },
];
