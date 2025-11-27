import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { useNavigation } from "@react-navigation/native";
import defaultStyles from "../../../styles";
import { Checkbox } from "expo-checkbox";
import z from "zod";
import colours from "../../../colours";

const feedBack = z.object({
  email: z.email("Invalid email, try again"),
});

type FeedBackSchema = z.infer<typeof feedBack>;
type Errors = Partial<Record<keyof FeedBackSchema, string>>;

export default function DeleteAccount() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async () => {
    setErrors({});
    const result = feedBack.safeParse({
      email,
    });
    if (!result.success) {
      const formatted: any = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        formatted[field] = err.message;
      });
      setErrors(formatted);
      return;
    }
    // await signUp(email, password, fullName.trim(), title);
    navigator.navigate('deleteAccountSuccessful');
  };

  return (
    <View className="flex-1 ">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Delete Account
        </Text>
      </View>
      <ScrollView
        className="mx-[16] flex-1 "
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-12  items-center">
          <Text
            style={[defaultStyles.defaultText, { fontSize: 16 }]}
            className="text-center mt-4 max-w-[311px]"
          >
            Help us improve by telling us how we can make Storytime better{" "}
          </Text>
        </View>
        <View style={styles.formItem} className="mt-8">
          <Text style={defaultStyles.label}>Enter email address</Text>
          <TextInput
            onChangeText={setEmail}
            value={email}
            placeholder="Enter email address"
            className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 ${errors.email ? "border-red-600" : "border-border"}`}
            placeholderTextColor={errors.email ? "red" : colours.text}
          />
          {errors.email && (
            <Text className="text-red-600 text-sm">{errors.email}</Text>
          )}
        </View>
      </ScrollView>
      <View className="flex justify-center mx-[16]  gap-6 mt-8">
        <Pressable onPress={handleSubmit}>
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full ${true ? "bg-[#EC4007]" : "bg-[#FF8771] "}`}
          >
            Delete Acount
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            navigator.navigate("indexPage");
          }}
        >
          <Text
            style={[defaultStyles.defaultText, { color: "black" }]}
            className="border-[#212121] border-[0.5px]  rounded-[99px] py-3 px-2 text-center mx-auto w-full"
          >
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  text: {
    ...defaultStyles.defaultText,
    textAlign: "center",
  },
  textContainer: {
    gap: 8,
    marginBottom: 56,
  },
  form: {
    gap: 20,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  formItem: {
    gap: 4,
  },
});
