import { useNavigation } from "@react-navigation/native";
import {
  CreditCard,
  HelpCircle,
  Lock,
  LogOut,
  Phone,
  Trash,
  User,
} from "lucide-react-native";
import React, { FC, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import colours from "../../../colours";
import CustomText from "../../../components/CustomText";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useAuth from "../../../contexts/AuthContext";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import MenuItem from "../../../components/MenuItem";
import Avatar from "../../../components/Avatar";
import LogoutModal from "../../../components/modals/ParentProfileIndexModal";
import ParentProfileModal from "../../../components/modals/ParentProfileIndexModal";
import useGetUserProfile from "../../../hooks/tanstack/queryHooks/useGetUserProfile";

const ProfileScreen: FC = () => {
  const [uploaderVisible, setUploaderVisible] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [openModal, setOpenModal] = useState<"delete" | "logout" | boolean>(
    false
  );

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  if (isLoading) return <LoadingOverlay visible={isLoading} />;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={require("../../../assets/bg-adaptive-image.png")}
          style={styles.header}
          imageStyle={{
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <Avatar
            onPress={() => {
              navigator.navigate("editParentImage");
            }}
            style={{
              position: "absolute",
              left: "50%",
              bottom: -56,
              marginLeft: -56,
            }}
          />
        </ImageBackground>

        <View style={styles.nameContainer}>
          <CustomText
            style={{
              fontFamily: "quilka",
              fontSize: isTablet ? 32 : 24,
              textAlign: "center",
              color: colours.black,
            }}
          >
            {user?.name}
          </CustomText>
          <CustomText
            style={{
              fontSize: isTablet ? 18 : 14,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            {user?.email}
          </CustomText>
        </View>

        <View style={styles.menuList}>
          <MenuItem
            icon={<User size={isTablet ? 20 : 18} />}
            label="Manage Child Profiles"
            onPress={() => navigator.navigate("manageChildProfiles")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<Lock size={isTablet ? 20 : 18} />}
            label="Manage Password/Pin"
            onPress={() => navigator.navigate("managePassword")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<Phone size={isTablet ? 20 : 18} />}
            label="Enable Finger Print / Face ID"
            onPress={() => navigator.navigate("enableBiometrics")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<CreditCard size={isTablet ? 20 : 18} />}
            label="Subscription"
            isTablet={isTablet}
            onPress={() => navigator.navigate("subscriptionIndex")}
          />
          <MenuItem
            icon={<HelpCircle size={isTablet ? 20 : 18} />}
            label="Help & Support"
            isTablet={isTablet}
            onPress={() => navigator.navigate("helpAndSupport")}
          />
          <MenuItem
            icon={<LogOut size={isTablet ? 20 : 18} />}
            label="Log Out"
            isTablet={isTablet}
            onPress={() => setOpenModal("logout")}
          />
          <MenuItem
            icon={<Trash size={isTablet ? 20 : 18} />}
            label="Delete Account"
            textColor="#DC2626"
            isTablet={isTablet}
            onPress={() => setOpenModal("delete")}
          />
        </View>
      </ScrollView>
      <ParentProfileModal
        open={openModal}
        setOpen={setOpenModal}
        logout={logout}
        deleteAccount={() => navigator.navigate("deleteAccount")}
      />
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingBottom: 100 },
  header: {
    width: "100%",
    height: 192,
    position: "relative",
    overflow: "visible",
  },
  addPhotoButton: {
    position: "absolute",
    left: "50%",
    bottom: -56,
    marginLeft: -56,
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  addPhotoText: { fontSize: 10, color: "#6B7280", marginTop: 4 },
  nameContainer: { alignItems: "center", marginTop: 56 },
  menuList: {
    marginTop: 24,
    paddingHorizontal: 16,
    alignSelf: "center",
    width: "90%",
  },
});
