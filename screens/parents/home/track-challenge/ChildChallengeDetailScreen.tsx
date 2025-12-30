import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Icon from "../../../../components/Icon";
import PageTitle from "../../../../components/PageTitle";
import { ChallengeTrackerNavigatorParamList } from "../../../../Navigation/ChallengeTrackerNavigator";
import { ParntHomeNavigatorProp } from "../../../../Navigation/ParentHomeNavigator";
import { dummyChildren } from "./TrackChallengeScreen";

type RouteProps = RouteProp<
  ChallengeTrackerNavigatorParamList,
  "childChallengeDetails"
>;

const ChildChallengeDetailsScreen = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  const { params } = useRoute<RouteProps>();

  const child = dummyChildren.find((child) => child.id === params.childId);
  return (
    <View className="flex-1 flex-col flex bg-bgLight">
      <PageTitle
        title="Daily Challenge Tracker"
        goBack={() => navigator.goBack()}
      />
      <ScrollView
        contentContainerClassName="flex min-h-full  m-4 flex-col gap-y-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white border border-border-lighter rounded-xl p-4 flex flex-row gap-x-4 items-center">
          <Image
            source={require("../../../../assets/avatars/Avatars-5.png")}
            className="size-14"
          />
          <View className="flex flex-col gap-y-2">
            <Text className="text-black font-[abeezee] text-base">
              {child?.name}
            </Text>
            <Text className="text-text font-[abeezee] text-xs">
              9 - 12 years
            </Text>
          </View>
        </View>
        <ChallengeCard name={child?.name!} />
      </ScrollView>
    </View>
  );
};

export default ChildChallengeDetailsScreen;

const ChallengeCard = ({ name }: { name: string }) => {
  return (
    <View className="flex flex-col p-6 bg-purple rounded-xl">
      <Text className="font-[quilka] text-white text-2xl text-center">
        {name}'s Challenge
      </Text>
      <Text className="font-[abeezee] text-white text-sm text-center">
        Track and encourage {name} to keep up with the good work
      </Text>
      <ChallengeDays />
      <NewChallengeCard />
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

const NewChallengeCard = () => {
  return (
    <View className="flex flex-row gap-x-2.5 p-5 bg-[#7945FB] rounded-2xl">
      <View className="size-10 flex justify-center items-center rounded-full bg-white">
        <Icon name="Clock" />
      </View>
      <View className="flex flex-col gap-y-1.5 flex-1">
        <Text className="font-[abeezee] text-xs text-white">New challenge</Text>
        <Text className="font-[abeezee] text-base text-white text-wrap">
          Learn a new word & meaning from the story "Gracefulness"
        </Text>
        <Text className="font-[quilka] text-yellow text-base mt-1">20:01</Text>
      </View>
    </View>
  );
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
