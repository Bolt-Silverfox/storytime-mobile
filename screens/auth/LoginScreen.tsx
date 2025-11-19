import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Pressable,
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

const LoginScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, errorMessage, isLoading } = useAuth();

  return (
    <View style={styles.screen}>
      <Pressable
        onPress={() => navigator.goBack()}
        style={{ paddingHorizontal: 16 }}
      >
        <Image
          style={styles.image}
          source={require("../../assets/icons/arrow-left.png")}
        />
      </Pressable>
      <View style={defaultStyles.screen}>
        <View style={styles.textContainer}>
          <Text style={defaultStyles.heading}>Welcome back</Text>
          <Text style={styles.text}>Glad to have you back</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Email:</Text>
            <TextInput
              className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base relative px-4 ${errorMessage ? "border-red-600" : "border-border"}`}
              placeholder="Enter your email"
              placeholderTextColor={errorMessage ? "red" : colours.text}
              onChangeText={setEmail}
              value={email}
            />
            <ErrorMessageDisplay errorMessage={errorMessage} />
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
            Reset Password
          </Text>
        </View>
        <Pressable
          onPress={() => login(email, password)}
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={{ ...styles.text, color: "white" }}>
            {isLoading ? "Logging in..." : "Log in"}
          </Text>
        </Pressable>
        <Text style={{ ...styles.text, marginTop: 16 }}>
          Don't have an account?{" "}
          <Text
            onPress={() => navigator.navigate("auth", { screen: "signUp" })}
            style={{ ...defaultStyles.defaultText, color: colours.link }}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
  screen: {
    ...defaultStyles.screen,
    backgroundColor: "white",
    gap: 16,
    paddingHorizontal: 0,
    paddingBottom: 0,
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
