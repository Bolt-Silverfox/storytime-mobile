import { useNavigation } from "@react-navigation/native";
import { lazy } from "react";
import { View } from "react-native";
import { ParntHomeNavigatorProp } from "../../../../Navigation/ParentHomeNavigator";
import PageTitle from "../../../../components/PageTitle";
import SuspenseWrapper from "../../../../components/supsense/SuspenseWrapper";

const TrackChallengeComponent = lazy(
  () => import("../../../../components/TrackChallengeComponent")
);

const TrackChallengeScreen = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();
  return (
    <View className="flex-1 flex-col flex bg-bgLight">
      <PageTitle title="Track Challenge" goBack={() => navigator.goBack()} />
      <SuspenseWrapper>
        <TrackChallengeComponent />
      </SuspenseWrapper>
    </View>
  );
};

export default TrackChallengeScreen;
