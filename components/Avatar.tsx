import { Profile } from "iconsax-react-nativejs";
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

type AvatarProps = {
  size?: number;
  edit?: boolean;
  initials?: string;
  backgroundColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const Avatar: React.FC<AvatarProps> = ({
  size = 110,
  edit,
  initials,
  backgroundColor = "#E5E7EB",
  onPress,
  style,
}) => {
  const { data } = useGetUserProfile();
  const uri = data?.data?.avatar?.url;
  console.log(data);

  const showImage = !!uri;

  const imageStyle: StyleProp<ImageStyle> = { width: size, height: size };

  const Content = (
    <>
      {showImage ? (
        <Image
          source={{ uri: uri as string }}
          style={imageStyle}
          resizeMode="cover"
          className="rounded-full"
        />
      ) : (
        <Profile size={size} variant="Bold" color="white" />
      )}
    </>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      // activeOpacity={0.8}
      style={[
        styles.addPhotoButton,
        { backgroundColor: "#EC4007", borderWidth: 0, marginBottom: 5 },
        imageStyle,
        style,
      ]}
    >
      {Content}

      {edit && (
        <View className="absolute bottom-0 right-1 bg-white p-2 rounded-full">
          <Image source={require("../assets/icons/pen.png")} />
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
