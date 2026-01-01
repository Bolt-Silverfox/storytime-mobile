import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { ParntHomeNavigatorProp } from "../../../Navigation/ParentHomeNavigator";
import PageTitle from "../../../components/PageTitle";
import TrackStoriesComponent from "../../../components/TrackStoriesComponent";

const TrackStoriesScreen = () => {
  const navigator = useNavigation<ParntHomeNavigatorProp>();

  return (
    <View className="flex-1 flex-col flex bg-bgLight gap-y-6">
      <PageTitle title="Track Stories" goBack={() => navigator.goBack()} />
      <TrackStoriesComponent />
    </View>
  );
};

export default TrackStoriesScreen;
