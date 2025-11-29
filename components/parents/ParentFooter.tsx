import React from "react";
import { Text, View } from "react-native";
import CustomButton from "../UI/CustomButton";

function ParentFooter() {
  return (
    <View
      aria-labelledby="Footer information"
      className="flex flex-col gap-y-3 mt-16 px-4"
    >
      <Text className="font-[abeezee] text-xl text-black text-center">
        You are on free mode
      </Text>
      <Text className="font-[abeezee] text-black text-center">
        You can only access one story per day. Unlock our full library for
        unlimited stories
      </Text>
      <CustomButton text="Subscribe to Storytime Premium" />
    </View>
  );
}

export default ParentFooter;
