import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { useNavigation } from "@react-navigation/native";
import defaultStyles from "../../../styles";
import { Checkbox } from "expo-checkbox";
import z from "zod";
import colours from "../../../colours";
import PageTitle from "../../../components/PageTitle";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";

const feedBack = z.object({
  message: z.string().min(1, "feedback should not be empty"),
});

type FeedBackSchema = z.infer<typeof feedBack>;
type Errors = Partial<Record<keyof FeedBackSchema, string>>;

export default function DeleteAccount() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [deleteCheckList, setDeleteAccountCheckList] =
    useState<DeleteAcountChecklist[]>(deleteReasons);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  const isOthersChecked = deleteCheckList.find((r) => r.id === 6)?.checked;

  const handleNext = () => {
    setErrors({});
    const hasSelection = deleteCheckList.some((r) => r.checked);
    if (!hasSelection) return;
    if (isOthersChecked) {
      const result = feedBack.safeParse({ message });
      if (!result.success) {
        const formatted: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          const field = err.path[0] as keyof FeedBackSchema;
          formatted[field] = err.message;
        });
        setErrors(formatted);
        return;
      }
    }
    navigator.navigate("deleteAccountConfirmation");
  };

  const handleToggle = (id: number) => {
    setDeleteAccountCheckList((prev) =>
      prev.map((item) => ({
        ...item,
        checked: item.id === id ? true : false,
      }))
    );
  };
  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 ">
        <PageTitle title="Delete Account" goBack={() => navigator.goBack()} />
        <ScrollView className="mx-4" showsVerticalScrollIndicator={false}>
          <View className="mt-12  items-center">
            <Text style={[defaultStyles.heading, styles.headingFontSize]}>
              We are sorry to see you go
            </Text>
            <Text
              style={[defaultStyles.defaultText, styles.textFontSize]}
              className="mt-4 max-w-[311px] text-center"
            >
              Help us improve by telling us how we can make Storytime
              better{" "}
            </Text>
          </View>
          <View className="mt-8 gap-8  ">
            {deleteCheckList.map((reason) => (
              <Pressable
                key={reason.id}
                onPress={() => handleToggle(reason.id)}
                className="flex-row items-center justify-between"
              >
                <Text style={[defaultStyles.defaultText, styles.textColor]}>
                  {reason.reason}
                </Text>
                <Checkbox
                  value={reason.checked}
                  color={reason.checked ? "#4630EB" : undefined}
                  pointerEvents="none"
                />
              </Pressable>
            ))}
          </View>
          {isOthersChecked && (
            <View style={styles.formItem} className="mt-8">
              <TextInput
                style={styles.textArea}
                placeholder="Please let us know about your experience and how to improve"
                onChangeText={setMessage}
                value={message}
                className={`relative min-h-[40]  justify-center rounded-[20px] border px-4 font-[abeezee] text-base text-black ${errors.message ? "border-red-600" : "border-border"}`}
                placeholderTextColor={errors.message ? "red" : colours.text}
                multiline
              />
              {errors.message && (
                <Text className="mt-1 text-sm text-red-600">
                  {errors.message}
                </Text>
              )}
            </View>
          )}
          <View className="mt-8 flex-1 justify-center gap-6">
            <Pressable onPress={handleNext}>
              <Text
                style={[defaultStyles.defaultText, styles.whiteText]}
                className="mx-auto w-full rounded-[99px] bg-[#EC4007] px-2 py-3 text-center"
              >
                Next
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                navigator.navigate("indexPage");
                setDeleteAccountCheckList(deleteReasons);
              }}
            >
              <Text
                style={[defaultStyles.defaultText, styles.blackText]}
                className="mx-auto w-full  rounded-[99px] border-[0.5px] border-[#212121] px-2 py-3 text-center"
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}

type DeleteAcountChecklist = {
  id: number;
  reason: string;
  checked: boolean;
};

const deleteReasons: DeleteAcountChecklist[] = [
  {
    id: 1,
    reason: "I am concerned about the privacy policy",
    checked: false,
  },
  {
    id: 2,
    reason: "I don’t want to continue the subscription",
    checked: false,
  },
  {
    id: 3,
    reason: "I had some technical issues",
    checked: false,
  },
  {
    id: 4,
    reason: "I prefer another story app",
    checked: false,
  },
  {
    id: 5,
    reason: "I didn’t love the story content",
    checked: false,
  },
  {
    id: 6,
    reason: "Others",
    checked: false,
  },
];

const styles = StyleSheet.create({
  formItem: {
    gap: 4,
  },
  headingFontSize: {
    fontSize: 20,
  },
  textFontSize: {
    fontSize: 16,
  },
  textColor: {
    color: "#333333",
    fontSize: 16,
  },
  textArea: {
    height: 150,
    maxHeight: 140,
    textAlignVertical: "top",
  },
  whiteText: {
    color: "white",
  },
  blackText: {
    color: "black",
  },
});
