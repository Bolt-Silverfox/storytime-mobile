import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import Icon from "../../../components/Icon";
import CustomButton from "../../../components/uI/CustomButton";
import { ParentFavouritesNavigatorProp } from "../../../Navigation/parents/ParentFavouritesNavigator";
import { favouritesData } from "../../../data";

const FavouriteScreen = () => {
  const navigator = useNavigation<ParentFavouritesNavigatorProp>();

  const renderItem = (data: {
    imgSource: ImageSourcePropType | undefined;
    title: string;
    description: string;
    ageRange: string;
    author: string;
    id: string;
  }) => {
    return (
      <Pressable
        onPress={() => navigator.navigate("storyDetails", { id: data.id })}
        className="flex flex-row gap-x-2 sm:gap-x-4 p-2 bg-white rounded-2xl"
      >
        <Image
          source={data.imgSource}
          className="h-[171px] w-[186px] rounded-2xl"
        />
        <View className="flex flex-col flex-1 gap-y-3">
          <Text className="font-[abeezee] text-sm sm:text-base">
            {data.title}
          </Text>
          <Text className="font-[abeezee] text-sm sm:text-base text-text text-wrap">
            {data.description}
          </Text>
          <Text className="font-[abeezee] text-xs sm:text-sm text-text">
            Written by: {data.author}
          </Text>
          <Text className="font-[abeezee] text-xs sm:text-sm text-text">
            {" "}
            {data.ageRange} years
          </Text>
          <Pressable className="self-end">
            <Icon name="Heart" color="red" />
          </Pressable>
        </View>
      </Pressable>
    );
  };
  return (
    <View className="flex-1 flex">
      <View className="flex flex-row bg-white py-5 px-3">
        <Text className="flex-1  text-[18px] font-[abeezee]">Favourites</Text>
        <Pressable onPress={() => navigator.goBack()}>
          <Icon name="FunnelPlus" />
        </Pressable>
        <Pressable className="ml-5" onPress={() => navigator.goBack()}>
          <Icon name="Search" />
        </Pressable>
      </View>
      <View className="p-5 gap-y-5 flex flex-col mx-auto max-w-screen-md w-full">
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex flex-col gap-y-4 pb-20"
          data={favouritesData}
          renderItem={({ item }) => renderItem(item)}
        />
        <CustomButton
          text="Story details"
          onPress={() => navigator.navigate("storyDetails", { id: "one" })}
        />
      </View>
    </View>
  );
};

export default FavouriteScreen;
