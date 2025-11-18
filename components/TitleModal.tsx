import { Modal, Pressable, Text, View } from "react-native";

const options = ["Mr", "Mrs", "Ms", "Dr", "Sir"];
const TitleModal = ({
  open,
  setOpen,
  setValue,
}: {
  open: boolean;
  setOpen: (s: boolean) => void;
  setValue: (v: string) => void;
}) => {
  return (
    <Modal visible={open} transparent animationType="fade">
      <Pressable
        onPress={() => setOpen(false)}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          paddingHorizontal: 30,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 12,
          }}
        >
          {options.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => {
                setValue(opt);
                setOpen(false);
              }}
              style={{ paddingVertical: 10 }}
            >
              <Text>{opt}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

export default TitleModal;
