import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, Text, View } from "react-native";
import colours from "../../../colours";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";
import defaultStyles from "../../../styles";

const SuccessScreen = () => {
  const navigator = useNavigation<ParentControlNavigatorProp>();
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
        Your settings have been updated.
      </Text>
      <Pressable
        onPress={() =>
          navigator.reset({
            index: 0,
            routes: [{ name: "indexPage" }],
          })
        }
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

export default SuccessScreen;
