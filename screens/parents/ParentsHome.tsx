import { StyleSheet, View } from "react-native";
import ComingSoon from "../../components/ComingSoon";

const ParentsHome = () => {
  return (
    <View className="flex flex-col justify-center items-center gap-3">
      <ComingSoon title="Parent home page" />

      {/* <Button
        title="child story tracker"
        onPress={() =>
          navigator.navigate("childStoryDetails", { storyId: "1344" })
        }
      /> */}
    </View>
  );
};

export default ParentsHome;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
