import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import type { Tokens } from "../../theme/tokens";

function generateChallenge() {
  const a = Math.floor(Math.random() * 20) + 10; // 10-29
  const b = Math.floor(Math.random() * 20) + 10; // 10-29
  return { question: `${a} + ${b}`, answer: a + b };
}

type Props = {
  visible: boolean;
  onPass: () => void;
  onCancel: () => void;
};

export default function ParentalGateModal({
  visible,
  onPass,
  onCancel,
}: Props) {
  const { tokens } = useTheme();
  const styles = useMemo(() => makeStyles(tokens), [tokens]);
  const [challenge, setChallenge] = useState(generateChallenge);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (visible) {
      setChallenge(generateChallenge());
      setInput("");
      setError(false);
    }
  }, [visible]);

  const handleSubmit = useCallback(() => {
    if (Number(input) === challenge.answer) {
      onPass();
    } else {
      setError(true);
      setChallenge(generateChallenge());
      setInput("");
    }
  }, [input, challenge.answer, onPass]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable onPress={onCancel} style={styles.backdrop}>
        <Pressable onPress={() => {}} style={styles.card}>
          <Text style={styles.title}>Parental Verification</Text>
          <Text style={styles.subtitle}>
            To continue, please solve this math problem.
          </Text>

          <Text style={styles.question}>What is {challenge.question}?</Text>

          <TextInput
            value={input}
            onChangeText={(t) => {
              setInput(t.replace(/[^0-9]/g, ""));
              setError(false);
            }}
            keyboardType="number-pad"
            placeholder="Your answer"
            style={styles.input}
            autoFocus
          />

          {error && (
            <Text style={styles.error}>Incorrect, please try again.</Text>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!input}
              style={[
                styles.button,
                styles.submitButton,
                !input && styles.disabled,
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.submitText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const makeStyles = (tokens: Tokens) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    card: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: tokens.surface,
      borderRadius: 24,
      padding: 24,
      gap: 12,
    },
    title: {
      fontFamily: "quilka",
      fontSize: 22,
      color: tokens.textStrong,
      textAlign: "center",
    },
    subtitle: {
      fontFamily: "abeezee",
      fontSize: 14,
      color: tokens.textBody,
      textAlign: "center",
    },
    question: {
      fontFamily: "abeezee",
      fontSize: 20,
      color: tokens.textStrong,
      textAlign: "center",
      marginTop: 8,
    },
    input: {
      fontFamily: "abeezee",
      fontSize: 18,
      textAlign: "center",
      borderWidth: 1,
      borderColor: tokens.borderInput,
      color: tokens.textStrong,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 4,
    },
    error: {
      fontFamily: "abeezee",
      fontSize: 13,
      color: tokens.danger,
      textAlign: "center",
    },
    buttons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 100,
      alignItems: "center",
    },
    cancelButton: {
      backgroundColor: tokens.fillMuted,
    },
    submitButton: {
      backgroundColor: "#866EFF",
    },
    disabled: {
      opacity: 0.5,
    },
    cancelText: {
      fontFamily: "abeezee",
      fontSize: 15,
      color: tokens.textBody,
    },
    submitText: {
      fontFamily: "abeezee",
      fontSize: 15,
      color: "#fff",
    },
  });
