import { useNavigation } from "@react-navigation/native";
import { View, Text } from "react-native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import PageTitle from "../../../components/PageTitle";

const BlockedStoriesScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  return (
    <View className="flex flex-1 flex-col ">
      <PageTitle goBack={() => navigator.goBack()} title="Blocked Stories" />
      <Text className="text-sm font-[abeezee] text-center">
        Blocked stories
      </Text>
    </View>
  );
};

export default BlockedStoriesScreen;
