import { Profile } from "iconsax-react-nativejs";
import { Edit } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type AvatarProps = {
  uri?: string | null;
  size?: number;
  initials?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  edit?: boolean;
};

const KidAvatar: React.FC<AvatarProps> = ({
  uri,
  size = 80,
  onPress,
  style,
  edit,
}) => {
  const showImage = !!uri;

  const imageStyle: StyleProp<ImageStyle> = { width: size, height: size };

  const Content = (
    <>
      {showImage ? (
        <Image
          source={{ uri: uri }}
          style={[imageStyle]}
          className="rounded-full"
        />
      ) : (
        <Image
          source={require("../assets/avatars/Avatars-3.png")}
          style={[imageStyle]}
        />
      )}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      style={[styles.addPhotoButton, imageStyle]}
    >
      {Content}
      {edit && (
        <View
          className="absolute bottom-0 right-2 bg-white p-1 rounded-full"
          style={{ zIndex: 11 }}
        >
          {/* <Image source={require("../assets/icons/pen.png")} /> */}
          <Edit size={13} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  addPhotoButton: {
    borderRadius: 56,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
});

export default KidAvatar;
