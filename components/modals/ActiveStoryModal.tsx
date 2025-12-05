import { Image, Pressable, Switch, Text, View } from "react-native";
import ChildButton from "../UI/ChildButton";
import CustomModal from "./CustomModal";
import { Dispatch, SetStateAction, useState } from "react";

const ActiveStoryModal = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedOption, setSelectedOption] = useState<"edit" | "delete">(
    "edit"
  );
  const [activeTab, setActiveTab] = useState<"normal" | "delete">("normal");

  const handleContinue = () => {
    if (selectedOption === "delete") {
      setActiveTab("delete");
      return;
    }
  };
  return (
    <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {activeTab === "normal" ? (
        <View className="flex flex-col px-5">
          <Text className="text-2xl text-center font-[quilka]">
            What do you want to do?
          </Text>
          <Pressable className="py-10 flex flex-row justify-between items-center border-b border-border/20">
            <Text className="text-xl text-black font=[abeezee]">
              Edit story parameters
            </Text>
            <Switch
              value={selectedOption === "edit"}
              onValueChange={() => setSelectedOption("edit")}
            />
          </Pressable>
          <Pressable className="py-10 flex flex-row justify-between items-center">
            <Text className="text-xl text-black font=[abeezee]">
              Delete story
            </Text>
            <Switch
              value={selectedOption === "delete"}
              onValueChange={() => setSelectedOption("delete")}
            />
          </Pressable>
          <ChildButton
            icon="ArrowRight"
            text="Continue"
            onPress={handleContinue}
          />
        </View>
      ) : (
        <View className="flex flex-col px-5 relative">
          <Text className="text-2xl mb-5 text-center font-[quilka]">
            Delete generated story
          </Text>
          <Text className="text-xl text-text font=[abeezee] text-center">
            You are about to remove a story you generated, are you sure?
          </Text>
          <ChildButton
            icon="ArrowRight"
            text="Delete story"
            onPress={() => {}}
          />
          <Pressable
            className="mt-10 absolute right-0 -top-14"
            onPress={() => setActiveTab("normal")}
          >
            <Image
              source={require("../../assets/icons/cancel.png")}
              className="size-12 "
            />
          </Pressable>
        </View>
      )}
    </CustomModal>
  );
};

export default ActiveStoryModal;
