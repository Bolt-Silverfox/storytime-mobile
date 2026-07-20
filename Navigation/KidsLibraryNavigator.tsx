import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type KidsLibraryNavigatorParamList = {
  kidsLibrary: undefined;
  storyInteraction: { storyId: string };
  setup: { screen: string; params: { storyId: string } };
};

export type KidsLibraryNavigatorProps =
  NativeStackNavigationProp<KidsLibraryNavigatorParamList>;
