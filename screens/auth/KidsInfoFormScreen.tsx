import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KidsForm, { Kid } from "../../components/KidsForm";
import LoadingOverlay from "../../components/LoadingOverlay";
import useAddKids from "../../hooks/tanstack/mutationHooks/useAddKids";
import { ProfileNavigatorProp } from "../../Navigation/ProfileNavigator";
import defaultStyles from "../../styles";

export default function KidsInfoFormScreen() {
  const route = useRoute();
  const params = (route.params as { kidsCount: number }) || {};
  const { kidsCount } = params;
  const navigation = useNavigation<ProfileNavigatorProp>();
  const [kids, setKids] = useState<Kid[]>(
    Array.from({ length: kidsCount }).map(() => ({
      name: "",
      ageRange: "",
      avatar: "",
    }))
  );
  const { mutate, isPending } = useAddKids(kids.length);

  const updateKid = (index: number, patch: Partial<Kid>) => {
    setKids((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const onSkip = () => {
    navigation.navigate("homeScreen");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "hsla(15,100%,99%,0.98)" }}
    >
      <Pressable onPress={() => navigation.goBack()} className="p-5 bg-white">
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
        <Text
          style={{
            ...defaultStyles.defaultText,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Complete setting up your kids information
        </Text>

        {kids.map((kid, idx) => (
          <View key={idx} className="flex-col gap-2 mt-6 px-2">
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
            className="flex-1 bg-white border border-border rounded-full py-3 items-center"
          >
            <Text className="text-base font-semibold text-gray-800">Skip</Text>
          </Pressable>

          <Pressable
            onPress={() => mutate(kids)}
            className="flex-1 bg-primary rounded-full py-3 items-center"
          >
            <Text className="text-base font-semibold text-white">
              Finalize Profile
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <LoadingOverlay visible={isPending} />
    </SafeAreaView>
  );
}
