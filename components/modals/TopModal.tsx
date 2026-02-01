import { Dimensions, Pressable, View, StyleSheet } from "react-native";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const { height } = Dimensions.get("window");

const TopModal = ({ isOpen, onClose, children }: Props) => {
  if (!isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Pressable style={styles.overlay} onPress={onClose} />
      <View
        className="rounded-b-2xl  bg-white p-4"
        style={{ maxHeight: height * 0.7 }}
      >
        {children}
      </View>
    </View>
  );
};

export default TopModal;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
