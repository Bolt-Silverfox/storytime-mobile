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
          <View className="mb-14 mt-10 flex max-w-screen-sm flex-row items-center gap-x-4 sm:mx-auto">
            <View className="flex-1 border-b border-black" />
            <Text className="text-center">Or sign up with</Text>
            <View className="flex-1 border-b border-black" />
          </View>
          <View className="mb-14 flex flex-row items-center justify-center gap-x-20 ">
            <Pressable
              onPress={handleGoogleAuth}
              className="flex size-20 items-center justify-center rounded-full bg-white"
            >
              <Image source={require("../../assets/icons/google-icon.png")} />
            </Pressable>
            <Pressable
              onPress={handleAppleAuth}
              className="flex size-20 items-center justify-center rounded-full bg-white"
            >
              <Image source={require("../../assets/icons/apple-icon.png")} />
            </Pressable>
          </View>
          <Text style={styles.textMarginTop}>
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
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  textMarginTop: {
    ...defaultStyles.defaultText,
    textAlign: "center",
    marginTop: 16,
  },
  textContainer: {
    gap: 8,
    marginBottom: 56,
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
