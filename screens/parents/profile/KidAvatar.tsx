import { Pressable, Image, View } from "react-native";

interface KidAvatarProps {
  uri?: string;
  size: number;
  onPress?: () => void;
}

const KidAvatar = ({ uri, size, onPress }: KidAvatarProps) => {
  const avatar = uri ? (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      resizeMode="cover"
    />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#DDD",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Add default avatar icon here if needed */}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={{ borderRadius: size / 2 }}>
        {avatar}
      </Pressable>
    );
  }

  return avatar;
};

export default KidAvatar;