import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import PasswordInput from "../../components/PasswordInput";
import useAuth from "../../contexts/AuthContext";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";
import LoadingOverlay from "../../components/LoadingOverlay";
import PageTitle from "../../components/PageTitle";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";

const LoginScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading, handleGoogleAuth, handleAppleAuth } = useAuth();

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 flex">
        <PageTitle title="" goBack={() => navigator.goBack()} />
        <ScrollView
          className="flex-1"
          contentContainerClassName="min-h-full"
          showsVerticalScrollIndicator={false}
        >
          <View style={defaultStyles.screen}>
            <View style={styles.textContainer}>
              <Text style={defaultStyles.heading}>Welcome back</Text>
              <Text style={styles.text}>Glad to have you back</Text>
            </View>
            <View style={styles.form}>
              <View style={styles.formItem}>
                <Text style={defaultStyles.label}>Email:</Text>
                <TextInput
                  className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base relative px-4 ${error ? "border-red-600" : "border-border"}`}
                  placeholder="Enter your email"
                  placeholderTextColor={error ? "red" : colours.text}
                  onChangeText={setEmail}
                  value={email}
                />
                <ErrorMessageDisplay errorMessage={error} />
              </View>
              <PasswordInput
                label="Password:"
                password={password}
                setPassword={setPassword}
                placeholder="Enter your password"
              />
              <Text
                onPress={() =>
                  navigator.navigate("auth", { screen: "resetPassword" })
                }
                style={{ ...defaultStyles.linkText, textAlign: "right" }}
              >
                Forgot Password?
              </Text>
            </View>

            <Pressable
              onPress={() =>
                login({
                  email: email.trim().toLowerCase(),
                  password,
                  setErrorCb: setError,
                })
              }
              disabled={isLoading}
              style={
                isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
              }
            >
              <Text style={{ ...styles.text, color: "white" }}>Log in</Text>
            </Pressable>
            <View className="flex flex-row gap-x-4 items-center mt-10  mb-5">
              <View className="border-b border-black flex-1" />
              <Text className="text-center">Or Continue with</Text>
              <View className="border-b border-black flex-1" />
            </View>
            <View className="flex flex-row justify-center items-center gap-x-20 ">
              <Pressable
                onPress={handleGoogleAuth}
                className="bg-white size-20 rounded-full flex justify-center items-center"
              >
                <Image source={require("../../assets/icons/google-icon.png")} />
              </Pressable>
              <Pressable className="bg-white size-20 rounded-full flex justify-center items-center">
                <Image source={require("../../assets/icons/apple-icon.png")} />
              </Pressable>
            </View>
            <View className="flex flex-col gap-y-4 mt-10">
              <Text style={{ ...styles.text }}>
                Don't have an account?{" "}
                <Text
                  onPress={() =>
                    navigator.navigate("auth", { screen: "signUp" })
                  }
                  style={{ ...defaultStyles.defaultText, color: colours.link }}
                >
                  Register
                </Text>
              </Text>
              <Text style={{ ...styles.text }}>
                Signed up but haven't verified?{" "}
                <Text
                  onPress={() =>
                    navigator.navigate("auth", {
                      screen: "requestEmailVerification",
                    })
                  }
                  style={{ ...defaultStyles.defaultText, color: colours.link }}
                >
                  Verify email
                </Text>
              </Text>
            </View>
          </View>
          <LoadingOverlay visible={isLoading} />
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
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
    marginBottom: 44,
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
});
