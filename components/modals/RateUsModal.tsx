import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import useModalPresentationGate from "../../hooks/useModalPresentationGate";

type PropTypes = {
  visible: boolean;
  /** Called when the user rates 4-5 stars: open the store for a public review. */
  onRate: () => void;
  /** Called when the user rates 1-3 stars: route to the in-app feedback form. */
  onSendFeedback: () => void;
  /** Called on "Not now" — an explicit decision, persisted. */
  onDismiss: () => void;
  /**
   * Called when the sheet is closed without a decision (scrim tap, hardware
   * back). Must NOT be persisted: the prompt shows once per account, so
   * treating an incidental dismissal as final silently burns it.
   */
  onCancel: () => void;
};

/** The store this build actually links to, for copy that names it. */
const STORE_NAME = Platform.select({
  ios: "App Store",
  default: "Play Store",
});

/** 4+ stars is treated as a happy rating and routed to the store. */
const STORE_RATING_THRESHOLD = 4;

/**
 * "Are you enjoying Storytime4Kids?" rating gate, shown once after a user
 * finishes their first story. The user picks a star rating: 4-5 stars opens the
 * store for a public review; 1-3 stars routes to the in-app feedback form so
 * unhappy feedback reaches us privately instead of the store.
 */
const RateUsModal = ({
  visible,
  onRate,
  onSendFeedback,
  onDismiss,
  onCancel,
}: PropTypes) => {
  const [rating, setRating] = useState(0);

  // Start each open with a fresh, unselected rating.
  useEffect(() => {
    if (visible) setRating(0);
  }, [visible]);

  // Presenting a Modal while a screen is still transitioning leaves an empty
  // modal window on top: nothing renders, but it swallows every touch. The
  // prompt fires right as the reader is being pushed, so it hit this reliably.
  const canPresent = useModalPresentationGate(visible);

  const isPositive = rating >= STORE_RATING_THRESHOLD;
  const primaryLabel = isPositive
    ? `Rate on ${STORE_NAME}`
    : "Send us feedback";

  const handlePrimary = () => {
    if (rating === 0) return;
    if (isPositive) onRate();
    else onSendFeedback();
  };

  return (
    <Modal
      visible={visible && canPresent}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <Pressable onPress={onCancel} style={styles.overlay}>
        <Pressable style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <FontAwesome5 name="star" size={36} solid color="#ECC607" />
            </View>
            <Text style={styles.title}>Are you enjoying Storytime4Kids?</Text>
            <Text style={styles.subtitle}>
              We would greatly appreciate if you could take a moment to rate
              Storytime4kids on the {STORE_NAME}. Your feedback is crucial in
              helping others discover the value of our service.
            </Text>
          </View>

          <View style={styles.starSection}>
            <View style={styles.divider} />
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setRating(value)}
                  hitSlop={6}
                  accessibilityRole="button"
                  aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
                  accessibilityState={{ selected: value <= rating }}
                >
                  <FontAwesome5
                    name="star"
                    size={44}
                    solid={value <= rating}
                    color={value <= rating ? "#ECC607" : "#D0D0D0"}
                  />
                </Pressable>
              ))}
            </View>
            <View style={styles.divider} />
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={handlePrimary}
              disabled={rating === 0}
              style={[
                styles.primaryButton,
                rating === 0 && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
            </Pressable>

            <Pressable onPress={onDismiss} style={styles.dismissButton}>
              <Text style={styles.dismissButtonText}>Not now</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(33, 33, 33, 0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ECC607",
  },
  title: {
    fontFamily: "quilka",
    fontSize: 28,
    color: "#212121",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "abeezee",
    fontSize: 14,
    lineHeight: 20,
    color: "#616161",
    textAlign: "center",
  },
  starSection: {
    width: "100%",
    gap: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "#E0E0E0",
  },
  stars: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  actions: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#EC4007",
    borderRadius: 99,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#FF8771",
  },
  primaryButtonText: {
    fontFamily: "abeezee",
    fontSize: 16,
    color: "white",
  },
  dismissButton: {
    borderWidth: 0.5,
    borderColor: "#212121",
    borderRadius: 99,
    paddingVertical: 12,
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
