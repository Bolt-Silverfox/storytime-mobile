import { RouteProp, useRoute } from "@react-navigation/native";
import { ParentHomeNavigatorParamList } from "../../../Navigation/ParentHomeNavigator";
import GroupedStoriesContainer from "../../../components/GroupedStoriesContainer";
import { storiesByAgeImages } from "../../../data";

type RoutePropTypes = RouteProp<ParentHomeNavigatorParamList, "storiesByAge">;
const StoriesByAgeScreen = () => {
  const { params } = useRoute<RoutePropTypes>();
  const isSelectedAgeDefault = params.ageGroup === "All";
  return (
    <GroupedStoriesContainer
      params={{ ageGroup: params.ageGroup }}
      imageSource={{
        uri: storiesByAgeImages[params.ageGroup],
      }}
      description={`Access stories from ${isSelectedAgeDefault ? "all ages" : "age" + params.ageGroup}`}
      title={isSelectedAgeDefault ? "All ages" : `Age ${params.ageGroup}`}
      showAges={false}
    />
  );
};

export default StoriesByAgeScreen;
