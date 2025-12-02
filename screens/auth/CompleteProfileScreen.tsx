import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import colours from "../../colours";
import CustomText from "../../components/CustomText";
import useUpdateUserProfile from "../../hooks/tanstack/mutationHooks/useUpdateUserProfile";
import { ProfileNavigatorProp } from "../../Navigation/ProfileNavigator";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function CompleteProfileScreen() {
  const navigation = useNavigation<ProfileNavigatorProp>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const containerWidth = isTablet ? Math.min(width * 0.55, 600) : "100%";

  const [language, setLanguage] = useState("English");
  const [country, setCountry] = useState("Nigeria");
  const [kids, setKids] = useState("1");
  const { mutate, isPending } = useUpdateUserProfile({
    onSuccess: () =>
      navigation.navigate("kidsInfoForm", { kidsCount: Number(kids) }),
  });
  const [openDropdown, setOpenDropdown] = useState<
    "language" | "country" | "kids" | null
  >(null);

  const languages = ["English", "Spanish", "French"];
  const countries = ["Nigeria", "Ghana", "Kenya"];
  const kidsCount = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

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
          <CustomText style={{ fontSize: isTablet ? 18 : 14 }}>
            {value}
          </CustomText>
          <CustomText
            style={{
              color: "#666",
              marginLeft: 8,
              fontSize: isTablet ? 18 : 14,
            }}
          >
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
              <CustomText style={{ fontSize: isTablet ? 16 : 13 }}>
                {option}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-white"
      style={{ backgroundColor: colours["bg-light"] }}
    >
      <View style={{ height: 70, backgroundColor: "white" }} />

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
        <TouchableOpacity className="mb-12" onPress={() => navigation.goBack()}>
          <View className="w-3 h-3 border-t-2 border-l-2 border-black -rotate-45" />
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

        {renderDropdown(
          "Language",
          language,
          languages,
          "language",
          setLanguage
        )}
        {renderDropdown("Country", country, countries, "country", setCountry)}
        {renderDropdown("Kids", kids, kidsCount, "kids", setKids)}

        <CustomText className="text-gray-500 mb-8 mt-4">
          Please specify the number of kids you'd like to add. e.g 1, 2, 3, 4
          etc.
        </CustomText>

        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("kidsInfoForm", {
                kidsCount: 1,
              })
            }
            className="border border-gray-300 py-3 px-20 rounded-3xl mr-10"
          >
            <CustomText className="text-gray-700 font-medium">Skip</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={isPending}
            className="flex-row items-center bg-primary py-3 px-16 rounded-3xl"
            onPress={() => mutate({ country, language })}
          >
            <CustomText className="text-white font-medium mr-2">
              Proceed
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
      <LoadingOverlay visible={isPending} label="Saving changes..." />
    </ScrollView>
  );
}
