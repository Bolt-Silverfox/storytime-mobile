import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import ParentControlRouteGroup from "../../../components/parents/ParentControlsRouteGroup";
import KidSelectorModal from "../../../components/SelectKidsModal";
import { parentControlsRouteGroups } from "../../../data";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";
import { ValidParentControlsRoutes } from "../../../types";

const ControlsIndexScreen = () => {
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKidId, setSelectedKidId] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<
    ValidParentControlsRoutes | undefined
  >(undefined);

  const openModal = (route: ValidParentControlsRoutes) => {
    if (route === "recordVoice") {
      navigator.navigate("recordVoice", { childId: undefined });
      return;
    }
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
        className="bg-bgLight"
        contentContainerClassName="px-5 flex flex-col gap-y-10 pt-4 pb-10  max-w-screen-md w-full mx-auto"
      >
        {parentControlsRouteGroups.map((group) => (
          <ParentControlRouteGroup
            key={group.groupName}
            openModal={openModal}
            group={group}
          />
        ))}
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
