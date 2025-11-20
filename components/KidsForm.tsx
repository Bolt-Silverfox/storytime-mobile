import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
  Platform,
  UIManager,
  LayoutAnimation,
  Alert,
} from "react-native";
import { Pencil } from "lucide-react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

export interface Kid {
  name: string;
  ageRange: string;
  avatar?: string;
}

type Props = {
  index: number;
  kid: Kid;
  onChange: (patch: Partial<Kid>) => void;
  navigation: NavigationProp<ParamListBase>;
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  // enable layout animation on Android
  // @ts-ignore
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function KidsForm({ index, kid, onChange, navigation }: Props) {
  const [ageOpen, setAgeOpen] = useState(false);
  const ageOptions = ["1-4", "5-8", "9-12"];

  const setField = (field: keyof Kid, value: string | null | undefined) =>
    onChange({ [field]: value } as Partial<Kid>);

  const toggleAge = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAgeOpen((s) => !s);
  };

  return (
    <View className="mb-4">
      <TouchableOpacity
        className="flex-row items-end gap-1 mb-3"
        onPress={() =>
          // navigation.navigate("avatarScreen", {
          //   onPick: (avatarUri: string) => setField("avatar", avatarUri),
          //   kidIndex: index,
          // })
          Alert.alert("coming soon")
        }
      >
        <Image
          source={
            kid.avatar
              ? { uri: kid.avatar }
              : require("../assets/icons/null-avatar.png")
          }
          className="w-16 h-16 rounded-full bg-gray-100 object-cover object-center"
        />
        <Pencil size={18} />
      </TouchableOpacity>

      <TextInput
        className="border border-border bg-white rounded-full px-4 py-3 mb-3"
        placeholder="Enter child name"
        value={kid.name}
        onChangeText={(t) => setField("name", t)}
      />

      <View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={toggleAge}
          className="flex-row items-center justify-between border border-border rounded-full px-4 py-3 bg-white"
          accessibilityRole="button"
        >
          <Text className="text-base text-gray-900">
            {kid.ageRange ? kid.ageRange : "Select age"}
          </Text>
          <Text className="text-gray-400">{ageOpen ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {ageOpen && (
          <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden bg-white">
            {ageOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setField("ageRange", opt);
                  setAgeOpen(false);
                }}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text className="text-base text-gray-800">{opt} years</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
