import { Edit, Profile } from "iconsax-react-nativejs";
import React, { useState } from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";
import { url } from "zod";
import { Pencil } from "lucide-react-native";

export type AvatarProps = {
  size?: number;
  edit?: boolean;
  initials?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const Avatar: React.FC<AvatarProps> = ({
  size = 110,
  edit,
  initials,
  onPress,
  style,
}) => {
  const { data } = useGetUserProfile();
  const uri = data?.avatar?.url;

  const showImage = !!uri;

  const imageStyle: StyleProp<ImageStyle> = {
    width: size,
    height: size,
    zIndex: 10,
  };

  const Content = (
    <>
      {showImage && (
        <Image
          source={{ uri: uri as string }}
          style={imageStyle}
          resizeMode="cover"
          className="rounded-full"
        />
      )}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.addPhotoButton,
        { backgroundColor: "#EC4007", borderWidth: 0, marginBottom: 5 },
        imageStyle,
        style,
      ]}
    >
      {Content}
      <Profile
        size={size}
        style={{ position: "absolute" }}
        variant="Bold"
        color="white"
      />

      {edit && (
        <View
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full"
          style={{ zIndex: 11 }}
        >
          {/* <Image source={require("../assets/icons/pen.png")} /> */}
          <Edit size={15} />
        </View>
      )}
    </TouchableOpacity>
  );

  // return <View>{Content}</View>;
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

export default Avatar;
