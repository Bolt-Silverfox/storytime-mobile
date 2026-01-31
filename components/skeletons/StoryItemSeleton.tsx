import React from "react";
import { ActivityIndicator } from "react-native";
import { View } from "react-native";

const StoryItemSkeleton = () => {
  return (
    <View className="flex flex-col w-48 max-w-52 gap-y-1.5 border-border-light p-1 rounded-2xl border h-[240px]">
      <View className="flex-1 w-full h-full rounded-2xl">
        <View className="h-[150px] w-full rounded-xl bg-gray-200 justify-center items-center">
          <ActivityIndicator size="large" color="#9CA3AF" />
        </View>

        <View className="flex flex-row justify-between items-center px-0.5 mt-2">
          <View className="flex flex-row items-center gap-x-2 flex-1">
            <View className="h-2 w-2 rounded-full bg-gray-300" />
            <View className="h-3 w-20 rounded bg-gray-300" />
          </View>

          <View className="flex flex-row items-center gap-x-1">
            <View className="h-3 w-3 rounded-full bg-gray-300" />
            <View className="h-3 w-8 rounded bg-gray-300" />
          </View>
        </View>

        <View className="px-0.5 mt-2 gap-y-1">
          <View className="h-4 w-full rounded bg-gray-300" />
          <View className="h-4 w-3/4 rounded bg-gray-300" />
        </View>

        <View className="px-1 mt-1">
          <View className="h-3 w-24 rounded bg-gray-300" />
        </View>
      </View>
    </View>
  );
};

export default StoryItemSkeleton;
