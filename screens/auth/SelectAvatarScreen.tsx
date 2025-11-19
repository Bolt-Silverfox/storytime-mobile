import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import defaultStyles from "../../styles";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import * as ImagePicker from "expo-image-picker";

type RouteParams = {
  onPick?: (uri: string) => void;
  kidIndex?: number;
};

const builtInAvatars = [
  require("../../assets/avatars/Avatars-8.png"),
  require("../../assets/avatars/Avatars-7.png"),
  require("../../assets/avatars/Avatars-1.png"),
  require("../../assets/avatars/Avatars-2.png"),
  require("../../assets/avatars/Avatars-3.png"),
  require("../../assets/avatars/Avatars-4.png"),
  require("../../assets/avatars/Avatars-4.png"),
  require("../../assets/avatars/Avatars-5.png"),
  require("../../assets/avatars/Avatars-6.png"),
  require("../../assets/avatars/Avatars-9.png"),
  require("../../assets/avatars/Avatars-9.png"),
  require("../../assets/avatars/Avatars-3.png"),
];

export default function AvatarScreen() {
  const navigator = useNavigation<RootNavigatorProp>();
  const route = useRoute();
  const params = (route.params as RouteParams) || {};
  const { onPick, kidIndex } = params;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  //     if (onPick) {
  //       onPick(
  //         Image.resolveAssetSource
  //           ? Image.resolveAssetSource(source).uri
  //           : String(source)
  //       );
  //     }
  //     navigation.goBack();
  //   };

  //   const pickImageFromLibrary = async () => {
  //     try {
  //       const res = await launchImageLibrary({
  //         mediaType: "photo",
  //         quality: 0.8,
  //         selectionLimit: 1,
  //       });

  //       if (res.didCancel) return;
  //       if (res.errorCode) {
  //         Alert.alert("Image Picker Error", res.errorMessage || "Unknown error");
  //         return;
  //       }

  //       const asset = res.assets && res.assets[0];
  //       if (!asset) return;

  //       const uri = asset.uri;
  //       if (!uri) {
  //         Alert.alert("Upload failed", "Could not get image URI");
  //         return;
  //       }

  //       if (onPick) onPick(uri);
  //       navigation.goBack();
  //     } catch (e) {
  //       Alert.alert(
  //         "Upload error",
  //         "Something went wrong while picking the image."
  //       );
  //     }
  //   };

  const getAssetUri = (asset: any) => {
    try {
      const resolved = Image.resolveAssetSource
        ? Image.resolveAssetSource(asset)
        : null;
      return resolved && resolved.uri ? resolved.uri : String(asset);
    } catch {
      return String(asset);
    }
  };

  const pickBuiltIn = (index: number) => {
    setSelectedIndex(index);
  };

  const confirmSelection = () => {
    if (selectedIndex === null) {
      Alert.alert("No avatar selected", "Please pick an avatar or upload one.");
      return;
    }
    const uri = getAssetUri(builtInAvatars[selectedIndex]);
    if (onPick) onPick(uri);
    navigator.goBack();
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission required", "Media library access is needed.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedIndex(null);
      if (onPick) onPick(uri);
      navigator.goBack();
    }
  };
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "hsla(15,100%,99%,0.98)" }}
    >
      <View className="relative items-center justify-center py-4 mb-4 bg-white">
        <Pressable
          onPress={() => navigator.goBack()}
          className="absolute left-0 px-4"
        >
          <Image
            className="w-5 h-5"
            source={require("../../assets/icons/arrow-left.png")}
          />
        </Pressable>

        <Text style={defaultStyles.defaultText} className="text-center">
          Select avatar
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="flex-row flex-wrap gap-y-3 justify-between items-center">
          {builtInAvatars.map((img, i) => {
            const isSelected = i === selectedIndex;
            return (
              <Pressable
                key={i}
                onPress={() => pickBuiltIn(i)}
                accessibilityLabel={`Select avatar ${i + 1}`}
                className="w-1/3"
              >
                <Image
                  source={img}
                  className="w-full h-24 rounded-full"
                  style={[
                    { aspectRatio: 1 },
                    isSelected
                      ? {
                          transform: [{ scale: 1.03 }],
                          borderWidth: 3,
                          borderColor: "#ea580c",
                          borderRadius: 999,
                        }
                      : {},
                  ]}
                  resizeMode="cover"
                />
              </Pressable>
            );
          })}
        </View>

        <View className="mt-16">
          <Pressable
            onPress={confirmSelection}
            className="bg-orange-600 py-3 items-center rounded-full mb-12"
          >
            <Text className="text-white font-semibold">Select</Text>
          </Pressable>
          <Pressable onPress={pickImage} className="items-center">
            <Text style={defaultStyles.linkText} className="font-semibold">
              Upload an Image
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
