import { useNavigation } from "@react-navigation/native";
import useAuth from "../contexts/AuthContext";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import { GuestNavigatorProp } from "../Navigation/GuestNavigator";

/**
 * Hook to handle upgrade/premium navigation for both guests and authenticated users.
 * - Guests: Navigate to signup
 * - Authenticated users: Navigate to getPremium screen
 */
const useUpgradeNavigation = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const guestNavigator = useNavigation<GuestNavigatorProp>();
  const { isGuest } = useAuth();

  const handleUpgradePress = () => {
    if (isGuest) {
      guestNavigator.navigate("signUp");
    } else {
      navigator.navigate("getPremium");
    }
  };

  return handleUpgradePress;
};

export default useUpgradeNavigation;
