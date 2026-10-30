import { useMemo } from "react";
import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { Tokens } from "../../theme/tokens";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const { width: screenWidth } = Dimensions.get("window");

export default function SuccessModal({ visible, onClose }: Props) {
  const { tokens } = useTheme();
  const successStyles = useMemo(() => makeSuccessStyles(tokens), [tokens]);
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={successStyles.overlay}>
        <View style={[successStyles.content, { width: screenWidth }]}>
          <Image
            source={require("../../assets/icons/successful-reset-illustration.png")}
            style={successStyles.image}
          />
          <Text style={successStyles.title}>
            Story Recommended Successfully!
          </Text>

          <Pressable onPress={onClose} style={successStyles.button}>
            <Text style={successStyles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const makeSuccessStyles = (tokens: Tokens) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
      justifyContent: "flex-end",
    },
    content: {
      backgroundColor: tokens.surface,
      padding: 24,
      alignItems: "center",
      borderTopLeftRadius: 36,
      borderTopRightRadius: 36,
    },
    image: {
      alignSelf: "center",
    },
    title: {
      fontSize: 24,
      fontFamily: "quilka",
      color: tokens.textStrong,
      textAlign: "center",
      marginVertical: 16,
    },
    button: {
      backgroundColor: "transparent",
      borderColor: tokens.border,
      borderWidth: 1,
      width: "100%",
      paddingVertical: 16,
      borderRadius: 50,
      marginTop: 16,
    },
    buttonText: {
      textAlign: "center",
      color: tokens.textStrong,
      fontFamily: "abeezee",
    },
  });
