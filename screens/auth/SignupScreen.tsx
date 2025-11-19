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
import PasswordInput from "../../components/PasswordInput";
import TitleModal from "../../components/TitleModal";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import defaultStyles from "../../styles";
import Icon from "../../components/Icon";

const SignupScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [titleModal, setTitleModal] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: "100%",
        paddingVertical: 46,
      }}
    >
      <Pressable
        onPress={() => navigator.goBack()}
        style={{ paddingHorizontal: 16, marginBottom: 16 }}
      >
        <Image
          style={styles.image}
          source={require("../../assets/icons/arrow-left.png")}
        />
      </Pressable>

      <View style={defaultStyles.screen}>
        <View style={styles.textContainer}>
          <Text style={defaultStyles.heading}>Welcome to Storytime4Kids</Text>
          <Text style={styles.text}>The world's first kids story library</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Title:</Text>
            <Pressable
              style={{
                ...defaultStyles.input,
                justifyContent: "center",
                position: "relative",
              }}
              onPress={() => setTitleModal(true)}
            >
              <Text>{title || "Select Title"}</Text>
            </Pressable>
            <Text style={defaultStyles.smallText}>
              Example : Mr/Ms/Mrs/Sir/Dr.
            </Text>
            <Pressable
              style={{ position: "absolute", right: 16, top: 35 }}
              onPress={() => setTitleModal(true)}
            >
              <Image source={require("../../assets/icons/arrow-down.png")} />
            </Pressable>
          </View>
          <TitleModal
            open={titleModal}
            setOpen={setTitleModal}
            setValue={setTitle}
          />

          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Name:</Text>
            <TextInput
              style={defaultStyles.input}
              placeholder="Enter your name"
              onChangeText={setName}
              value={name}
            />
          </View>
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
            setPassword={setPassword}
            password={password}
            placeholder="Enter your Password"
          />
          <PasswordInput
            label="Confirm Password:"
            setPassword={setConfirmPassword}
            password={confirmPassword}
            placeholder="Confirm your Password"
          />
        </View>
        <Pressable
          onPress={() => navigator.navigate("completeProfile")}
          style={[
            { marginTop: 44 },
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button,
          ]}
        >
          <Text style={{ ...styles.text, color: "white" }}>Proceed</Text>
        </Pressable>
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
          <Text style={styles.footerLinkText}>Terms and conditions</Text> and{" "}
          <Text style={styles.footerLinkText}>Privacy Policy</Text>
        </Text>
      </View>
    </ScrollView>
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
    paddingTop: 84,
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
