import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import colours from "../../colours";
import defaultStyles from "../../styles";

const EmailResetSuccessfulScreen = () => {
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
        Your email has been verified
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
          continue
        </Text>
      </Pressable>
    </View>
  );
};

export default EmailResetSuccessfulScreen;
