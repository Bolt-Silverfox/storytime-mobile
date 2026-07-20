import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import PageTitle from "../../components/PageTitle";
import useAuth from "../../contexts/AuthContext";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";

const ResetPasswordScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { isLoading, requestPasswordReset } = useAuth();

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1 bg-bgLight">
        <PageTitle goBack={() => navigator.goBack()} title="" />
        <View style={defaultStyles.screen}>
          <View style={styles.textContainer}>
            <Text style={defaultStyles.heading}>Reset Password</Text>
            <Text style={styles.text}>Change your password</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.formItem}>
              <Text style={defaultStyles.label}>Email:</Text>
              <TextInput
                className={`relative h-[50px] justify-center rounded-full border px-4 font-[abeezee] text-base text-black ${error ? "border-red-600" : "border-border"}`}
                placeholderTextColor={error ? "red" : colours.text}
                placeholder="Enter your email"
                onChangeText={setEmail}
                value={email}
              />
              <ErrorMessageDisplay errorMessage={error} />
            </View>
          </View>
          <Pressable
            onPress={() =>
              requestPasswordReset({
                email: email.trim(),
                setErrorCb: setError,
                onSuccess: () =>
                  navigator.navigate("auth", {
                    screen: "confirmResetPasswordToken",
                    params: {
                      email,
                    },
                  }),
              })
            }
            disabled={isLoading}
            style={
              isLoading ? defaultStyles.buttonDisabled : defaultStyles.button
            }
          >
            <Text style={styles.textWhite}>
              {isLoading ? "Loading..." : "Proceed"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default ResetPasswordScreen;

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
