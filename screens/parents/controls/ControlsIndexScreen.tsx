import { useNavigation } from "@react-navigation/native";
import { Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import Icon from "../../../components/Icon";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";
import colours from "../../../colours";
import KidSelectorModal from "../../../components/SelectKidsModal";
import { useState } from "react";
import { Alert } from "react-native";

type ValidRoutes =
  | "contentFilter"
  | "excludeStoryTags"
  | "recordVoice"
  | "customizeReadingVoices"
  | "setBedtime"
  | "setDailyLimit"
  | "viewActivityLog";

const ControlsIndexScreen = () => {
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<ValidRoutes | undefined>(
    undefined
  );

  const openModal = (route: ValidRoutes) => {
    setIsModalOpen(true);
    setSelectedRoute(route);
  };

  const navigateToRoute = () => {
    if (!selectedRoute) {
      Alert.alert("Select a valid route");
      return;
    }
    navigator.navigate(selectedRoute, { childId: selectedKidId });
  };

  return (
    <View className="flex flex-1 bg-bgLight">
      <Text className="font-[quilka] py-5 text-center text-2xl">Controls</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-bgLight"
        contentContainerClassName="px-5 flex flex-col gap-y-10 pt-4 pb-10  h-full max-w-screen-md w-full mx-auto"
      >
        <View
          style={styles.shadow}
          className="flex flex-col bg-white rounded-3xl p-4  border border-black/10"
        >
          <Text className="text-[18px] font-[abeezee] my-3">
            STORY CUSTOMISATION
          </Text>
          <Pressable
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => openModal("contentFilter")}
          >
            <Icon name="Funnel" color={colours.primary} />
            <Text className="flex-1 text-base text-black font-[abeezee]">
              Content Filter
            </Text>
            <Icon name="ChevronRight" color="black" />
          </Pressable>

          <Pressable
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => openModal("excludeStoryTags")}
          >
            <Icon name="FunnelX" color={colours.primary} />
            <Text className="flex-1 text-base text-black font-[abeezee]">
              Exclude Story Tags{" "}
            </Text>
            <Icon name="ChevronRight" color="black" />
          </Pressable>

          <Pressable
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => openModal("recordVoice")}
          >
            <Icon name="Mic" color={colours.primary} />
            <Text className="flex-1 text-base text-black font-[abeezee]">
              Record Voice
            </Text>
            <Icon name="ChevronRight" color="black" />
          </Pressable>

          <Pressable
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => openModal("customizeReadingVoices")}
          >
            <Icon name="Volume2" color={colours.primary} />
            <Text className="flex-1 text-base text-black font-[abeezee]">
              Customize Reading Voices
            </Text>
            <Icon name="ChevronRight" color="black" />
          </Pressable>
        </View>

        <View
          style={styles.shadow}
          className="flex flex-col bg-white  rounded-3xl p-4  border border-black/10"
        >
          <Text className="text-[18px] font-[abeezee] my-3">
            READING & USAGE
          </Text>
          <Pressable
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => openModal("setBedtime")}
          >
            <Icon name="Moon" color={colours.primary} />
            <Text className="flex-1 text-base text-black font-[abeezee]">
              Set Bedtime Mode
            </Text>
            <Icon name="ChevronRight" color="black" />
          </Pressable>

          <Pressable
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => openModal("setDailyLimit")}
          >
            <Icon name="Hourglass" color={colours.primary} />
            <Text className="flex-1 text-base text-black font-[abeezee]">
              Daily Usage Limit{" "}
            </Text>
            <Icon name="ChevronRight" color="black" />
          </Pressable>

          <Pressable
            className="flex py-4 border-b border-b-black/10 flex-row items-center gap-x-10"
            onPress={() => openModal("viewActivityLog")}
          >
            <Icon name="Clock" color={colours.primary} />
            <Text className="flex-1 text-base text-black font-[abeezee]">
              View Activity Log
            </Text>
            <Icon name="ChevronRight" color="black" />
          </Pressable>
        </View>
        {isModalOpen && (
          <KidSelectorModal
            selectedKidId={selectedKidId}
            setSelectedKId={setSelectedKidId}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            handleNavigate={navigateToRoute}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ControlsIndexScreen;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
});
