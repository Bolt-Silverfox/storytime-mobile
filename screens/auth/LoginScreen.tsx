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

const LoginScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading, handleGoogleAuth, handleAppleAuth } = useAuth();

  return (
    <View className="flex flex-1">
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
                className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base ${error ? "border-red-600" : "border-border"}`}
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
              style={styles.linkTextRight}
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
            <Text style={styles.textWhite}>Log in</Text>
          </Pressable>
          <View className="mb-5 mt-10 flex flex-row items-center  gap-x-4">
            <View className="flex-1 border-b border-black" />
            <Text className="text-center">Or Continue with</Text>
            <View className="flex-1 border-b border-black" />
          </View>
          <View className="flex flex-row items-center justify-center gap-x-20 ">
            <Pressable
              onPress={handleGoogleAuth}
              className="flex size-20 items-center justify-center rounded-full bg-white"
            >
              <Image source={require("../../assets/icons/google-icon.png")} />
            </Pressable>
            <Pressable className="flex size-20 items-center justify-center rounded-full bg-white">
              <Image source={require("../../assets/icons/apple-icon.png")} />
            </Pressable>
          </View>
          <View className="mt-10 flex flex-col gap-y-4">
            <Text style={{ ...styles.text }}>
              Don't have an account?{" "}
              <Text
                onPress={() => navigator.navigate("auth", { screen: "signUp" })}
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
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  textWhite: {
    ...defaultStyles.defaultText,
    textAlign: "center",
    color: "white",
  },
  linkTextRight: {
    ...defaultStyles.linkText,
    textAlign: "right",
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
});
