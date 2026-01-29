import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import colours from "../../colours";
import ErrorMessageDisplay from "../../components/ErrorMessageDisplay";
import LoadingOverlay from "../../components/LoadingOverlay";
import PageTitle from "../../components/PageTitle";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";
import useAuth from "../../contexts/AuthContext";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";

const RequestEmailVerification = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [email, setEmail] = useState("");
  const { isLoading, resendVerificationEmail } = useAuth();
  const [error, setError] = useState("");

  const handleRequestVerfication = async () => {
    const response = await resendVerificationEmail({
      email: email.trim(),
      setErrorCb: setError,
    });
    if (response.success) {
      navigator.navigate("auth", {
        screen: "verifyEmail",
        params: {
          email,
        },
      });
    }
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1">
        <PageTitle goBack={() => navigator.goBack()} title="" />
        <View style={defaultStyles.screen}>
          <View style={styles.textContainer}>
            <Text style={defaultStyles.heading}>
              Request email verification
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.formItem}>
              <Text style={defaultStyles.label}>Email:</Text>
              <TextInput
                className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${error ? "border-red-600" : "border-border"}`}
                placeholderTextColor={error ? "red" : colours.text}
                placeholder="Enter your email"
                onChangeText={setEmail}
                value={email}
              />
              <ErrorMessageDisplay errorMessage={error} />
            </View>
          </View>
          <Pressable
            onPress={handleRequestVerfication}
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
        <LoadingOverlay visible={isLoading} />
      </View>
    </SafeAreaWrapper>
  );
};

export default RequestEmailVerification;

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
    marginBottom: 32,
  },
  formItem: {
    gap: 4,
  },
});
