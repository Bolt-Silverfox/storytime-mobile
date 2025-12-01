import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  useWindowDimensions,
} from "react-native";
import React from "react";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  KidsProfileNavigatorParams,
  kidsProfileNavigatorProp,
} from "../../../Navigation/KidsProfileNavigator";
import useGetAvatars from "../../../hooks/tanstack/queryHooks/useGetAvatars";
import { SystemAvatar } from "../../../types";
import { useAssignKidAvatar } from "../../../hooks/tanstack/mutationHooks/useAssignKidAvatar";
type RouteProps = RouteProp<KidsProfileNavigatorParams, "changeKidAvatar">;

export default function ChangeKidAvatar() {
  const [selectedAvatarId, setSelectedAvatarId] = React.useState<string | null>(
    null
  );
  const navigator = useNavigation<kidsProfileNavigatorProp>();
  const { params } = useRoute<RouteProps>();
  const { width } = useWindowDimensions();
  const { data: avatars, isLoading } = useGetAvatars();
  const { mutateAsync: updateKid, isPending } = useAssignKidAvatar(
    params.childId,
    () => navigator.goBack()
  );
  const kidsAvatars: SystemAvatar[] = avatars?.data?.data || [];

  const avatarSize = (width - 48) / 3;

  const handleSelectAvatar = (avatar: SystemAvatar) => {
    setSelectedAvatarId(avatar.id);
  };

  const handleSave = () => {
    if (!selectedAvatarId) {
      alert("Please select an avatar");
      return;
    }
    updateKid(selectedAvatarId);
  };

  return (
    <View className="flex-1 bg-white ">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable
          className="absolute left-0 p-4"
          onPress={() => navigator.goBack()}
        >
          <ChevronLeft size={24} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
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
        <Pressable className="pb-10" disabled={isPending} onPress={handleSave}>
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full ${
              isPending ? "bg-gray-400" : "bg-[#EC4007]"
            }`}
          >
            {isPending ? "Saving..." : "Save"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
