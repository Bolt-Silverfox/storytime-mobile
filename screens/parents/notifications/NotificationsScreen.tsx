import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { ParentsNavigatorProp } from "../../../Navigation/ParentsNavigator";
import PageTitle from "../../../components/PageTitle";
import NotificationDetailsModal from "../../../components/modals/NotificationDetailsModal";
import { getNotificationIcon } from "../../../utils/utils";

const notificationsLabel = ["all", "read", "unread"] as const;
type NotificationType = (typeof notificationsLabel)[number];

const NotificationsScreen = () => {
  const navigator = useNavigation<ParentsNavigatorProp>();
  const [activeLabel, setActiveLabel] = useState<NotificationType>("all");
  const [activeNotification, setActiveNotification] = useState<string | null>(
    null
  );

  return (
    <View className="flex flex-1 bg-bgLight">
      <PageTitle title="Notifications" goBack={() => navigator.goBack()} />
      <View className="flex flex-row items-center gap-x-2 my-5 gap-y-4 justify-center">
        {notificationsLabel.map((notification) => (
          <Text
            onPress={() => setActiveLabel(notification)}
            key={notification}
            className={`font-[abeezee] capitalize text-center rounded-full py-2 w-32 text-base ${notification === activeLabel ? "text-white bg-blue" : "text-text border border-border"}`}
          >
            {notification}
          </Text>
        ))}
      </View>
      <View className="flex-1 max-w-screen-md mx-auto w-full">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName=" flex flex-col gap-y-8 px-4 pb-5"
        >
          <View className="flex flex-col gap-y-6">
            {notificationsDummyData.map((notification) => (
              <View className="flex flex-col gap-y-2.5" key={notification.id}>
                <Text className="font-[abeezee] text-[18px] text-black">
                  {notification.date}
                </Text>
                <Pressable
                  onPress={() => setActiveNotification(notification.id)}
                  className="bg-white border border-border-lighter flex flex-col gap-y-6 p-5 rounded-xl"
                >
                  {notification.notifications.map((noti) => (
                    <View className="flex-row gap-x-4" key={noti.text}>
                      {getNotificationIcon(noti.type)}
                      <View className="flex flex-1 flex-col gap-y-1.5">
                        <Text className="font-[abeezee] w-full text-wrap text-black text-base leading-6">
                          {noti.text}
                        </Text>
                        <Text className="font-[abeezee] text-text text-xs leading-6">
                          {noti.time} ago
                        </Text>
                      </View>
                      {noti.status === "unread" && (
                        <Image
                          className="size-8"
                          source={require("../../../assets/icons/middot.png")}
                        />
                      )}
                    </View>
                  ))}
                </Pressable>
                <NotificationDetailsModal
                  isOpen={activeNotification === notification.id}
                  closeModal={() => setActiveNotification(null)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default NotificationsScreen;

type NotificationDataType = {
  id: string;
  date: string;
  notifications: {
    type: "security" | "achievement" | "limit";
    time: string;
    text: string;
    status: "read" | "unread";
  }[];
};

const notificationsDummyData: NotificationDataType[] = [
  {
    id: "1",
    date: "Today",
    notifications: [
      {
        type: "security",
        time: "2 hours",
        text: "Your account was accessed from a new device on 19 Dec 2025. Review it now.",
        status: "unread",
      },
      {
        type: "achievement",
        time: "2 hours",
        text: 'Ella just finished listening to "The Friendly Dragon." ',
        status: "unread",
      },
      {
        type: "limit",
        time: "4 hours",
        text: 'Ella has reached her screen time limit for today." ',
        status: "read",
      },
    ],
  },
  {
    id: "2",
    date: "Yesterday",
    notifications: [
      {
        type: "security",
        time: "1 day",
        text: "Your account was accessed from a new device on 19 Dec 2025. Review it now.",
        status: "read",
      },
      {
        type: "security",
        time: "1 day",
        text: "Your was accessed from a new device on 19 Dec 2025. Review it now.",
        status: "read",
      },
      {
        type: "limit",
        time: "1 day",
        text: 'Ella has reached her screen time limit for today." ',
        status: "unread",
      },
    ],
  },
  {
    id: "3",
    date: "2 days ago",
    notifications: [
      {
        type: "security",
        time: "2 days",
        text: "Your account was accessed from a new device on 19 Dec 2025. Review it now.",
        status: "read",
      },
      {
        type: "security",
        time: "2 days",
        text: "Your was accessed from a new device on 19 Dec 2025. Review it now.",
        status: "read",
      },
      {
        type: "limit",
        time: "2 days",
        text: 'Ella has reached her screen time limit for today." ',
        status: "unread",
      },
    ],
  },
];
