import { Image, ScrollView, Text, View } from "react-native";
import PageTitle from "../../../components/PageTitle";
import { useNavigation } from "@react-navigation/native";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import Icon from "../../../components/Icon";

const TrackStoriesScreen = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  return (
    <View className="flex-1 flex-col flex bg-bgLight gap-y-6">
      <PageTitle title="Track Stories" goBack={() => navigator.goBack()} />
      <ScrollView
        className="mx-4"
        contentContainerClassName="flex bg-white border border-border-lighter p-4 gap-y-6 rounded-2xl flex-col"
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-[quilka] text-xl text-black">
          Select the child you want to want to track stories for
        </Text>
        <View className="flex-1 flex flex-col gap-y-4">
          <View className="flex bg-white flex-row p-6 border border-border-light rounded-xl gap-2 items-center">
            <Image
              source={require("../../../assets/avatars/Avatars-7.png")}
              className="size-11"
            />
            <View className="flex flex-col flex-1 gap-y-1.5">
              <Text className="font-[abeezee] text-xl text-black">Jacob</Text>
              <Text className="font-[abeezee] text-sm text-text">
                9 - 12 years
              </Text>
            </View>
            <Icon name="ChevronRight" />
          </View>
          <View className="flex bg-white flex-row p-6 border border-border-light rounded-xl gap-2 items-center">
            <Image
              source={require("../../../assets/avatars/Avatars-7.png")}
              className="size-11"
            />
            <View className="flex flex-col flex-1 gap-y-1.5">
              <Text className="font-[abeezee] text-xl text-black">Jacob</Text>
              <Text className="font-[abeezee] text-sm text-text">
                9 - 12 years
              </Text>
            </View>
            <Icon name="ChevronRight" />
          </View>
          <View className="flex bg-white flex-row p-6 border border-border-light rounded-xl gap-2 items-center">
            <Image
              source={require("../../../assets/avatars/Avatars-7.png")}
              className="size-11"
            />
            <View className="flex flex-col flex-1 gap-y-1.5">
              <Text className="font-[abeezee] text-xl text-black">Jacob</Text>
              <Text className="font-[abeezee] text-sm text-text">
                9 - 12 years
              </Text>
            </View>
            <Icon name="ChevronRight" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TrackStoriesScreen;
