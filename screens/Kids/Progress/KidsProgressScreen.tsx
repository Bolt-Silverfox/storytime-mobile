import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import defaultStyles from "../../../styles";
import useKidNavigator from "../../../contexts/KidNavigatorContext";

const days = ["S", "M", "T", "W", "T", "F", "S"];

const KidsProgressScreen = () => {
  const { childId } = useKidNavigator();

  return (
    <ScrollView className="bg-[#FFFCFBFB] flex-1">
      <Text style={defaultStyles.heading} className="my-5">
        Progress and Achievement
      </Text>
      <View className="flex-row mx-6 justify-between my-10 ">
        {achievements.map((item, i) => (
          <Achievement
            key={i}
            image={item.image}
            score={item.score}
            title={item.title}
          />
        ))}
      </View>
      <View className="bg-[#7D4BED] rounded-[20] py-4 px-8 items-center gap-y-5 mx-5">
        <Image source={require("../../../assets/icons/fire.png")} />
        <Text style={[defaultStyles.heading, { fontSize: 24, color: "white" }]}>
          0 Day streak
        </Text>
        <Text
          style={[defaultStyles.defaultText, { fontSize: 15, color: "white" }]}
          className="text-center"
        >
          Keep learning everyday to increase your streaks
        </Text>
        <View className="flex-row gap-4 my-6 ">
          {days.map((day, i) => (
            <View
              key={i}
              className="bg-white/20 rounded-full text-center justify-center items-center  w-8 h-8"
            >
              <Text className=" text-white font-[abeezee]">{day}</Text>
            </View>
          ))}
        </View>
      </View>
      <View>
        <View className="flex-row justify-between mx-5 my-5">
          <Text style={[defaultStyles.defaultText, { fontSize: 15 }]}>
            Badge
          </Text>
          <Text
            style={[
              defaultStyles.defaultText,
              { fontSize: 15, color: "#EC4007" },
            ]}
          >
            View all
          </Text>
        </View>
        <View className="flex-row justify-center gap-2 items-center">
          <AchievementLock title="Sunny starter" />
          <AchievementLock title="Sunny starter" />
          <AchievementLock title="Sunny starter" />
        </View>
      </View>
    </ScrollView>
  );
};

export default KidsProgressScreen;
const Achievement = ({
  image,
  score,
  title,
}: {
  image: any;
  score: number;
  title: string;
}) => {
  return (
    <View
      style={{ width: 80 }}
      className="gap-4  py-[8]  px-[8] items-center rounded-[12px] border border-[#BDBDBD66] bg-white"
    >
      <View>
        <Image
          source={image}
          height={20}
          width={20}
          style={{ height: 30, width: 30 }}
        />
      </View>
      <Text className="font-[quilka] text-center  text-[20px]">{score}</Text>
      <Text className="font-[abeezee] text-center text-[#616161] ">
        {title}
      </Text>
    </View>
  );
};

const AchievementLock = ({ title }: { title: string }) => {
  return (
    <View
      style={styles.container}
      className="border-[2px] border-[#EAE8E8] bg-white p-2 items-center rounded-[10]"
    >
      <Image source={require("../../../assets/icons/achievement.png")} />
      <Image source={require("../../../assets/icons/0x.png")} />

      <Text className="font-[quilka] mt-2 text-[#606060]">{title}</Text>
    </View>
  );
};

const achievements = [
  {
    image: require("../../../assets/icons/star.png"),
    score: 0,
    title: "Stars",
  },
  {
    image: require("../../../assets/icons/badge.png"),
    score: 0,
    title: "Badges",
  },
  {
    image: require("../../../assets/icons/cup.png"),
    score: 0,
    title: "Challenges",
  },
  {
    image: require("../../../assets/icons/book.png"),
    score: 0,
    title: "Stories",
  },
];

const styles = StyleSheet.create({
  container: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
