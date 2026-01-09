import { Alert, Share } from "react-native";
import Icon from "../components/Icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";
import { QueryResponse } from "../types";

const filterStoriesByTitle = (stories: any[], searchQuery: string) => {
  if (!searchQuery.trim()) return stories;

  const query = searchQuery.toLowerCase().trim();
  return (
    stories?.filter((story) => story.title?.toLowerCase().includes(query)) || []
  );
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const getCategoryColour = (category: string) => {
  const lowerCaseCat = category.toLowerCase();
  if (lowerCaseCat === "adventure") {
    return "#0731EC";
  } else if (lowerCaseCat === "mystery") {
    return "#07A92A";
  } else if (lowerCaseCat === "honesty" || lowerCaseCat === "fantasy") {
    return "#EC0794";
  } else if (lowerCaseCat === "folk tales" || lowerCaseCat === "bedtime") {
    return "#EC4007";
  } else return "black";
};

const getNotificationIcon = (
  category: "security" | "achievement" | "limit"
) => {
  if (category === "security") {
    return <Icon name="ShieldAlert" color="#866EFF" />;
  } else if (category === "achievement") {
    return <Icon name="Star" color="#ECC607" />;
  } else if (category === "limit") {
    return <Icon name="Clock" color="#07CAEC" />;
  } else return <Icon name="Info" color="#EC4007" />;
};

const shareContent = async ({
  message,
  url,
  title,
}: {
  message?: string;
  url?: string;
  title?: string;
}) => {
  try {
    return await Share.share({
      message: `${message ?? "Check out this story on Storytime4Kids"}  : ${url}`,
      url,
      title,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("error occured while trying to share content", message);
    Alert.alert("Failed to share", message);
  }
};

const getLanguageCode = (language: string): string => {
  const lowerCaseInput = language.toLowerCase();
  if (lowerCaseInput === "english") {
    return "en";
  } else if (lowerCaseInput === "spanish") {
    return "es";
  } else if (lowerCaseInput === "italian") {
    return "it";
  } else if (lowerCaseInput === "german") {
    return "de";
  } else if (lowerCaseInput === "french") {
    return "fr";
  } else {
    return "en";
  }
};

const getErrorMessage = (err: unknown, fallback?: string) => {
  return err instanceof Error
    ? err.message
    : (fallback ?? "Unexpected error, try again.");
};

const urlToBlob = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

const uploadUserAvatar = async (imageUri: string, userId: string) => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "avatar.jpg",
    } as any);
    formData.append("userId", userId);
    const request = await fetch(`${BASE_URL}/avatars/upload/user`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response: QueryResponse = await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error, try again";
    throw new Error(message);
  }
};

export {
  filterStoriesByTitle,
  getGreeting,
  getCategoryColour,
  getNotificationIcon,
  shareContent,
  getLanguageCode,
  getErrorMessage,
  urlToBlob,
  uploadUserAvatar,
};
