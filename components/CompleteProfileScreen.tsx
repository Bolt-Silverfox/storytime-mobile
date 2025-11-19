import React, { useState } from "react";
import colours from "../colours";
import { View, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomText from "../components/CustomText";

type RootStackParamList = {
  CompleteProfile: undefined;
  NextPage: { kids: string };
};

type CompleteProfileScreenProp = NativeStackNavigationProp<
  RootStackParamList,
  "CompleteProfile"
>;

export default function CompleteProfileScreen() {
  const navigation = useNavigation<CompleteProfileScreenProp>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

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
    <View className="mb-4">
      <TouchableOpacity
        onPress={() =>
          setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey)
        }
        className="border border-gray-300 rounded-3xl p-4"
      >
        <View className="flex-row items-center justify-between w-full">
          <CustomText>{value}</CustomText>
          <CustomText className="text-gray-400 ml-3">
            {openDropdown === dropdownKey ? "▲" : "▼"}
          </CustomText>
        </View>
      </TouchableOpacity>

      {openDropdown === dropdownKey && (
        <View className="border border-gray-300 rounded-xl mt-1 bg-white">
          {options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              className="p-4 border-b border-gray-200"
              onPress={() => {
                onSelect(option);
                setOpenDropdown(null);
              }}
            >
              <CustomText>{option}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white"
    style={{backgroundColor: colours["bg-light"]}}>
      <View style={{ height:70, backgroundColor: "white" }} />

      <View
        className={`${isTablet ? "max-w-xl mx-auto" : ""}`}
        style={{
          width: 398,
          paddingHorizontal: 15,
          paddingVertical: 12,
          
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        
        <TouchableOpacity
          className="mb-12"
          onPress={() => navigation.goBack()}
        >
          <View className="w-3 h-3 border-t-2 border-l-2 border-black -rotate-45" />
        </TouchableOpacity>

        <CustomText
          style={{
            fontFamily: "quilka",
            fontSize: 24,
            textAlign: "center",
            color: colours.black,
          }}
        >
          COMPLETE YOUR PROFILE
        </CustomText>

        <CustomText className="text-center text-gray-500 mb-8 mt-1">
          Complete setting up your profile information
        </CustomText>

        {renderDropdown("Language", language, languages, "language", setLanguage)}
        {renderDropdown("Country", country, countries, "country", setCountry)}
        {renderDropdown("Kids", kids, kidsCount, "kids", setKids)}

        <CustomText className="text-gray-500 mb-8 mt-4">
          Please specify the number of kids you'd like to add. e.g 1, 2, 3, 4 etc.
        </CustomText>

        <View className="flex-row items-center justify-center">
          <TouchableOpacity className="border border-gray-300 py-3 px-20 rounded-3xl mr-10">
            <CustomText className="text-gray-700 font-medium">Skip</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-primary py-3 px-16 rounded-3xl"
            onPress={() => navigation.navigate("KidsInfoForm", { kids })}
          >
            <CustomText className="text-white font-medium mr-2">Proceed</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
