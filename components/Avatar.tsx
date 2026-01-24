import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import {
  Image,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
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
        {
          backgroundColor: "#EC4007",
          borderWidth: 0,
          marginBottom: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        },
        imageStyle,
        style,
      ]}
    >
      {Content}
      {!showImage && (
        <Ionicons size={0.7 * size} name="person-outline" color="white" />
      )}
      {edit && (
        <View
          className="absolute bottom-0 right-0 bg-white p-2 rounded-full"
          style={{ zIndex: 11 }}
        >
          <FontAwesome5 name="edit" size={15} color="black" />
        </View>
      )}
    </TouchableOpacity>
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

export default Avatar;
