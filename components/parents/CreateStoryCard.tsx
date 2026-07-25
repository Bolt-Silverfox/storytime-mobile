import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import useAuth from "../../contexts/AuthContext";
import useToast from "../../contexts/ToastContext";
import { ProtectedRoutesNavigationProp } from "../../Navigation/ProtectedNavigator";

/**
 * Home-screen entry point into the AI story generator. Guests are prompted to
 * sign up (generation requires an authenticated parent); parents are taken to
 * the Create Story form inside the stories stack.
 */
const CreateStoryCard = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const { isGuest } = useAuth();
  const { notify } = useToast();

  const handlePress = () => {
    if (isGuest) {
      notify("Please sign up to create your own stories.");
      return;
    }
    navigator.navigate("stories", { screen: "createStory" });
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel="Create a story with AI"
      className="flex-row items-center gap-x-4 rounded-2xl bg-purple p-4"
    >
      <View className="size-12 items-center justify-center rounded-full bg-white/20">
        <Feather name="feather" size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="font-[quilka] text-lg text-white">
          Create a Story
        </Text>
        <Text className="font-[abeezee] text-sm text-purple-light">
          Let our AI write a brand-new story for you.
        </Text>
      </View>
      <Feather name="chevron-right" size={22} color="white" />
    </Pressable>
  );
};

export default CreateStoryCard;
