import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import {
  Image,
  ImageStyle,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import useGetUserProfile from "../hooks/tanstack/queryHooks/useGetUserProfile";

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
    <Pressable
      onPress={onPress}
      style={[styles.addPhotoButton, styles.avatarContainer, imageStyle, style]}
    >
      {Content}
      {!showImage && (
        <Ionicons size={0.7 * size} name="person-outline" color="white" />
      )}
      {edit && (
        <View
          className="absolute bottom-0 right-0 rounded-full bg-white p-2"
          style={styles.editIcon}
        >
          <FontAwesome5 name="edit" size={15} color="black" />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  addPhotoButton: {
    borderRadius: 56,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  avatarContainer: {
    backgroundColor: "#EC4007",
    borderWidth: 0,
    marginBottom: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    zIndex: 11,
  },
});

export default Avatar;
