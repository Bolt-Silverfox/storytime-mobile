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
import LoadingOverlay from "../../components/LoadingOverlay";
import useAuth from "../../contexts/AuthContext";
import PageTitle from "../../components/PageTitle";

const SignupScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const { isLoading, handleGoogleAuth, handleAppleAuth } = useAuth();
  return (
    <View className="flex flex-1">
      <PageTitle title="" goBack={() => navigator.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="min-h-full"
      >
        <View style={defaultStyles.screen}>
          <View style={styles.textContainer}>
            <Text style={defaultStyles.heading}>Welcome to Storytime4Kids</Text>
            <Text style={styles.text}>
              The world's first kids story library
            </Text>
          </View>
          <SignupForm />
          <View className="flex max-w-screen-sm sm:mx-auto flex-row gap-x-4 items-center mt-10 mb-14">
            <View className="border-b border-black flex-1" />
            <Text className="text-center">Or sign up with</Text>
            <View className="border-b border-black flex-1" />
          </View>
          <View className="flex flex-row mb-14 justify-center items-center gap-x-20 ">
            <Pressable
              onPress={handleGoogleAuth}
              className="bg-white size-20 rounded-full flex justify-center items-center"
            >
              <Image source={require("../../assets/icons/google-icon.png")} />
            </Pressable>
            <Pressable
              onPress={handleAppleAuth}
              className="bg-white size-20 rounded-full flex justify-center items-center"
            >
              <Image source={require("../../assets/icons/apple-icon.png")} />
            </Pressable>
          </View>
          <Text style={{ ...styles.text, marginTop: 16 }}>
            If you already have an account{" "}
            <Text
              onPress={() => navigator.navigate("auth", { screen: "login" })}
              style={{ ...defaultStyles.defaultText, color: colours.link }}
            >
              Log in
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
        <LoadingOverlay visible={isLoading} />
      </ScrollView>
    </View>
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
    paddingTop: 54,
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
