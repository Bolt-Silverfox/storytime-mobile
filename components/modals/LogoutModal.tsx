import { Alert, Modal, Pressable, Text, View } from "react-native";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
};

const LogoutModal = ({ open, setOpen, logout }: Props) => {
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      // onRequestClose={on}
    >
      <Pressable
        onPress={() => setOpen(false)}
        className="flex-1 bg-black/40"
      />

      <View className="bg-white rounded-t-3xl p-6 pb-12 absolute px-3 bottom-0 w-full">
        <View className="h-[6px] w-[68px] bg-[#C5C5C5] mx-auto rounded-[32px] my-[28px]" />

        <View className="flex flex-col gap-y-3 mt-5">
          <Text className="text-2xl font-[quilka] mb-4 text-center px-5">
            Are you sure you want to logout of this device?
          </Text>
          <Pressable
            onPress={() => setOpen(false)}
            className="bg-primary py-4 w-full max-w-96 rounded-full mx-auto"
          >
            <Text className="text-white font-[abeezee] text-center text-base">
              cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOpen(false);
              setTimeout(() => {
                logout();
              }, 1000);
            }}
            className="bg-transparent border border-primary py-4 w-full max-w-96 rounded-full mx-auto"
          >
            <Text className="text-black font-[abeezee] text-center text-base">
              Yes,Log out
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutModal;
