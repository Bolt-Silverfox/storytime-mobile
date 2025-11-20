import { useNavigation } from "@react-navigation/native";
import { Text, View } from "react-native";
import { RootNavigatorProp } from "../Navigation/RootNavigator";

const CompleteProfileNewScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  return (
    <View className="flex flex-col gap-y-4 min-h-dvh min-w-dvw flex-1 justify-center items-center">
      <Text onPress={() => navigator.navigate("parents")}>
        Go to parents screen
      </Text>
    </View>
  );
};

export default CompleteProfileNewScreen;
