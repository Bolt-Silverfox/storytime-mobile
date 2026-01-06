import { View, Text } from "react-native";
import React from "react";
import useKidNavigator from "../../../contexts/KidNavigatorContext";

export default function ReadKidHistory() {
  const { childId } = useKidNavigator();

  return (
    <View>
      <Text>ReadKidHistory</Text>
    </View>
  );
}
