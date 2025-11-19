import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Alert,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useRoute,
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import KidsForm, { Kid } from "../../components/KidsForm";
import defaultStyles from "../../styles";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";

export default function KidsInfoFormScreen() {
  const navigator = useNavigation<RootNavigatorProp>();

  const route = useRoute();
  const params = (route.params as { kidsCount: number }) || {};
  const { kidsCount } = params;

  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const [kids, setKids] = useState<Kid[]>(
    Array.from({ length: kidsCount }).map(() => ({
      name: "",
      age: "",
      avatar: null,
    }))
  );

  const updateKid = (index: number, patch: Partial<Kid>) => {
    setKids((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const validateAndSubmit = () => {
    for (let i = 0; i < kids.length; i++) {
      const k = kids[i];
      if (!k.name.trim() || !k.age) {
        Alert.alert("Validation", `Please complete details for Kid ${i + 1}`);
        return;
      }
    }
    console.log("Submitting kids:", kids);
    Alert.alert("Success", "Kids info saved.");
  };

  const onProceed = () => {
    navigator.getParent()?.navigate("home");
  };

  const onSkip = () => {
    navigator.getParent()?.navigate("home");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "hsla(15,100%,99%,0.98)" }}
    >
      <Pressable onPress={() => navigator.goBack()} className="p-5 bg-white">
        <Image
          className="w-5 h-5"
          source={require("../../assets/icons/arrow-left.png")}
        />
      </Pressable>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          backgroundColor: "hsla(15,100%,99%,0.98)",
        }}
      >
        <Text style={defaultStyles.heading}>Enter Your Kids’ Details</Text>
        <Text style={defaultStyles.defaultText}>
          Complete setting up your kids information
        </Text>

        {kids.map((kid, idx) => (
          <View
            key={idx}
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 12,
            }}
            className="flex-col gap-2 mt-4"
          >
            <KidsForm
              index={idx}
              kid={kid}
              onChange={(patch) => updateKid(idx, patch)}
              navigation={navigation}
            />
          </View>
        ))}

        <View className="flex-row justify-between gap-3 mt-12">
          <Pressable
            onPress={onSkip}
            className="flex-1 bg-white border border-gray-300 rounded-full py-3 items-center"
          >
            <Text className="text-base font-semibold text-gray-800">Skip</Text>
          </Pressable>

          <Pressable
            onPress={onProceed}
            className="flex-1 bg-orange-600 rounded-full py-3 items-center"
          >
            <Text className="text-base font-semibold text-white">
              Finalize Profile
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
