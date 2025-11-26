import { useNavigation } from "@react-navigation/native";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import colours from "../../colours";
import SignupForm from "../../components/SignupForm";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";

const SignupScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: "100%",
        paddingTop: 46,
      }}
    >
      <Pressable
        onPress={() => navigator.goBack()}
        style={{ paddingHorizontal: 16, marginBottom: 16 }}
      >
        <Image
          style={styles.image}
          source={require("../../assets/icons/arrow-left.png")}
        />
      </Pressable>
      <View style={defaultStyles.screen}>
        <View style={styles.textContainer}>
          <Text style={defaultStyles.heading}>Welcome to Storytime4Kids</Text>
          <Text style={styles.text}>The world's first kids story library</Text>
        </View>
        <SignupForm />
        <Text style={{ ...styles.text, marginTop: 16 }}>
          If you already have an account{" "}
          <Text
            onPress={() => navigator.navigate("auth", { screen: "login" })}
            style={{ ...defaultStyles.defaultText, color: colours.link }}
          >
            Log in
          </Text>
        </Text>
        <Text style={{ ...styles.text, marginTop: 16 }}>
          Signed up but haven't verified?{" "}
          <Text
            onPress={() =>
              navigator.navigate("auth", { screen: "requestEmailVerification" })
            }
            style={{ ...defaultStyles.defaultText, color: colours.link }}
          >
            Verify email
          </Text>
        </Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By accepting to continue, you agree to storytime's{" "}
          <Text
            onPress={() =>
              navigator.navigate("auth", { screen: "termsOfService" })
            }
            style={styles.footerLinkText}
          >
            Terms and conditions
          </Text>{" "}
          and{" "}
          <Text
            onPress={() =>
              navigator.navigate("auth", { screen: "privacyScreen" })
            }
            style={styles.footerLinkText}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default SignupScreen;


const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
  screen: {
    ...defaultStyles.screen,
    flex: 1,
    gap: 16,
    paddingHorizontal: 0,
    paddingBottom: 0,
    minHeight: "auto",
  },
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  textContainer: {
    gap: 8,
    marginBottom: 56,
  },
  form: {
    gap: 20,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  formItem: {
    gap: 4,
  },
  eyeImage: {
    top: 37,
    right: 16,
    position: "absolute",
  },
  link: {
    ...defaultStyles.defaultText,
    color: colours.link,
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 44,
  },
  footer: {
    paddingTop: 84,
    paddingBottom: 82,
    backgroundColor: colours["bg-light"],
    paddingHorizontal: 16,
  },
  footerText: {
    ...defaultStyles.defaultText,
    textAlign: "center",
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  footerLinkText: {
    ...defaultStyles.linkText,
    fontSize: 14,
  },
});
