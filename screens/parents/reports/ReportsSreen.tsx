import { useNavigation } from "@react-navigation/native";
import { Share2 } from "lucide-react-native";
import React, { FC } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import colours from "../../../colours";
import CustomText from "../../../components/CustomText";
import LoadingOverlay from "../../../components/LoadingOverlay";
import useAuth from "../../../contexts/AuthContext";
import { Cup, ImportCurve, Notepad2, TimerStart } from "iconsax-react-nativejs";
import ReportScore from "../../../components/ReportScore";
import defaultStyles from "../../../styles";

const ReportScreen: FC = () => {
  const { user, isLoading, logout } = useAuth();
  // const navigator = useNavigation<ParentProfileNavigatorProp>();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  if (isLoading) return <LoadingOverlay visible={isLoading} />;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require("../../../assets/bg-adaptive-image.png")}
          style={styles.header}
          resizeMode="contain"
          imageStyle={{
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
          className="relative -top-[15]"
        >
          <View className="p-[16] ">
            <CustomText
              style={{
                fontFamily: "quilka",
                fontSize: isTablet ? 32 : 24,
                textAlign: "center",
                marginTop: 16,
                color: colours.black,
                position: "relative",
              }}
            >
              Reports
            </CustomText>
            <View className=" relative -top-[25] flex-row gap-7 justify-end">
              <ImportCurve size={24} />
              <Share2 size={24} />
            </View>
          </View>

          {/* <Avatar
            onPress={() => {
              navigator.navigate("editParentImage");
            }}
            style={{
              position: "absolute",
              left: "50%",
              bottom: -56,
              marginLeft: -56,
            }}
          /> */}
        </ImageBackground>
        <View className="h-[153] border-b border-[#BDBDBD] justify-between">
          <CustomText
            style={{
              fontSize: 18,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 30,
            }}
          >
            No Child added yet
          </CustomText>
          <View className="flex-row justify-center gap-4">
            <View
              style={{
                height: 65,
                width: 75,
                borderRightWidth: 3,
                borderLeftWidth: 3,
                borderTopWidth: 3,
              }}
              className="border-b rounded-tr-[8] rounded-tl-[8] border-[#BDBDBD33] bg-[#BDBDBD33]"
            />
            <View
              style={{
                height: 65,
                width: 75,
                borderRightWidth: 3,
                borderLeftWidth: 3,
                borderTopWidth: 3,
              }}
              className="border-b rounded-tr-[8] rounded-tl-[8] border-[#BDBDBD33] bg-[#BDBDBD33]"
            />
            <View
              style={{
                height: 65,
                width: 75,
                borderRightWidth: 3,
                borderLeftWidth: 3,
                borderTopWidth: 3,
              }}
              className="border-b rounded-tr-[8] rounded-tl-[8] border-[#BDBDBD33] bg-[#BDBDBD33]"
            />
          </View>
          {/* <CustomText
            style={{
              fontFamily: "quilka",
              fontSize: isTablet ? 32 : 24,
              textAlign: "center",
              color: colours.black,
            }}
          >
            {user?.name}
          </CustomText> */}
        </View>
        <View className="mx-[16]">
          <Text className="font-[abeezee] my-6">OVERVIEW</Text>
          <View className="flex-row justify-center gap-[20]">
            <ReportScore
              icon={<Cup color="#0731EC" />}
              score={0}
              color="#5776FF33"
              title={"Stories Completed"}
            />
            <ReportScore
              icon={<TimerStart color="#FF8771" />}
              score={0}
              color="#FB958333"
              title="Screen Time"
            />
          </View>
        </View>
        <View className="mx-[16]">
          <Text className="font-[abeezee] my-6">WEEKLY REPORT</Text>
          <View className="items-center">
            <Notepad2 size={120} color="#EC400733" />
            <Text style={defaultStyles.defaultText} className="mt-3">
              Child weekly report will appear here
            </Text>
          </View>
        </View>
      </ScrollView>

      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFCFBFB" },
  scrollContent: { paddingBottom: 100 },
  header: {
    width: "100%",
    height: 192,
    position: "relative",
    overflow: "visible",
  },
  addPhotoText: { fontSize: 10, color: "#6B7280", marginTop: 4 },
  nameContainer: { alignItems: "center", marginTop: 56 },
});
