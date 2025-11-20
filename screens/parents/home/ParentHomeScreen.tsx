import { ScrollView, StatusBar, Text, View } from "react-native";

const ParentHomeScreen = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        height: "100%",
      }}
    >
      <Text className="font-[abeezee]  text-black text-center">
        Home screen layout
      </Text>
    </ScrollView>
  );
};

export default ParentHomeScreen;
