import React, { FC, useState, useEffect } from "react";
import colours from "../../../colours";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  Modal,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImageUploader from "../../../components/ImageUploader";
import CustomText from "../../../components/CustomText";
import {
  Camera,
  User,
  Lock,
  Phone,
  CreditCard,
  HelpCircle,
  LogOut,
  Trash,
  Home,
  ChartBar,
  Cog,
  Star,
} from "lucide-react-native";

const ProfileScreen: FC = ({ navigation }: any) => {
  const [kidsCount, setKidsCount] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploaderVisible, setUploaderVisible] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedImage = await AsyncStorage.getItem("profileImage");
        if (savedImage) setProfileImage(savedImage);

        const kids = await AsyncStorage.getItem("kidsCount");
        if (kids) setKidsCount(Number(kids));

        const savedName = await AsyncStorage.getItem("userName");
        if (savedName) setUserName(savedName);

        const savedEmail = await AsyncStorage.getItem("userEmail");
        if (savedEmail) setUserEmail(savedEmail);
      } catch (err) {
        console.warn("Failed to load data", err);
      }
    };
    loadData();
  }, []);

  
  const handleImageSave = async (uri: string | null) => {
    if (uri) {
      setProfileImage(uri);
      await AsyncStorage.setItem("profileImage", uri);
    }
    setUploaderVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={require("../../assets/VectorImg.png")}
          style={styles.header}
          imageStyle={{ borderBottomLeftRadius: 24, borderBottomRightRadius: 24 }}
        >
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={() => setUploaderVisible(true)}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
            ) : (
              <>
                <Camera size={32} color="#6B7280" />
                <CustomText style={styles.addPhotoText}>Add Photo</CustomText>
              </>
            )}
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
            {userName || "Your Name"}
          </CustomText>
          <CustomText
            style={{
              fontSize: isTablet ? 18 : 14,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            {userEmail || "youremail@example.com"}
          </CustomText>
        </View>

        <View style={styles.menuList}>
          <MenuItem
            icon={<User size={isTablet ? 20 : 18} />}
            label={`Manage ${kidsCount} Child${kidsCount !== 1 ? "ren" : ""} Profiles`}
            onPress={() => navigation.navigate("LinkChild")}
            isTablet={isTablet}
          />
          <MenuItem icon={<Lock size={isTablet ? 20 : 18} />} label="Manage Password/Pin" isTablet={isTablet} />
          <MenuItem icon={<Phone size={isTablet ? 20 : 18} />} label="Enable Finger Print / Face ID" isTablet={isTablet} />
          <MenuItem icon={<CreditCard size={isTablet ? 20 : 18} />} label="Subscription" isTablet={isTablet} />
          <MenuItem icon={<HelpCircle size={isTablet ? 20 : 18} />} label="Help & Support" isTablet={isTablet} />
          <MenuItem icon={<LogOut size={isTablet ? 20 : 18} />} label="Log Out" isTablet={isTablet} />
          <MenuItem icon={<Trash size={isTablet ? 20 : 18} />} label="Delete Account" textColor="#DC2626" isTablet={isTablet} />
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <NavItem icon={<Home size={isTablet ? 28 : 24} />} label="Home" isTablet={isTablet} />
        <NavItem icon={<ChartBar size={isTablet ? 28 : 24} />} label="Reports" isTablet={isTablet} />
        <NavItem icon={<Cog size={isTablet ? 28 : 24} />} label="Controls" isTablet={isTablet} />
        <NavItem icon={<Star size={isTablet ? 28 : 24} />} label="Favourite" isTablet={isTablet} />
        <NavItem icon={<User size={isTablet ? 28 : 24} />} label="Profile" active isTablet={isTablet} />
      </View>

      <Modal visible={uploaderVisible} animationType="slide">
        <ImageUploader
          initialImageUri={profileImage ?? undefined}
          onSave={handleImageSave}
          onCancel={() => setUploaderVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const MenuItem: FC<any> = ({ label, icon, textColor = "#000", onPress, isTablet }) => (
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
    <CustomText style={[styles.menuItemArrow, { fontSize: isTablet ? 24 : 20 }]}>›</CustomText>
  </TouchableOpacity>
);

const NavItem: FC<any> = ({ icon, label, active, isTablet }) => (
  <TouchableOpacity style={styles.navItem}>
    {icon}
    <CustomText
      style={[styles.navItemLabel, { color: active ? "#FB923C" : "#9CA3AF", fontSize: isTablet ? 14 : 10 }]}
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
  menuList: { marginTop: 24, paddingHorizontal: 16, alignSelf: "center", width: "90%" },
  menuItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemLabel: { fontSize: 16, marginLeft: 12 },
  menuItemArrow: { fontSize: 20, color: "#FB923C" },
  bottomNav: { position: "absolute", bottom: 10, left: 0, right: 0, backgroundColor: "#FFFFFF", paddingVertical: 12, flexDirection: "row", justifyContent: "space-around", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: -2 }, shadowRadius: 4, elevation: 5 },
  navItem: { alignItems: "center" },
  navItemLabel: { fontSize: 10, marginTop: 4 },
});
