import { useNavigation } from "@react-navigation/native";
import NotificationSettingsScreenComponent from "../../../components/screens/NotificationSettingsScreenComponent";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";

const NotificationsSettingsScreen = () => {
  const navigator = useNavigation<ParentsNavigatorProp>();
  return (
    <NotificationSettingsScreenComponent goBack={() => navigator.goBack()} />
  );
};

export default NotificationsSettingsScreen;
