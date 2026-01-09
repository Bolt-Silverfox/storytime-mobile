import { useNavigation } from "@react-navigation/native";
import NotificationSettingsScreenComponent from "../../../components/screens/NotificationSettingsScreenComponent";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";

const NotificationSettingsScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  return (
    <NotificationSettingsScreenComponent goBack={() => navigator.goBack()} />
  );
};

export default NotificationSettingsScreen;
