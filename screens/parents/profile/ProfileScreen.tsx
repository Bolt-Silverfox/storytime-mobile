import { useNavigation } from "@react-navigation/native";
import {
  FingerScan,
  Logout,
  Profile2User,
  TrushSquare,
} from "iconsax-react-nativejs";
import {
  BellRing,
  CreditCard,
  HelpCircle,
  KeyRound,
  Ban,
} from "lucide-react-native";
import React, { FC, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import colours from "../../../colours";
import Avatar from "../../../components/Avatar";
import CustomText from "../../../components/CustomText";
import LoadingOverlay from "../../../components/LoadingOverlay";
import MenuItem from "../../../components/MenuItem";
import ParentProfileModal from "../../../components/modals/ParentProfileIndexModal";
import useAuth from "../../../contexts/AuthContext";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import defaultStyles from "../../../styles";

const ProfileScreen: FC = () => {
  const [uploaderVisible, setUploaderVisible] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const parentNavigator = useNavigation<ParentsNavigatorProp>();
  const [openModal, setOpenModal] = useState<"delete" | "logout" | boolean>(
    false
  );

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  if (isLoading) return <LoadingOverlay visible={isLoading} />;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground
          source={require("../../../assets/bg-adaptive-image.png")}
          style={styles.header}
          imageStyle={{
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <Text
            style={[defaultStyles.heading, { bottom: -40, margin: "auto" }]}
          >
            Profile
          </Text>
          <Avatar
            onPress={() => {
              navigator.navigate("editParentImage");
            }}
            edit={true}
            size={80}
            style={{
              // position: "absolute",
              bottom: -30,
              margin: "auto",
              // marginLeft: -56,
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

        <View
          className="max-w-screen-md w-full mx-auto"
          style={styles.menuList}
        >
          <MenuItem
            icon={<Profile2User size={isTablet ? 20 : 18} color="#EC4007" />}
            label="Manage Child Profiles"
            onPress={() => navigator.navigate("manageChildProfiles")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<BellRing size={isTablet ? 20 : 18} color="#EC4007" />}
            label="Notification Settings"
            onPress={() =>
              parentNavigator.navigate("notifications", { screen: "settings" })
            }
            isTablet={isTablet}
          />
          <MenuItem
            icon={<Ban size={isTablet ? 20 : 18} color="#EC4007" />}
            label="Blocked Stories"
            onPress={() => navigator.navigate("blockedStories")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<KeyRound color={"#EC4007"} size={isTablet ? 20 : 18} />}
            label="Manage Password/Pin"
            onPress={() => navigator.navigate("managePassword")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<FingerScan color={"#EC4007"} size={isTablet ? 20 : 18} />}
            label="Enable Finger Print / Face ID"
            onPress={() => navigator.navigate("enableBiometrics")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<CreditCard color={"#EC4007"} size={isTablet ? 20 : 18} />}
            label="Subscription"
            isTablet={isTablet}
            onPress={() => parentNavigator.navigate("getPremium")}
          />
          <MenuItem
            icon={<HelpCircle color="#EC4007" size={isTablet ? 20 : 18} />}
            label="Help & Support"
            isTablet={isTablet}
            onPress={() => navigator.navigate("helpAndSupport")}
          />
          <MenuItem
            icon={<Logout color="#EC4007" size={isTablet ? 20 : 18} />}
            label="Log Out"
            isTablet={isTablet}
            onPress={() => setOpenModal("logout")}
          />
          <MenuItem
            icon={<TrushSquare color="#EC4007" size={isTablet ? 20 : 18} />}
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
  container: { flex: 1, backgroundColor: "#FFFCFBFB", paddingTop: 0 },
  scrollContent: { paddingBottom: 10 },
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
  nameContainer: { alignItems: "center", marginTop: 30 },
  menuList: {
    marginTop: 29,
    paddingTop: 15,
    paddingHorizontal: 16,
    alignSelf: "center",
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
