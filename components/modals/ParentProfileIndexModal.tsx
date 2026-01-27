import { Alert, Modal, Pressable, Text, View } from "react-native";

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

      <View className="bg-white rounded-t-3xl p-6 pb-12 absolute px-3 bottom-0 w-full">
        <View className="h-[6px] w-[68px] bg-[#C5C5C5] mx-auto rounded-[32px] mb-[28px]" />

        <View className="flex flex-col gap-y-3 mt-5">
          <Text className="text-2xl font-[quilka] mb-4 text-center px-5">
            {modalData?.prompt}
          </Text>
          <Text className="text-lg text-[#616161] font-[abeezee] mb-4 text-center px-5">
            {modalData?.info}
          </Text>
          <Pressable
            onPress={() => setOpen(false)}
            className="bg-primary py-4 w-full rounded-full"
          >
            <Text className="text-white font-[abeezee] text-center text-base">
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
            className="bg-transparent border border-primary py-4 w-full rounded-full"
          >
            <Text className="text-black font-[abeezee] text-center text-base">
              {modalData?.confirm}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default ParentProfileModal;
