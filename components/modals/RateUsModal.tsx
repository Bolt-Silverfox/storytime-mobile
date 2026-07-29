import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type PropTypes = {
  visible: boolean;
  onRate: () => void;
  onDismiss: () => void;
};

/**
 * "Are you enjoying Storytime4Kids?" prompt shown once, after a user finishes
 * their first story and opens another. Primary action opens the store to rate;
 * the secondary action dismisses (and it never shows again).
 */
const RateUsModal = ({ visible, onRate, onDismiss }: PropTypes) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <Pressable onPress={onDismiss} style={modalStyles.overlay}>
        <Pressable style={modalStyles.card}>
          <View style={modalStyles.iconCircle}>
            <FontAwesome5 name="star" size={40} color="#F4845F" solid />
          </View>

          <Text style={modalStyles.title}>
            Are you enjoying Storytime4Kids?
          </Text>

          <Text style={modalStyles.subtitle}>
            We'd love it if you took a moment to rate Storytime4Kids on the
            store.
          </Text>

          <View style={modalStyles.actions}>
            <Pressable onPress={onRate} style={modalStyles.rateButton}>
              <Text style={modalStyles.rateButtonText}>Rate Us</Text>
            </Pressable>

            <Pressable onPress={onDismiss} style={modalStyles.dismissButton}>
              <Text style={modalStyles.dismissButtonText}>Not now</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(33, 33, 33, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    gap: 16,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: "#F96B3C",
    backgroundColor: "white",
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
  subtitle: {
    fontFamily: "abeezee",
    fontSize: 14,
    color: "#616161",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  actions: {
    width: "100%",
    gap: 12,
    marginTop: 4,
  },
  rateButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 99,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  rateButtonText: {
    fontFamily: "abeezee",
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  dismissButton: {
    borderWidth: 0.5,
    borderColor: "#212121",
    borderRadius: 99,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissButtonText: {
    fontFamily: "abeezee",
    fontSize: 16,
    color: "#212121",
  },
});

export default RateUsModal;
