import { Dispatch, SetStateAction, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import colours from "../colours";
import defaultStyles from "../styles";
import Icon from "./Icon";

type Props = {
  setPassword: Dispatch<SetStateAction<string>>;
  password: string;
  label: string;
  placeholder: string;
  errorMessage?: string;
};

const PasswordInput = ({
  setPassword,
  password,
  label,
  placeholder,
  errorMessage,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.formItemRelative}>
      <Text style={defaultStyles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        placeholderTextColor={errorMessage ? "red" : colours.text}
        className={`relative h-[50px] rounded-full border px-4 font-[abeezee] text-base text-black ${errorMessage ? "border-red-600" : "border-border"}`}
      />
      {errorMessage && (
        <Text className="text-sm text-red-600">{errorMessage}</Text>
      )}
      {!showPassword && (
        <Pressable
          onPress={() => setShowPassword(true)}
          style={styles.eyeImage}
        >
          <Icon name="Eye" color={colours.text} />
        </Pressable>
      )}
      {showPassword && (
        <Pressable
          onPress={() => setShowPassword(false)}
          style={styles.eyeImage}
        >
          <Icon name="EyeOff" color={colours.text} />
        </Pressable>
      )}
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  formItemRelative: {
    gap: 4,
    position: "relative",
  },
  eyeImage: {
    top: 37,
    right: 16,
    position: "absolute",
  },
});
