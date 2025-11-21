import React, { useState } from "react";
import colours from "../../colours";
import { View, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomText from "../../components/CustomText";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  CompleteProfile: undefined;
  kidsInfoForm: { kidsCount?: number };
};

type CompleteProfileScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompleteProfile"
>;

export default function CompleteProfileScreen() {
  const navigation = useNavigation<CompleteProfileScreenProp>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const containerWidth = isTablet ? Math.min(width * 0.55, 600) : "100%";

  const [language, setLanguage] = useState("English");
  const [country, setCountry] = useState("Nigeria");
  const [kids, setKids] = useState("1");
  const [openDropdown, setOpenDropdown] = useState<"language" | "country" | "kids" | null>(null);

  const languages = ["English", "Spanish", "French"];
  const countries = ["Nigeria", "Ghana", "Kenya"];
  const kidsCount = Array.from({ length: 12 }, (_, i) => (i + 2).toString());

  const renderDropdown = (
    label: string,
    value: string,
    options: string[],
    dropdownKey: "language" | "country" | "kids",
    onSelect: (v: string) => void
  ) => (
    <View style={{ marginBottom: isTablet ? 16 : 8 }}>
      <TouchableOpacity
        onPress={() =>
          setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey)
        }
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 24,
          padding: isTablet ? 16 : 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CustomText style={{ fontSize: isTablet ? 18 : 14 }}>{value}</CustomText>
          <CustomText style={{ color: "#666", marginLeft: 8, fontSize: isTablet ? 18 : 14 }}>
            {openDropdown === dropdownKey ? "▲" : "▼"}
          </CustomText>
        </View>
      </TouchableOpacity>

      {openDropdown === dropdownKey && (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 12,
            marginTop: 4,
            backgroundColor: "#fff",
          }}
        >
          {options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={{
                padding: isTablet ? 16 : 12,
                borderBottomWidth: 1,
                borderColor: "#eee",
              }}
              onPress={() => {
                onSelect(option);
                setOpenDropdown(null);
              }}
            >
              <CustomText style={{ fontSize: isTablet ? 16 : 13 }}>{option}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      style={{ backgroundColor: colours["bg-light"], flex: 1 }}
      contentContainerStyle={{
        paddingTop: isTablet ? 48 : 20,
        paddingBottom: 80,
        minHeight: "100%",
        alignItems: "center",
      }}
    >
      <View style={{ height: isTablet ? 40 : 20 }} />

      <View
        style={{
          width: containerWidth,
          paddingHorizontal: isTablet ? 28 : 15,
          paddingVertical: isTablet ? 24 : 12,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          style={{ marginBottom: isTablet ? 24 : 12 }}
          onPress={() => navigation.goBack()}
        >
          <View
            style={{
              width: isTablet ? 20 : 12,
              height: isTablet ? 20 : 12,
              borderTopWidth: 2,
              borderLeftWidth: 2,
              borderColor: "black",
              transform: [{ rotate: "-45deg" }],
            }}
          />
        </TouchableOpacity>

        <CustomText
          style={{
            fontFamily: "quilka",
            fontSize: isTablet ? 32 : 24,
            textAlign: "center",
            color: colours.black,
          }}
        >
          COMPLETE YOUR PROFILE
        </CustomText>

        <CustomText
          style={{
            textAlign: "center",
            color: "#777",
            marginBottom: isTablet ? 16 : 8,
            marginTop: 4,
            fontSize: isTablet ? 18 : 14,
          }}
        >
          Complete setting up your profile information
        </CustomText>

        {renderDropdown("Language", language, languages, "language", setLanguage)}
        {renderDropdown("Country", country, countries, "country", setCountry)}
        {renderDropdown("Kids", kids, kidsCount, "kids", setKids)}

        <CustomText
          style={{
            color: "#555",
            marginBottom: isTablet ? 24 : 12,
            marginTop: isTablet ? 16 : 8,
            fontSize: isTablet ? 16 : 13,
          }}
        >
          Please specify the number of kids you'd like to add. e.g 1, 2, 3, 4 etc.
        </CustomText>

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: isTablet ? 12 : 8 }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 24,
              marginRight: isTablet ? 12 : 8,
              paddingVertical: isTablet ? 14 : 10,
              paddingHorizontal: isTablet ? 40 : 20,
            }}
          >
            <CustomText style={{ color: "#555", fontWeight: "500" }}>Skip</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colours.primary,
              borderRadius: 24,
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: isTablet ? 14 : 10,
              paddingHorizontal: isTablet ? 48 : 32,
            }}
            onPress={async () => {
              await AsyncStorage.setItem("kidsCount", kids);
              navigation.navigate("kidsInfoForm", { kidsCount: Number(kids) });
            }}
          >
            <CustomText style={{ color: "white", fontWeight: "600", marginRight: 8 }}>
              Proceed
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
