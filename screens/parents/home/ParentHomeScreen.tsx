import { Button, ScrollView, StatusBar, Text, View } from "react-native";
import useAuth from "../../../contexts/AuthContext";

const ParentHomeScreen = () => {
  const { logout, isLoading } = useAuth();
  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        height: "100%",
      }}
    >
      <Button
        title={isLoading ? "Logging out..." : "logout"}
        onPress={logout}
      />
      <Text className="font-[abeezee]  text-black text-center">
        Home screen layout
      </Text>
    </ScrollView>
  );
};

export default ParentHomeScreen;
