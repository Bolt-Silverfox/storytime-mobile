import { RouteProp, useRoute } from "@react-navigation/native";
import ComingSoon from "../../../components/ComingSoon";
import { ParentFavouritesNavigatorParamList } from "../../../Navigation/parents/ParentFavouritesNavigator";

type FavouriteStoryDetailsScreenProps = RouteProp<
  ParentFavouritesNavigatorParamList,
  "storyDetails"
>;

const FavouriteStoryDetailsScreen = () => {
  const { params } = useRoute<FavouriteStoryDetailsScreenProps>();
  return (
    <ComingSoon title={`Favourite Story Details for story ${params.id}`} />
  );
};

export default FavouriteStoryDetailsScreen;
