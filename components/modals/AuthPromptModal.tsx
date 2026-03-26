import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import useAuth from "../../contexts/AuthContext";

type Props = {
  visible: boolean;
  onClose: () => void;
  message?: string;
};

const AuthPromptModal = ({
  visible,
  onClose,
  message = "Create an account to unlock this feature.",
}: Props) => {
  const navigation = useNavigation<RootNavigatorProp>();
  const { exitGuestMode } = useAuth();

  const handleSignUp = async () => {
    onClose();
    await exitGuestMode();
    setTimeout(() => {
      navigation.navigate("auth", { screen: "signUp" });
    }, 100);
  };

  const handleLogin = async () => {
    onClose();
    await exitGuestMode();
    setTimeout(() => {
      navigation.navigate("auth", { screen: "login" });
    }, 100);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="user-plus" size={32} color="#866EFF" />
          </View>
          <Text style={styles.title}>Join Storytime</Text>
          <Text style={styles.message}>{message}</Text>
          <Pressable onPress={handleSignUp} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </Pressable>
          <Pressable onPress={handleLogin} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </Pressable>
          <Pressable onPress={onClose} style={styles.dismissButton}>
            <Text style={styles.dismissText}>Not Now</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(33, 33, 33, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  sheet: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "quilka",
    fontSize: 22,
    fontWeight: "700",
    color: "#212121",
    textAlign: "center",
  },
  message: {
    fontFamily: "abeezee",
    fontSize: 14,
    color: "#616161",
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#EC4007",
    borderRadius: 99,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  primaryButtonText: {
    fontFamily: "abeezee",
    fontSize: 16,
    color: "white",
  },
  secondaryButton: {
    borderWidth: 0.5,
    borderColor: "#4A413F",
    borderRadius: 99,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontFamily: "abeezee",
    fontSize: 16,
    color: "#212121",
  },
  dismissButton: {
    paddingVertical: 8,
  },
  dismissText: {
    fontFamily: "abeezee",
    fontSize: 14,
    color: "#616161",
  },
});

export default AuthPromptModal;
