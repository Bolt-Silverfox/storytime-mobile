import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UpdateUserProfileData,
  useUpdateProfile,
} from "../mutationHooks/useUpdateProfile";
import { BASE_URL } from "../../../constants";
import apiFetch from "../../../apiFetch";
import { useUploadImage } from "../mutationHooks/UseUploadUserImage";

interface Avatar {
  id: string;
  name: string;
  url: string;
  isSystemAvatar: boolean;
  publicId: string;
  createdAt: string;
}

interface Profile {
  id: string;
  explicitContent: boolean;
  maxScreenTimeMins: number;
  language: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

// Combined hook for uploading image and updating profile
export const useUpdateProfileWithImage = (userId: string) => {
  const uploadImage = useUploadImage(userId);
  const updateProfile = useUpdateProfile(userId);

  const uploadAndUpdate = async (
    imageUri: string,
    profileData?: Omit<UpdateUserProfileData, "avatarUrl">
  ) => {
    try {
      const uploadResult = await uploadImage.mutateAsync(imageUri);
      // const updateResult = await updateProfile.mutateAsync({
      //   ...profileData,
      //   avatarUrl: uploadResult.url,
      // });

      console.log(uploadResult);
      // console.log("profile update", updateResult);

      // return updateResult;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return {
    uploadAndUpdate,
    isLoading: uploadImage.isPending || updateProfile.isPending,
    error: uploadImage.error || updateProfile.error,
  };
};

// // Example Usage Component for React Native
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Image,
//   Alert,
//   StyleSheet,
// } from "react-native";
// import { BASE_URL } from "../../../constants";
// import { UpdateUserProfileData, useUpdateProfile } from "./useUpdateProfile";
// import { Profile } from "iconsax-react-nativejs";

// export function ProfileScreen() {
//   const userId = "user-123";
//   const { data: profile, isLoading } = useGetProfile(userId);
//   const { uploadAndUpdate, isLoading: isUpdating } =
//     useUpdateProfileWithImage(userId);

//   const [title, setTitle] = useState("");
//   const [name, setName] = useState("");
//   const [numberOfKids, setNumberOfKids] = useState("0");
//   const [language, setLanguage] = useState("");
//   const [country, setCountry] = useState("");
//   const [maxScreenTime, setMaxScreenTime] = useState("50");
//   const [explicitContent, setExplicitContent] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);

//   React.useEffect(() => {
//     if (profile) {
//       setTitle(profile.title);
//       setName(profile.name);
//       setNumberOfKids(String(profile.numberOfKids));
//       setLanguage(profile.profile.language);
//       setCountry(profile.profile.country);
//       setMaxScreenTime(String(profile.profile.maxScreenTimeMins));
//       setExplicitContent(profile.profile.explicitContent);
//     }
//   }, [profile]);

//   const pickImage = async () => {
//     // Request permission
//     const permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permissionResult.granted) {
//       Alert.alert("Permission required", "Please allow access to your photos");
//       return;
//     }

//     // Pick image
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       setSelectedImage(result.assets[0].uri);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!selectedImage) {
//       Alert.alert("Error", "Please select an image");
//       return;
//     }
