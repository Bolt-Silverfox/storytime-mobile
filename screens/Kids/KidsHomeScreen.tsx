import { lazy } from "react";
import { View } from "react-native";
import SuspenseWrapper from "../../components/supsense/SuspenseWrapper";
import useKidNavigator from "../../contexts/KidNavigatorContext";

const KidsHomeScreenStories = lazy(
  () => import("../../components/KidsHomeScreenStories")
);
const KidsHomeScreenHeader = lazy(
  () => import("../../components/KidsHomeScreenHeader")
);

const KidHomeScreen = () => {
  const { childId } = useKidNavigator();

  return (
    <View style={{ padding: 20 }} className="flex-1">
      <SuspenseWrapper>
        <KidsHomeScreenHeader childId={childId!} />
      </SuspenseWrapper>
      <SuspenseWrapper>
        <KidsHomeScreenStories kidId={childId!} />
      </SuspenseWrapper>
    </View>
  );
};

export default KidHomeScreen;
