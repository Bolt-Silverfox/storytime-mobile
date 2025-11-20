import { Button, Text, View } from "react-native";
import useAuth from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../Navigation/RootNavigator";

const HomeScree = () => {
  const { logout, isLoading } = useAuth();
  const navigator = useNavigation<RootNavigatorProp>();
  return (
    <View className="flex flex-1 justify-center items-center gap-2">
      <Text className="font-[quilka]">Coming Soon</Text>
      <Text className="font-[abeezee]">Home screen parent's page</Text>
      <Text>You haven't completed your profile,</Text>
      <Button
        title={isLoading ? "loading..." : "complete profile"}
        onPress={() =>
          navigator.navigate("completeProfile", { screen: "completeProfile" })
        }
      />
      <Button title={isLoading ? "loading..." : "logout"} onPress={logout} />
    </View>
  );
};
export default HomeScree;
