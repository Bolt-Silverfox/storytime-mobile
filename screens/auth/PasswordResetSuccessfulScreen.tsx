import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import defaultStyles from "../../styles";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import colours from "../../colours";

const PasswordResetSuccessfulScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  return (
    <View
      style={{
        ...defaultStyles.screen,
        marginTop: 100,
        backgroundColor: colours["bg-light"],
      }}
    >
      <Image
        source={require("../../assets/icons/successful-reset-illustration.png")}
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
        Password reset successful
      </Text>
      <Pressable
        onPress={() => navigator.navigate("auth", { screen: "login" })}
        style={defaultStyles.button}
      >
        <Text
          style={{
            ...defaultStyles.defaultText,
            color: "white",
            textAlign: "center",
          }}
        >
          Take me to login
        </Text>
      </Pressable>
    </View>
  );
};

export default PasswordResetSuccessfulScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
