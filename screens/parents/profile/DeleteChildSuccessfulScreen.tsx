import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../Navigation/parents/ParentProfileNavigator";
import defaultStyles from "../../../styles";
import colours from "../../../colours";

const DeleteChildSuccessfulScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  return (
    <View
      style={{
        ...defaultStyles.screen,
        marginTop: 100,
        backgroundColor: colours["bg-light"],
      }}
    >
      <Image
        source={require("../../../assets/icons/successful-reset-illustration.png")}
        style={{ alignSelf: "center" }}
      />
      <Text
        style={{ ...defaultStyles.heading, marginTop: 58, marginBottom: 28 }}
      >
        Successful
      </Text>
      <Text
        style={{
          ...defaultStyles.defaultText,
          textAlign: "center",
          marginBottom: 167,
        }}
      >
        Child profile has been deleted successfully.
      </Text>
      <Pressable
        onPress={() => navigator.navigate("manageChildProfiles")}
        style={defaultStyles.button}
      >
        <Text
          style={{
            ...defaultStyles.defaultText,
            color: "white",
            textAlign: "center",
          }}
        >
          Continue
        </Text>
      </Pressable>
    </View>
  );
};

export default DeleteChildSuccessfulScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
