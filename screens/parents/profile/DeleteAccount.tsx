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
import PageTitle from "../../../components/PageTitle";

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

  const handleSubmit = async () => {
    setErrors({});
    const result = feedBack.safeParse({
      message,
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
  };

  const handleToggle = (id: number) => {
    setDeleteAccountCheckList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  return (
    <View className="flex-1 ">
      <PageTitle title="Delete Account" goBack={() => navigator.goBack()} />
      <ScrollView className="mx-4" showsVerticalScrollIndicator={false}>
        <View className="mt-12  items-center">
          <Text style={[defaultStyles.heading, { fontSize: 20 }]}>
            We are sorry to see you go
          </Text>
          <Text
            style={[defaultStyles.defaultText, { fontSize: 16 }]}
            className="text-center mt-4 max-w-[311px]"
          >
            Help us improve by telling us how we can make Storytime better{" "}
          </Text>
        </View>
        <View className="gap-8 mt-8  ">
          {deleteCheckList.map((reason, i) => (
            <View key={reason.id} className="flex-row justify-between ">
              <Text
                className=" "
                style={[
                  defaultStyles.defaultText,
                  { color: "#333333", fontSize: 16 },
                ]}
              >
                {reason.reason}
              </Text>
              <Checkbox
                value={reason.checked}
                onValueChange={() => handleToggle(reason.id)}
                color={reason.checked ? "#4630EB" : undefined}
              />
            </View>
          ))}
        </View>
        {deleteCheckList.find((r) => r.id == 7)?.checked && (
          <View style={styles.formItem} className="mt-8">
            <TextInput
              style={{
                height: 150,
                maxHeight: 140,
                textAlignVertical: "top",
              }}
              placeholder="Please let us know about your experience and how to improve"
              onChangeText={setMessage}
              value={message}
              className={`border rounded-[20px]  font-[abeezee] justify-center min-h-[40] text-base text-black relative px-4 ${errors.message ? "border-red-600" : "border-border"}`}
              placeholderTextColor={errors.message ? "red" : colours.text}
              multiline
            />
          </View>
        )}
        <View className="flex-1 justify-center  gap-6 mt-8 ">
          <Pressable
            onPress={() => navigator.navigate("deleteAccountConfirmation")}
          >
            <Text
              style={[defaultStyles.defaultText, { color: "white" }]}
              className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full ${true ? "bg-[#EC4007]" : "bg-[#FF8771] "}`}
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
              style={[defaultStyles.defaultText, { color: "black" }]}
              className="border-[#212121] border-[0.5px]  rounded-[99px] py-3 px-2 text-center mx-auto w-full"
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
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
