import { Text, View, Image, Pressable, ScrollView } from "react-native";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";
import { useNavigation } from "@react-navigation/native";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";
import PageTitle from "../../components/PageTitle";
import Icon from "../../components/Icon";

const streakTitles = [
  "current streak",
  "total streaks",
  "longest streak",
  "stories covered",
];
const daysArray = [1, 2, 3, 4, 5];
const streakDays = [
  "7",
  "14",
  "24",
  "32",
  "50",
  "80",
  "100",
  "150",
  "200",
  "300",
  "400",
  "500",
];

const StreaksScreen = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  return (
    <SafeAreaWrapper variant="solid">
      <PageTitle
        goBack={() => navigator.goBack()}
        title="Your streaks"
        rightIcon={
          <Icon
            name="Share2"
            size={20}
            color="black"
            onPress={() => navigator.goBack()}
          />
        }
      />
      <ScrollView className="flex-1 bg-light ">
        <View className="flex flex-col gap-y-3 bg-white px-4 py-4">
          <Text className="font-abeezee text-base text-text">Your stats</Text>

          <View className="flex flex-row flex-wrap items-center justify-around gap-4">
            {streakTitles.map((title) => (
              <View
                key={title}
                className="flex max-w-[30%] flex-col items-center gap-y-1"
              >
                <Text className="font-qilka text-2xl text-black">{0}</Text>

                <Text
                  className="font-abeezee text-center capitalize text-text"
                  numberOfLines={2}
                >
                  {title}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View className="flex flex-col border-y border-y-border-light py-8">
          <View className="flex flex-col items-center">
            <View className="flex flex-col items-center justify-center rounded-[35px] border border-bgLight bg-white p-5">
              <Image
                source={require("../../assets/icons/streak-icon-yellow.png")}
              />
            </View>
            <View className=" -mt-10 flex flex-col items-center gap-y-1">
              <Text className="font-qilka text-[80px] text-black">{0}</Text>
              <Text className="font-abeezee text-center capitalize text-text">
                Day Streak
              </Text>
            </View>
          </View>
        </View>
        <View className="mx-4 my-8 w-full rounded-2xl bg-white px-4 py-8">
          <View className="flex flex-row flex-wrap justify-around gap-7">
            {daysArray.map((item) => (
              <View key={item} className="flex w-[60px] flex-col gap-y-1">
                <View className="size-10 rounded-full bg-light" />
                <Text className="font-abeezee text-base text-text">
                  Day {item}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View className="mx-4 rounded-2xl bg-white px-4 py-8">
          <Text className="font-abeezee mb-5 text-xl text-text">
            Achievements
          </Text>
          <View className="flex flex-row flex-wrap justify-around gap-x-2 gap-y-4">
            {streakDays.map((item) => (
              <View
                key={item}
                className="flex w-[30%] max-w-[120px] flex-col items-center gap-y-2 rounded-2xl border border-border-lighter p-2.5"
              >
                <Image
                  source={require("../../assets/icons/streak-icon-large.png")}
                />
                <Text className="font-abeezee text-xs text-text">
                  {item} Days Streak
                </Text>
                <Pressable className="flex flex-row  gap-x-2 rounded-full bg-yellow px-3 py-1">
                  <Icon name="LockKeyhole" size={12} />
                  <Text className="font-abeezee text-sm text-black">
                    Locked
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default StreaksScreen;
