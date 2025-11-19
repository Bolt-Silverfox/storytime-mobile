import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Alert,
  Pressable,
  Image,
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
import LoadingOverlay from "../../components/LoadingOverlay";

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
  const [submitting, setSubmitting] = useState(false);

  const updateKid = (index: number, patch: Partial<Kid>) => {
    setKids((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };


  const onProceed = async () => {
    // run validation first
    for (let i = 0; i < kids.length; i++) {
      if (!kids[i].name.trim() || !kids[i].age) {
        Alert.alert("Validation", `Please complete details for Kid ${i + 1}`);
        return;
      }
    }

    // SHOW overlay
    setSubmitting(true);

    try {
      // simulate network request
      await new Promise((res) => setTimeout(res, 2000));

      navigator.navigate("home");
    } catch (err) {
      console.warn(err);
      Alert.alert("Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const onSkip = () => {
    navigator.getParent()?.navigate("home");
  };

  return (
    <>
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
              className="flex-col gap-2 mt-6 px-2"
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
              className="flex-1 bg-white border border-border rounded-full py-3 items-center"
            >
              <Text className="text-base font-semibold text-gray-800">
                Skip
              </Text>
            </Pressable>

            <Pressable
              onPress={onProceed}
              className="flex-1 bg-primary rounded-full py-3 items-center"
            >
              <Text className="text-base font-semibold text-white">
                Finalize Profile
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>

      <LoadingOverlay visible={submitting} />
    </>
  );
}
