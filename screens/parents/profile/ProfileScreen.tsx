import { useNavigation } from "@react-navigation/native";
import {
  FingerScan,
  Logout,
  Profile2User,
  TrushSquare,
} from "iconsax-react-nativejs";
import {
  Ban,
  BellRing,
  CreditCard,
  HelpCircle,
  KeyRound,
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
import defaultStyles from "../../../styles";

const ProfileScreen: FC = () => {
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

        <View className="max-w-screen-md bg-white rounded-3xl  mx-auto mt-7 pt-4 p-4 border border-border-lighter w-[90%]">
          <MenuItem
            icon={<BellRing size={isTablet ? 20 : 18} color="#EC4007" />}
            label="Notification Settings"
            onPress={() => navigator.navigate("notificationSettings")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<KeyRound color={"#EC4007"} size={isTablet ? 20 : 18} />}
            label="Change Password"
            onPress={() => navigator.navigate("resetParentPassword")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<CreditCard color={"#EC4007"} size={isTablet ? 20 : 18} />}
            label="Subscription"
            isTablet={isTablet}
            onPress={() => navigator.navigate("subscription")}
          />
          <MenuItem
            icon={<HelpCircle color="#EC4007" size={isTablet ? 20 : 18} />}
            label="Help & Support"
            isTablet={isTablet}
            onPress={() =>
              navigator.navigate("helpAndSupport", { screen: "index" })
            }
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
});
