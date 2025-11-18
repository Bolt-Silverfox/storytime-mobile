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
import useAuth from "../../contexts/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = {
  fullName?: string;
  title?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const errorInitialState = {
  fullName: "",
  title: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<Errors>(errorInitialState);
  const [titleModal, setTitleModal] = useState(false);

  const { isLoading, errorMessage, signUp } = useAuth();
  console.log(errorMessage);

  const onRegister = async () => {
    try {
      setErrors(errorInitialState);
      if (password !== confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Both password fields must match",
          password: "Both password fields must match",
        }));
        return;
      } else if (!fullName.trim().length) {
        setErrors((prev) => ({
          ...prev,
          fullName: "Name is required",
        }));
        return;
      } else if (!emailRegex.test(email)) {
        setErrors((prev) => ({
          ...prev,
          email: "Invalid email, try again",
        }));
        return;
      } else if (!title.trim().length) {
        setErrors((prev) => ({
          ...prev,
          title: "Title is rerquired",
        }));
        return;
      } else if (password.length < 8 || confirmPassword.length < 8) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Password should be at least 8 characters long",
          password: "Password should be at least 8 characters long",
        }));
        return;
      }
      console.log("i reached here");
      await signUp(email, password, fullName, title);
    } catch (error) {}
  };

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: "100%",
        paddingTop: 46,
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
          {Array.isArray(errorMessage) && errorMessage.length ? (
            errorMessage.map((message) => (
              <Text key={message} className="text-red-600 text-sm">
                {message}
              </Text>
            ))
          ) : (
            <Text className="text-red-600 text-sm">{errorMessage}</Text>
          )}
          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Title:</Text>
            <Pressable
              className={`border rounded-full h-[50px] justify-center text-sm relative px-4 ${errorMessage ? "border-red-600" : "border-border"}`}
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
            {errors.title && (
              <Text className="text-red-600 text-sm">{errors.title}</Text>
            )}
          </View>
          <TitleModal
            open={titleModal}
            setOpen={setTitleModal}
            setValue={setTitle}
          />

          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Name:</Text>
            <TextInput
              className={`border rounded-full h-[50px] justify-center text-base text-black relative px-4 ${errors.fullName ? "border-red-600" : "border-border"}`}
              placeholderTextColor={errors.fullName ? "red" : colours.text}
              placeholder="Enter your name"
              onChangeText={setFullName}
              value={fullName}
            />
            {errors.fullName && (
              <Text className="text-red-600 text-sm">{errors.fullName}</Text>
            )}
          </View>
          <View style={styles.formItem}>
            <Text style={defaultStyles.label}>Email:</Text>
            <TextInput
              placeholder="Enter your email"
              onChangeText={setEmail}
              value={email}
              className={`border rounded-full h-[50px] justify-center text-base text-black relative px-4 ${errors.email ? "border-red-600" : "border-border"}`}
              placeholderTextColor={errors.fullName ? "red" : colours.text}
            />
            {errors.email && (
              <Text className="text-red-600 text-sm">{errors.email}</Text>
            )}
          </View>

          <PasswordInput
            label="Password:"
            setPassword={setPassword}
            password={password}
            placeholder="Enter your password"
            errorMessage={errors.password}
          />
          <PasswordInput
            label="Confirm Password:"
            setPassword={setConfirmPassword}
            password={confirmPassword}
            placeholder="Confirm your password"
            errorMessage={errors.confirmPassword}
          />
        </View>
        <Pressable
          onPress={onRegister}
          style={[
            { marginTop: 44 },
            isLoading ? defaultStyles.buttonDisabled : defaultStyles.button,
          ]}
        >
          <Text style={{ ...styles.text, color: "white" }}>
            {isLoading ? "Loading..." : "Proceed"}
          </Text>
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
