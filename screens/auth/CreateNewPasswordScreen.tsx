import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import PasswordInput from "../../components/PasswordInput";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";

const CreateNewPasswordScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
          <Text style={defaultStyles.heading}>New Password</Text>
          <Text style={styles.text}>Enter and confirm your new password</Text>
        </View>
        <View style={styles.form}>
          <PasswordInput
            label="New Password:"
            password={password}
            setPassword={setPassword}
            placeholder="Enter new Password"
          />
          <PasswordInput
            label="Confirm new Password:"
            password={confirmPassword}
            setPassword={setConfirmPassword}
            placeholder="Confirm new Password"
          />
        </View>
        <Pressable
          onPress={() =>
            navigator.navigate("auth", {
              screen: "resetSuccessful",
            })
          }
          style={
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
          }
        >
          <Text style={{ ...styles.text, color: "white" }}>Proceed</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CreateNewPasswordScreen;

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
    marginTop: 49,
    marginBottom: 56,
  },
  form: {
    gap: 20,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    marginBottom: 48,
  },
  formItem: {
    gap: 4,
  },
});
