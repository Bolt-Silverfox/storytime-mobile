import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";
import useAuth from "../contexts/AuthContext";
import defaultStyles from "../styles";
import ErrorMessageDisplay from "./ErrorMessageDisplay";
import PasswordInput from "./PasswordInput";
import TitleModal from "./TitleModal";
import colours from "../colours";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../Navigation/RootNavigator";

const registerSchema = z
  .object({
    fullName: z.string().trim().min(1, "Name is required"),

    email: z.email("Invalid email, try again"),

    title: z.string().trim().min(1, "Title is required"),

    password: z
      .string()
      .min(8, "Password should be at least 8 characters long"),

    confirmPassword: z
      .string()
      .min(8, "Password should be at least 8 characters long"),
  })
  .refine((data) => data.fullName.split(" ").length >= 2, {
    path: ["fullName"],
    message: "Full name must contain at least two parts",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Both password fields must match",
  });

type RegisterSchema = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof RegisterSchema, string>>;

const SignupForm = () => {
  const [errors, setErrors] = useState<Errors>({});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [title, setTitle] = useState("");
  const [titleModal, setTitleModal] = useState(false);
  const { isLoading, errorMessage, signUp } = useAuth();
  const navigator = useNavigation<RootNavigatorProp>();

  const onRegister = async () => {
    setErrors({});
    const result = registerSchema.safeParse({
      fullName,
      email,
      title,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const formatted: any = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0];
        formatted[field] = err.message;
      });

      setErrors(formatted);
      return;
    }
    await signUp(email, password, fullName.trim(), title);
  };

  return (
    <View>
      <View style={styles.form}>
        {/* <ErrorMessageDisplay errorMessage={errorMessage} /> */}
        <View style={styles.formItem}>
          <Text style={defaultStyles.label}>Title:</Text>
          <Pressable
            className={`border rounded-full h-[50px] font-[abeezee] justify-center text-sm relative px-4 ${errors.title ? "border-red-600" : "border-border"}`}
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
            <Image source={require("../assets/icons/arrow-down.png")} />
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
            className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${errors.fullName ? "border-red-600" : "border-border"}`}
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
            className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${errors.email ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.email ? "red" : colours.text}
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
          // defaultStyles.button
        ]}
      >
        <Text style={{ ...styles.text, color: "white" }}>
          {isLoading ? "Loading..." : "Proceed"}
        </Text>
      </Pressable>
    </View>
  );
};

export default SignupForm;

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
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
});
