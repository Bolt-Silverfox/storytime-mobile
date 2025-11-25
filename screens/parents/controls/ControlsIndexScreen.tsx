import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, Text, View } from "react-native";
import Icon from "../../../components/Icon";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";
import colours from "../../../colours";

const ControlsIndexScreen = () => {
  const navigator = useNavigation<ParentControlNavigatorProp>();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1"
      contentContainerClassName="px-5 flex flex-col bg-[#f4f4f4] gap-y-10 pt-4 pb-10 bg-white min-h-full max-w-screen-md w-full mx-auto"
    >
      <Text className="font-[quilka] text-center text-2xl">Controls</Text>
      <View className="flex flex-col mx-3 rounded-3xl p-4 bg-white">
        <Text className="text-[18px] font-[abeezee] my-3">
          STORY CUSTOMISATION
        </Text>
        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => navigator.navigate("contentFilter")}
        >
          <Icon name="Funnel" color={colours.primary} />
          <Text className="flex-1 text-base text-black font-[abeezee]">
            Content Filter
          </Text>
          <Icon name="ChevronRight" color="black" />
        </Pressable>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => navigator.navigate("contentFilter")}
        >
          <Icon name="Funnel" color={colours.primary} />
          <Text className="flex-1 text-base text-black font-[abeezee]">
            Exclude Story Tags{" "}
          </Text>
          <Icon name="ChevronRight" color="black" />
        </Pressable>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => navigator.navigate("recordVoice")}
        >
          <Icon name="Mic" color={colours.primary} />
          <Text className="flex-1 text-base text-black font-[abeezee]">
            Record Voice
          </Text>
          <Icon name="ChevronRight" color="black" />
        </Pressable>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => navigator.navigate("customizeReadingVoices")}
        >
          <Icon name="Volume2" color={colours.primary} />
          <Text className="flex-1 text-base text-black font-[abeezee]">
            Customize Reading Voices
          </Text>
          <Icon name="ChevronRight" color="black" />
        </Pressable>
      </View>

      <View className="flex flex-col mx-3 rounded-3xl p-4 bg-white">
        <Text className="text-[18px] font-[abeezee] my-3">READING & USAGE</Text>
        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => navigator.navigate("setBedtime")}
        >
          <Icon name="Moon" color={colours.primary} />
          <Text className="flex-1 text-base text-black font-[abeezee]">
            Set Bedtime Mode
          </Text>
          <Icon name="ChevronRight" color="black" />
        </Pressable>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => navigator.navigate("setDailyLimit")}
        >
          <Icon name="Hourglass" color={colours.primary} />
          <Text className="flex-1 text-base text-black font-[abeezee]">
            Daily Usage Limit{" "}
          </Text>
          <Icon name="ChevronRight" color="black" />
        </Pressable>

        <Pressable
          className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
          onPress={() => navigator.navigate("viewActivityLog")}
        >
          <Icon name="Clock" color={colours.primary} />
          <Text className="flex-1 text-base text-black font-[abeezee]">
            View Activity Log
          </Text>
          <Icon name="ChevronRight" color="black" />
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default ControlsIndexScreen;
