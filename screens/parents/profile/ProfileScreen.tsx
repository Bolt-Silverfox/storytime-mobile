import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import {
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
import { ProtectedRoutesNavigationProp } from "../../../Navigation/ProtectedNavigator";

const ProfileScreen: FC = () => {
  const { user, isLoading, logout } = useAuth();
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const protectedNavigator = useNavigation<ProtectedRoutesNavigationProp>();
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
          imageStyle={styles.headerImage}
        >
          <Text className="m-4 font-[abeezee] text-xl">Profile</Text>
          <Avatar
            onPress={() => {
              navigator.navigate("editParentImage");
            }}
            edit={true}
            size={80}
            style={styles.avatar}
          />
        </ImageBackground>

        <View style={styles.nameContainer}>
          <CustomText
            style={[
              styles.userName,
              isTablet ? styles.userNameTablet : styles.userNameMobile,
            ]}
          >
            {user?.name}
          </CustomText>
          <CustomText
            style={[
              styles.userEmail,
              isTablet ? styles.userEmailTablet : styles.userEmailMobile,
            ]}
          >
            {user?.email}
          </CustomText>
        </View>

        <View className="mx-auto mt-7 w-[90%]  max-w-screen-md rounded-3xl border border-border-lighter bg-white p-4 pt-4">
          <MenuItem
            icon={<BellRing size={isTablet ? 20 : 18} color="#EC4007" />}
            label="Notification Settings"
            onPress={() =>
              protectedNavigator.navigate("notification", {
                screen: "settings",
              })
            }
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
            onPress={() => protectedNavigator.navigate("getPremium")}
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
            icon={
              <AntDesign
                name="logout"
                color="#EC4007"
                size={isTablet ? 20 : 18}
              />
            }
            label="Log Out"
            isTablet={isTablet}
            onPress={() => setOpenModal("logout")}
          />
          <MenuItem
            icon={
              <Feather name="trash" color="#EC4007" size={isTablet ? 20 : 18} />
            }
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
  headerImage: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    bottom: -30,
    margin: "auto",
  },
  nameContainer: { alignItems: "center", marginTop: 30 },
  userName: {
    fontFamily: "quilka",
    textAlign: "center",
    color: colours.black,
  },
  userNameMobile: {
    fontSize: 24,
  },
  userNameTablet: {
    fontSize: 32,
  },
  userEmail: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
  userEmailMobile: {
    fontSize: 14,
  },
  userEmailTablet: {
    fontSize: 18,
  },
});
