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
import useAuth from "../../contexts/AuthContext";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";

const ResetPasswordScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [email, setEmail] = useState("");
  const { isLoading, errorMessage, requestPasswordReset } = useAuth();

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
          <Text style={defaultStyles.heading}>Reset Password</Text>
          <Text style={styles.text}>Change your password</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Email:</Text>
            <TextInput
              className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${errorMessage ? "border-red-600" : "border-border"}`}
              placeholderTextColor={errorMessage ? "red" : colours.text}
              placeholder="Enter your email"
              onChangeText={setEmail}
              value={email}
            />
            <ErrorMessageDisplay errorMessage={errorMessage} />
          </View>
        </View>
        <Pressable
          onPress={() => requestPasswordReset(email)}
          disabled={isLoading}
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={{ ...styles.text, color: "white" }}>
            {isLoading ? "Loading..." : "Proceed"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

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
    marginBottom: 32,
  },
  formItem: {
    gap: 4,
  },
});
