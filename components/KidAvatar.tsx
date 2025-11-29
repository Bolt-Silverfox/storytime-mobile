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

type AvatarProps = {
  uri?: string | null;
  size?: number;
  initials?: string;
  backgroundColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const KidAvatar: React.FC<AvatarProps> = ({
  uri,
  size = 48,
  initials,
  backgroundColor = "#E5E7EB",
  onPress,
  style,
}) => {
  const [imageError, setImageError] = useState(false);

  const showImage = !!uri && !imageError;

  const wrapperStyle: StyleProp<ViewStyle> = [
    styles.container,
    { width: size, height: size, borderRadius: size / 2, backgroundColor },
    style,
  ];

  const imageStyle: StyleProp<ImageStyle> = { width: size, height: size };

  const Content = (
    <>
      {showImage ? (
        <Image
          source={{ uri: uri as string }}
          style={imageStyle}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <Image
          source={require("../assets/avatars/Avatars-5.png")}
          className="mx-auto"
          style={imageStyle}
        />
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        // activeOpacity={0.8}
        style={[
          styles.addPhotoButton,
          { backgroundColor: "#EC4007", borderWidth: 0, marginBottom: 5 },
        ]}
      >
        {Content}
        <View className="absolute bottom-0 right-1 bg-white p-2 rounded-full">
          <Image source={require("../assets/icons/pen.png")} />
        </View>
      </TouchableOpacity>
    );
  }

  return <View>{Content}</View>;
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  addPhotoButton: {
    position: "absolute",
    left: "50%",
    bottom: -56,
    marginLeft: -56,
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  initials: {
    color: "#374151",
    fontWeight: "600",
  },
});

export default KidAvatar;
