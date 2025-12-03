import React, { ReactNode } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import defaultStyles from "../../styles";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../Navigation/ParentProfileNavigator";
import useGetAvatars from "../../hooks/tanstack/queryHooks/useGetAvatars";
import { SystemAvatar } from "../../types";
import LoadingOverlay from "../LoadingOverlay";
import { ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatarId: string | null;
  setSelectedAvatarId: React.Dispatch<React.SetStateAction<string | null>>;
};

const ChooseChildAvatarModal = ({
  isOpen,
  onClose,
  selectedAvatarId,
  setSelectedAvatarId,
}: Props) => {
  const { width } = useWindowDimensions();
  const { data: avatars, isLoading, isFetching } = useGetAvatars();
  const kidsAvatars: SystemAvatar[] = avatars?.data || [];
  const inset = useSafeAreaInsets();

  const avatarSize = (width - 48) / 3;

  const handleSelectAvatar = (avatar: SystemAvatar) => {
    setSelectedAvatarId(avatar.id);
  };

  const handleSave = () => {
    if (!selectedAvatarId) {
      alert("Please select an avatar");
      return;
    }
    onClose();
  };
  return (
    <Modal
      visible={isOpen}
      //   transparent
      animationType="slide"
      //   onRequestClose={onClose}
    >
      <View
        style={{ paddingTop: inset.top }}
        className="bg-white gap-y-8    pb-12 flex-1 w-full"
      >
        <View className="flex-1 bg-[bg-light] ">
          <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
            <Pressable className="absolute left-0 p-4" onPress={onClose}>
              <ChevronLeft size={24} />
            </Pressable>
            <Text
              style={[
                defaultStyles.defaultText,
                { color: "black", fontSize: 18 },
              ]}
              className="self-center text-center  "
            >
              Select Avatar
            </Text>
          </View>
          <FlatList
            data={kidsAvatars}
            numColumns={3}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            columnWrapperStyle={{ gap: 12 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectAvatar(item)}
                style={{
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: "100%",
                  overflow: "hidden",
                  borderWidth: selectedAvatarId === item.id ? 6 : 0,
                  borderColor:
                    selectedAvatarId === item.id ? "#EC4007" : "transparent",
                }}
              >
                <Image
                  source={{ uri: item.url }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </Pressable>
            )}
            scrollEnabled
          />
          <View className=" justify-end  px-4 gap-6">
            <Pressable className="pb-10" onPress={handleSave}>
              <Text
                style={[defaultStyles.defaultText, { color: "white" }]}
                className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full ${"bg-[#EC4007]"}`}
              >
                Select
              </Text>
            </Pressable>
          </View>
          <LoadingOverlay visible={isLoading || isFetching} />
        </View>
      </View>
    </Modal>
  );
};

export default ChooseChildAvatarModal;
