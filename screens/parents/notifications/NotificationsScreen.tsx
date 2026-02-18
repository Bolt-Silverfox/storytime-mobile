import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import PageTitle from "../../../components/PageTitle";
import NotificationDetailsModal from "../../../components/modals/NotificationDetailsModal";
import {
  getNotificationIcon,
  mapCategoryToIconType,
  groupNotificationsByDate,
  getRelativeTime,
} from "../../../utils/utils";
import SafeAreaWrapper from "../../../components/UI/SafeAreaWrapper";
import { useGetNotifications } from "../../../hooks/tanstack/queryHooks/useGetNotifications";
import useMarkNotificationRead from "../../../hooks/tanstack/mutationHooks/useMarkNotificationRead";
import LoadingOverlay from "../../../components/LoadingOverlay";
import ErrorComponent from "../../../components/ErrorComponent";
import CustomEmptyState from "../../../components/emptyState/CustomEmptyState";
import type { Notification } from "../../../types";

const notificationsLabel = ["all", "read", "unread"] as const;
type NotificationType = (typeof notificationsLabel)[number];

const NotificationsScreen = () => {
  const navigator = useNavigation<ParentsNavigatorProp>();
  const [activeLabel, setActiveLabel] = useState<NotificationType>("all");
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  const allQuery = useGetNotifications();
  const unreadQuery = useGetNotifications({ unreadOnly: true });

  const markRead = useMarkNotificationRead();

  const activeQuery = activeLabel === "unread" ? unreadQuery : allQuery;
  const { isPending, error, refetch } = activeQuery;

  const notifications = (() => {
    if (activeLabel === "unread") {
      return unreadQuery.data?.notifications ?? [];
    }
    const all = allQuery.data?.notifications ?? [];
    if (activeLabel === "read") {
      return all.filter((n) => n.isRead);
    }
    return all;
  })();

  const grouped = groupNotificationsByDate(notifications);

  const handleNotificationPress = (notification: Notification) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
      markRead.mutate(notification.id);
    }
  };

  if (isPending) return <LoadingOverlay visible />;
  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-1 bg-bgLight">
        <PageTitle title="Notifications" goBack={() => navigator.goBack()} />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          className="max-h-20"
          horizontal
          contentContainerClassName="flex flex-row items-center  gap-x-2 p-5 justify-center"
        >
          {notificationsLabel.map((notification) => (
            <Text
              onPress={() => setActiveLabel(notification)}
              key={notification}
              className={`w-32 rounded-full py-2 text-center font-[abeezee] text-base capitalize ${notification === activeLabel ? "bg-blue text-white" : "border border-border text-text"}`}
            >
              {notification}
            </Text>
          ))}
        </ScrollView>
        <View className="mx-auto w-full max-w-screen-md flex-1">
          {notifications.length === 0 ? (
            <CustomEmptyState message="No notifications yet" />
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerClassName=" flex flex-col gap-y-8 px-4 pb-5"
            >
              <View className="flex flex-col gap-y-6">
                {grouped.map((group) => (
                  <View className="flex flex-col gap-y-2.5" key={group.label}>
                    <Text className="font-[abeezee] text-[18px] text-black">
                      {group.label}
                    </Text>
                    <View className="flex flex-col gap-y-6 rounded-xl border border-border-lighter bg-white p-5">
                      {group.notifications.map((noti) => (
                        <Pressable
                          onPress={() => handleNotificationPress(noti)}
                          className="flex-row gap-x-4"
                          key={noti.id}
                        >
                          {getNotificationIcon(
                            mapCategoryToIconType(noti.category)
                          )}
                          <View className="flex flex-1 flex-col gap-y-1.5">
                            <Text className="w-full text-wrap font-[abeezee] text-base leading-6 text-black">
                              {noti.title}
                            </Text>
                            <Text className="font-[abeezee] text-xs leading-6 text-text">
                              {getRelativeTime(noti.createdAt)} ago
                            </Text>
                          </View>
                          {!noti.isRead && (
                            <Image
                              className="size-8"
                              source={require("../../../assets/icons/middot.png")}
                            />
                          )}
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <NotificationDetailsModal
        isOpen={selectedNotification !== null}
        closeModal={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </SafeAreaWrapper>
  );
};

export default NotificationsScreen;
