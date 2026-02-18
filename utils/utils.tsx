import { Alert, Share } from "react-native";
import Icon from "../components/Icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../constants";
import type {
  Notification,
  NotificationCategory,
  QueryResponse,
} from "../types";

const filterStoriesByTitle = (
  stories: { title?: string }[],
  searchQuery: string
) => {
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
    const errorMessage =
      err instanceof Error ? err.message : "Unexpected error";
    Alert.alert("Failed to share", errorMessage);
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

    const uriParts = imageUri.split(".");
    const fileType = uriParts[uriParts.length - 1];

    formData.append("image", {
      uri: imageUri,
      type: `image/${fileType}`,
      name: `avatar.${fileType}`,
    } as unknown as Blob);

    formData.append("userId", userId);
    const request = await fetch(`${BASE_URL}/avatars/upload/user`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!request.ok) {
      throw new Error(`Upload failed with status ${request.status}`);
    }

    const response: QueryResponse = await request.json();
    if (!response.success) throw new Error(response.message);
    return response;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Unexpected error, try again";
    throw new Error(message);
  }
};

const secondsToMinutes = (durationInSeconds: number): number => {
  return Math.round(durationInSeconds / 60);
};

const splitByWordCount = (text: string, wordsPerChunk: number): string[] => {
  const cleanedText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

  const words = cleanedText.split(" ");

  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(" ");
    chunks.push(chunk);
  }

  return chunks;
};

const splitByWordCountPreservingSentences = (
  text: string,
  wordsPerChunk: number
): string[] => {
  const cleanedText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  const sentences = cleanedText.split(/([.!?]+\s+)/).filter((s) => s.trim());
  const chunks: string[] = [];
  let currentChunk: string[] = [];
  let currentWordCount = 0;

  for (const sentence of sentences) {
    const words = sentence.split(" ").filter((w) => w.length > 0);
    const sentenceWordCount = words.length;

    if (
      currentWordCount + sentenceWordCount > wordsPerChunk &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.join(" "));
      currentChunk = [];
      currentWordCount = 0;
    }

    currentChunk.push(sentence);
    currentWordCount += sentenceWordCount;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const getRandomNumber = (): number => {
  return Math.floor(Math.random() * 10 + 0);
};

const mapCategoryToIconType = (
  category: NotificationCategory
): "security" | "achievement" | "limit" => {
  const securityCategories: NotificationCategory[] = [
    "EMAIL_VERIFICATION",
    "PASSWORD_RESET",
    "PASSWORD_RESET_ALERT",
    "PASSWORD_CHANGED",
    "PIN_RESET",
    "NEW_LOGIN",
    "SYSTEM_ALERT",
  ];
  const achievementCategories: NotificationCategory[] = [
    "ACHIEVEMENT_UNLOCKED",
    "BADGE_EARNED",
    "STREAK_MILESTONE",
    "STORY_FINISHED",
    "NEW_STORY",
    "STORY_RECOMMENDATION",
    "FEEDBACK",
  ];

  if (securityCategories.includes(category)) return "security";
  if (achievementCategories.includes(category)) return "achievement";
  return "limit";
};

const groupNotificationsByDate = (
  notifications: Notification[]
): { label: string; notifications: Notification[] }[] => {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const groups = new Map<string, Notification[]>();

  for (const notification of notifications) {
    const date = new Date(notification.createdAt);
    const startOfDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const diffDays = Math.floor(
      (startOfToday.getTime() - startOfDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let label: string;
    if (diffDays === 0) {
      label = "Today";
    } else if (diffDays === 1) {
      label = "Yesterday";
    } else if (diffDays < 7) {
      label = `${diffDays} days ago`;
    } else {
      label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    const existing = groups.get(label) ?? [];
    existing.push(notification);
    groups.set(label, existing);
  }

  return Array.from(groups.entries()).map(([label, notifications]) => ({
    label,
    notifications,
  }));
};

const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
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
  secondsToMinutes,
  splitByWordCount,
  splitByWordCountPreservingSentences,
  formatTime,
  getRandomNumber,
  mapCategoryToIconType,
  groupNotificationsByDate,
  getRelativeTime,
};
