import React from "react";
import { Alert, Image, Modal, Pressable, Text, View } from "react-native";
import ErrorMessageDisplay from "./ErrorMessageDisplay";
import LoadingOverlay from "./LoadingOverlay";
import CustomButton from "./UI/CustomButton";
import useGetUserKids from "../hooks/tanstack/queryHooks/useGetUserKids";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  handleNavigate: () => void;
  selectedKidId: string;
  setSelectedKId: (id: string) => void;
};

const KidSelectorModal = ({
  isOpen,
  onClose,
  handleNavigate,
  selectedKidId,
  setSelectedKId,
}: Props) => {
  const { data, isPending, error } = useGetUserKids();
  if (isPending) return <LoadingOverlay visible={isPending} />;
  if (error) return <ErrorMessageDisplay errorMessage={error.message} />;
  if (!data.length) return <EmptyState />;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />

      <View className="bg-white rounded-t-3xl p-6 pb-12 absolute bottom-0 w-full">
        <Text className="text-lg font-[quilka] mb-4 text-center">
          Select Child to Manage
        </Text>

        <View className="flex flex-col gap-y-3">
          {data.map((kid) => {
            const isSelected = selectedKidId === kid.id;

            return (
              <Pressable
                key={kid.id}
                onPress={() => setSelectedKId(kid.id)}
                className="flex-row items-center justify-between py-4 px-4 rounded-2xl"
              >
                <View className="flex-row items-center gap-x-3">
                  <Image
                    source={require("../../../assets/placeholder-pfp.png")}
                    alt="Kid's profi          onClose={() => setIsModalOpen(false)}
le image"
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                  <Text className="text-base capitalize font-[abeezee]">
                    {kid.name.split(" ")[0]}
                  </Text>
                </View>
                <View
                  className={`
                    w-6 h-6 rounded-full border-2 
                    flex items-center justify-center
                    ${isSelected ? "border-blue-600" : "border-gray-300"}
                  `}
                >
                  {isSelected && (
                    <View className="w-3 h-3 rounded-full bg-blue-600" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View>
          <CustomButton
            text="Continue"
            onPress={() => {
              if (!selectedKidId.length) {
                Alert.alert("No kid selected");
                return;
              }
              handleNavigate();
              onClose();
            }}
          />
          <Pressable
            onPress={onClose}
            className="bg-transparent border border-black/20 w-full py-4 rounded-full mt-4 max-w-screen-sm mx-auto"
          >
            <Text className="text-center text-black font-[abeezee]">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default KidSelectorModal;

const EmptyState = () => {
  return (
    <View className="flex flex-col gap-y-3 flex-1 justify-center items-center">
      <Text className="font-[quilka] text-primary text-3xl text-center">
        No child added yet{" "}
      </Text>
    </View>
  );
};
