import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";
import colours from "../../colours";
import { useState } from "react";
import PasswordInput from "../../components/PasswordInput";

const LoginScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
              style={defaultStyles.input}
              placeholder="Enter your email"
              onChangeText={setEmail}
              value={email}
            />
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
          onPress={() => navigator.navigate("home")}
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={{ ...styles.text, color: "white" }}>Log in</Text>
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
