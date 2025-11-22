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

const ProfileScreen: FC = () => {
  const [uploaderVisible, setUploaderVisible] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const navigator = useNavigation<ParentProfileNavigatorProp>();

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
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={() => setUploaderVisible(true)}
          >
            <Image
              source={require("../../../assets/placeholder-pfp.png")}
              width={100}
              height={100}
              borderRadius={50}
              className="h-full w-full"
            />
          </TouchableOpacity>
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
            label="Manage Child  Profiles"
            onPress={() => navigator.navigate("manageChildProfiles")}
            isTablet={isTablet}
          />
          <MenuItem
            icon={<Lock size={isTablet ? 20 : 18} />}
            label="Manage Password/Pin"
            isTablet={isTablet}
          />
          <MenuItem
            icon={<Phone size={isTablet ? 20 : 18} />}
            label="Enable Finger Print / Face ID"
            isTablet={isTablet}
          />
          <MenuItem
            icon={<CreditCard size={isTablet ? 20 : 18} />}
            label="Subscription"
            isTablet={isTablet}
          />
          <MenuItem
            icon={<HelpCircle size={isTablet ? 20 : 18} />}
            label="Help & Support"
            isTablet={isTablet}
          />
          <MenuItem
            icon={<LogOut size={isTablet ? 20 : 18} />}
            label="Log Out"
            isTablet={isTablet}
            onPress={logout}
          />
          <MenuItem
            icon={<Trash size={isTablet ? 20 : 18} />}
            label="Delete Account"
            textColor="#DC2626"
            isTablet={isTablet}
          />
        </View>
      </ScrollView>
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default ProfileScreen;

const MenuItem: FC<any> = ({
  label,
  icon,
  textColor = "#000",
  onPress,
  isTablet,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      {icon}
      <CustomText
        style={[
          styles.menuItemLabel,
          { color: textColor, fontSize: isTablet ? 18 : 16 },
        ]}
      >
        {label}
      </CustomText>
    </View>
    <CustomText
      style={[styles.menuItemArrow, { fontSize: isTablet ? 24 : 20 }]}
    >
      ›
    </CustomText>
  </TouchableOpacity>
);

const NavItem: FC<any> = ({ icon, label, active, isTablet }) => (
  <TouchableOpacity style={styles.navItem}>
    {icon}
    <CustomText
      style={[
        styles.navItemLabel,
        { color: active ? "#FB923C" : "#9CA3AF", fontSize: isTablet ? 14 : 10 },
      ]}
    >
      {label}
    </CustomText>
  </TouchableOpacity>
);

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
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemLabel: { fontSize: 16, marginLeft: 12 },
  menuItemArrow: { fontSize: 20, color: "#FB923C" },
  bottomNav: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
    elevation: 5,
  },
  navItem: { alignItems: "center" },
  navItemLabel: { fontSize: 10, marginTop: 4 },
});
