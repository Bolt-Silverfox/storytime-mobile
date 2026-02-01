import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  open: "delete" | "logout" | boolean;
  setOpen: React.Dispatch<React.SetStateAction<"delete" | "logout" | boolean>>;
  logout: () => void;
  deleteAccount: () => void;
};

const ParentProfileModal = ({
  open,
  setOpen,
  logout,
  deleteAccount,
}: Props) => {
  let modalData;
  if (open === "logout") {
    modalData = {
      prompt: "Are you sure you want to logout of this device?",
      confirm: "Yes, log out",
    };
  } else {
    modalData = {
      prompt: "Are you sure you want to delete your account?",
      confirm: "Yes, Delete my account",
      info: "If you proceed, all information connected to this account will be permanently deleted from our database.",
    };
  }

  return (
    <Modal
      visible={open != false ? true : false}
      transparent
      animationType="slide"
      // onRequestClose={on}
    >
      <Pressable
        onPress={() => setOpen(false)}
        className="flex-1 bg-black/40"
      />

      <View className="absolute bottom-0 w-full rounded-t-3xl bg-white p-6 px-3 pb-12">
        <View className="mx-auto mb-[28px] h-[6px] w-[68px] rounded-[32px] bg-[#C5C5C5]" />

        <View className="mt-5 flex flex-col gap-y-3">
          <Text className="mb-4 px-5 text-center font-[quilka] text-2xl">
            {modalData?.prompt}
          </Text>
          <Text className="mb-4 px-5 text-center font-[abeezee] text-lg text-[#616161]">
            {modalData?.info}
          </Text>
          <Pressable
            onPress={() => setOpen(false)}
            className="w-full rounded-full bg-primary py-4"
          >
            <Text className="text-center font-[abeezee] text-base text-white">
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setOpen(false);
              setTimeout(() => {
                if (open === "logout") {
                  logout();
                } else {
                  deleteAccount();
                }
              }, 500);
            }}
            className="w-full rounded-full border border-primary bg-transparent py-4"
          >
            <Text className="text-center font-[abeezee] text-base text-black">
              {modalData?.confirm}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ParentProfileModal;
