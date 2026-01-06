import { useNavigation } from "@react-navigation/native";
import { Image, Pressable, View } from "react-native";
import { KidsTabNavigatorProp } from "../../Navigation/KidsTabNavigator";
import { Story } from "../../types";

const KidBookItem = ({ story }: { story: Story }) => {
  const navigator = useNavigation<KidsTabNavigatorProp>();

  return (
    <Pressable
      key={story.id}
      className=""
      onPress={() =>
        navigator.navigate("storyInteraction", { storyId: story.id })
      }
    >
      <View className="w-[167] h-[160] rounded-tl-[20] bg-[#5E3A54]"></View>
      <View className="w-[167] h-[24] rounded-bl-[20] bg-[#5E3A54] pt-[2]">
        <View className="rounded-l-[20] flex-row w-[157] self-end  h-[16] bg-[#D5D3E5]">
          <View className="rounded-l-[20] bg-[#A39FC6] h-[16] w-[16]" />
          <View className="bg-[#A39FC6] h-[6] w-[141]">
            {/* <Bookmark color={"#C5240B"} className="bg-red-400" /> */}
          </View>
        </View>
      </View>

      <Image
        source={{ uri: story.coverImageUrl }}
        style={{ position: "absolute", right: 0 }}
        className="h-[162px] w-[150px]"
      />
    </Pressable>
  );
};

export default KidBookItem;
