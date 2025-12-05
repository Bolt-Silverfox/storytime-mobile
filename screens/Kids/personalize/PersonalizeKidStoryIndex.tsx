import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";
import {
  PersonalizeKidNavigatorParamList,
  PersonalizeKidsNavigatorProps,
} from "../../../Navigation/PersonalizeKidNavigator";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ChildButton from "../../../components/UI/ChildButton";
import useGetGeneratedStories from "../../../hooks/tanstack/queryHooks/useGetGeneratedStories";
import Icon from "../../../components/Icon";
import { Dispatch, SetStateAction, useState } from "react";
import CustomModal from "../../../components/modals/CustomModal";
import ActiveStoryModal from "../../../components/modals/ActiveStoryModal";

type RoutePropType = RouteProp<PersonalizeKidNavigatorParamList, "index">;
const PersonalizeKidStoryIndex = () => {
  const navigator = useNavigation<PersonalizeKidsNavigatorProps>();
  const { params } = useRoute<RoutePropType>();
  const { isPending, error, refetch, data } = useGetGeneratedStories(
    params.childId
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeBook, setActiveBook] = useState("");

  const openModal = (id: string) => {
    setIsModalOpen(true);
    setActiveBook(id);
  };

  if (isPending) return <LoadingOverlay visible={isPending} />;
  if (error)
    return <ErrorComponent refetch={refetch} message={error.message} />;
  return (
    <View className="flex flex-1">
      {data.length ? (
        <ImageBackground
          source={require("../../../assets/images/story-generation-bg.png")}
          resizeMode="cover"
          className="flex flex-1 px-4 pb-10"
        >
          <Text className="text-center py-3 text-white font-[quilka] text-2xl">
            Personalize
          </Text>
          <FlatList
            data={data}
            numColumns={2}
            className="mt-8 relative"
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={({ item }) => (
              <View className="w-[48%] mb-4" key={item.id}>
                <Image
                  source={{ uri: item.coverImageUrl }}
                  className="w-full h-[200px]"
                  alt="Image url"
                />
                <Pressable
                  onPress={() => openModal(item.id)}
                  className="absolute top-4 right-3"
                >
                  <Image
                    className="size-[30px]"
                    source={require("../../../assets/icons/options.png")}
                  />
                </Pressable>
              </View>
            )}
          />
          <ChildButton
            onPress={() =>
              navigator.navigate("generateStory", {
                childId: params.childId,
              })
            }
            text="Generate new story"
            icon="ArrowRight"
          />
          <ActiveStoryModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </ImageBackground>
      ) : (
        <EmptyState childId={params.childId} />
      )}
    </View>
  );
};

export default PersonalizeKidStoryIndex;

const EmptyState = ({ childId }: { childId: string }) => {
  const navigator = useNavigation<PersonalizeKidsNavigatorProps>();

  return (
    <View className="flex flex-1 pb-10 bg-bgLight">
      {/* <ImageBackground
        source={require("../../../assets/images/story-generation-bg.png")}
        resizeMode="cover"
        className=" min-h-[60%]"
      >
        <Text className="text-center py-3 text-white font-[quilka] text-2xl">
          Personalize
        </Text>
        <Text className="">You haven't generated any stories</Text>
        </ImageBackground> */}
      <View className="flex-1  flex justify-center ">
        <Text className="text-center py-3 text-black font-[quilka] text-2xl">
          You haven't generated any stories yet
        </Text>
        <ChildButton
          onPress={() =>
            navigator.navigate("generateStory", {
              childId,
            })
          }
          text="Get started"
          icon="ArrowRight"
        />
      </View>
    </View>
  );
};
