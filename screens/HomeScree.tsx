import { Button, Text, View } from "react-native";
import useAuth from "../contexts/AuthContext";

const HomeScree = () => {
  const { logout, isLoading } = useAuth();
  return (
    <View className="flex flex-1 justify-center items-center gap-2">
      <Text className="font-[quilka]">Coming Soon</Text>
      <Text className="font-[abeezee]">Home screen parent's page</Text>
      <Button title={isLoading ? "loading..." : "logout"} onPress={logout} />
    </View>
  );
};
export default HomeScree;
