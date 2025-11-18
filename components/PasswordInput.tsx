import { Dispatch, SetStateAction, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import defaultStyles from "../styles";

type Props = {
  setPassword: Dispatch<SetStateAction<string>>;
  password: string;
  label: string;
  placeholder: string;
};
const PasswordInput = ({
  setPassword,
  password,
  label,
  placeholder,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View
      style={{
        ...styles.formItem,
        position: "relative",
      }}
    >
      <Text style={defaultStyles.label}>{label}</Text>
      <TextInput
        style={defaultStyles.input}
        placeholder={placeholder}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={showPassword}
      />
      {!showPassword && (
        <Pressable
          onPress={() => setShowPassword(true)}
          style={styles.eyeImage}
        >
          <Image
            alt="show password icon"
            source={require("../assets/icons/eye-hidden.png")}
          />
        </Pressable>
      )}
      {showPassword && (
        <Pressable
          onPress={() => setShowPassword(false)}
          style={styles.eyeImage}
        >
          <Image
            alt="show password icon"
            source={require("../assets/icons/eye-hidden.png")}
          />
        </Pressable>
      )}
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  formItem: {
    gap: 4,
  },
  eyeImage: {
    top: 37,
    right: 16,
    position: "absolute",
  },
});
