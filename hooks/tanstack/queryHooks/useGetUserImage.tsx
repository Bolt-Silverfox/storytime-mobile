import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";

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

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  avatar: Avatar;
  role: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  profile: Profile;
  numberOfKids: number;
}

interface UpdateProfilePayload {
  title?: string;
  name?: string;
  avatarUrl?: string;
  profile?: {
    explicitContent?: boolean;
    maxScreenTimeMins?: number;
    language?: string;
    country?: string;
  };
  numberOfKids?: number;
}



export const useGetProfile = (userId: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async (): Promise<UserProfile> => {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      return response.json();
    },
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (imageUri: string): Promise<{ url: string }> => {
      // Create FormData for React Native
      const formData = new FormData();

      // Extract filename from URI
      const filename = imageUri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      return response.json();
    },
  });
};

// PUT: Update user profile
export const useUpdateProfile = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfilePayload): Promise<UserProfile> => {
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      // Or update the cache directly
      queryClient.setQueryData(["profile", userId], data);
    },
  });
};

// Combined hook for uploading image and updating profile
export const useUpdateProfileWithImage = (userId: string) => {
  const uploadImage = useUploadImage();
  const updateProfile = useUpdateProfile(userId);

  const uploadAndUpdate = async (
    imageUri: string,
    profileData?: Omit<UpdateProfilePayload, "avatarUrl">
  ) => {
    try {
      // First upload the image
      const uploadResult = await uploadImage.mutateAsync(imageUri);

      // Then update the profile with the new avatar URL
      const updateResult = await updateProfile.mutateAsync({
        ...profileData,
        avatarUrl: uploadResult.url,
      });

      return updateResult;
    } catch (error) {
      throw error;
    }
  };

  return {
    uploadAndUpdate,
    isLoading: uploadImage.isPending || updateProfile.isPending,
    error: uploadImage.error || updateProfile.error,
  };
};

// Example Usage Component for React Native
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { BASE_URL } from "../../../constants";

export function ProfileScreen() {
  const userId = "user-123";
  const { data: profile, isLoading } = useGetProfile(userId);
  const { uploadAndUpdate, isLoading: isUpdating } =
    useUpdateProfileWithImage(userId);

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [numberOfKids, setNumberOfKids] = useState("0");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [maxScreenTime, setMaxScreenTime] = useState("50");
  const [explicitContent, setExplicitContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (profile) {
      setTitle(profile.title);
      setName(profile.name);
      setNumberOfKids(String(profile.numberOfKids));
      setLanguage(profile.profile.language);
      setCountry(profile.profile.country);
      setMaxScreenTime(String(profile.profile.maxScreenTimeMins));
      setExplicitContent(profile.profile.explicitContent);
    }
  }, [profile]);

  const pickImage = async () => {
    // Request permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to your photos");
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image");
      return;
    }

    try {
      await uploadAndUpdate(selectedImage, {
        title,
        name,
        numberOfKids: Number(numberOfKids),
        profile: {
          language,
          country,
          explicitContent,
          maxScreenTimeMins: Number(maxScreenTime),
        },
      });

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Profile</Text>

      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.avatar} />
      ) : profile?.avatarUrl ? (
        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
      ) : null}

      <Button title="Pick Image" onPress={pickImage} />

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Number of Kids"
        value={numberOfKids}
        onChangeText={setNumberOfKids}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Profile Settings</Text>

      <TextInput
        style={styles.input}
        placeholder="Language"
        value={language}
        onChangeText={setLanguage}
      />

      <TextInput
        style={styles.input}
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
      />

      <TextInput
        style={styles.input}
        placeholder="Max Screen Time (mins)"
        value={maxScreenTime}
        onChangeText={setMaxScreenTime}
        keyboardType="numeric"
      />

      <Button
        title={
          explicitContent ? "Explicit Content: ON" : "Explicit Content: OFF"
        }
        onPress={() => setExplicitContent(!explicitContent)}
      />

      <Button
        title={isUpdating ? "Updating..." : "Update Profile"}
        onPress={handleSubmit}
        disabled={isUpdating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
});
