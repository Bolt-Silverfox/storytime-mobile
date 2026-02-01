import React from "react";
import { View } from "react-native";

const StoryItemSkeleton = () => {
  return (
    <View className="flex h-[240px] w-48 max-w-52 flex-col gap-y-1.5 rounded-2xl border border-border-light p-1 ">
      <View className="h-full w-full flex-1 rounded-2xl">
        <View className="h-[150px] w-full rounded-xl bg-gray-200" />
        <View className="mt-2 flex flex-row items-center justify-between px-0.5">
          <View className="flex flex-1 flex-row items-center gap-x-2">
            <View className="h-2 w-2 rounded-full bg-gray-300" />
            <View className="h-3 w-20 rounded bg-gray-300" />
          </View>

          <View className="flex flex-row items-center gap-x-1">
            <View className="h-3 w-3 rounded-full bg-gray-300" />
            <View className="h-3 w-8 rounded bg-gray-300" />
          </View>
        </View>

        <View className="mt-2 gap-y-1 px-0.5">
          <View className="h-4 w-full rounded bg-gray-300" />
          <View className="h-4 w-3/4 rounded bg-gray-300" />
        </View>

        <View className="mt-1 px-1">
          <View className="h-3 w-24 rounded bg-gray-300" />
        </View>
      </View>
    </View>
  );
};

export default StoryItemSkeleton;
