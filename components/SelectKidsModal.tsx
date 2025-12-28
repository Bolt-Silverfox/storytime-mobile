import React from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import ErrorMessageDisplay from "./ErrorMessageDisplay";
import LoadingOverlay from "./LoadingOverlay";
import CustomButton from "./UI/CustomButton";
import useGetUserKids from "../hooks/tanstack/queryHooks/useGetUserKids";
import EmptyKidsState from "./emptyState/EmptyKidsState";

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
  if (!data.length) return <EmptyKidsState onClose={onClose} />;
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/40" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="bg-white flex-1 rounded-t-3xl p-6 pb-12 absolute bottom-0 w-full"
        contentContainerClassName="min-h-full"
      >
        <Text className="text-lg font-[quilka] mb-4 text-center">
          Select Child to Manage
        </Text>

        {data.length > 0 ? (
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
                      source={
                        kid.avatar?.url
                          ? { uri: kid?.avatar?.url }
                          : require("../assets/avatars/Avatars-3.png")
                      }
                      className="size-12"
                    />
                    <Text className="text-base capitalize font-[abeezee]">
                      {kid.name.split(" ")[0]}
                    </Text>
                  </View>
                  <View
                    className={`
                    w-6 h-6 rounded-full border-2 
                    flex items-center justify-center
                    ${isSelected ? "border-blue" : "border-gray-300"}
                  `}
                  >
                    {isSelected && (
                      <View className="w-3 h-3 rounded-full bg-blue" />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <EmptyKidsState onClose={onClose} />
        )}
        <View className="flex flex-col">
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
            className="bg-transparent border self-center max-w-sm mx-auto border-black/20 py-4 rounded-full mt-4 w-full"
          >
            <Text className="text-center text-black font-[abeezee]">
              Cancel
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default KidSelectorModal;
