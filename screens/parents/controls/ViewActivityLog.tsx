import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, Text, View } from "react-native";
import PageTitle from "../../../components/PageTitle";
import {
  ParentControlNavigatorParamList,
  ParentControlNavigatorProp,
} from "../../../Navigation/ParentControlsNavigator";
import useGetKidActivityLog from "../../../hooks/tanstack/queryHooks/useGetKidActivityLog";
import ErrorComponent from "../../../components/ErrorComponent";
import LoadingOverlay from "../../../components/LoadingOverlay";

type ViewActivityLogRouteProp = RouteProp<
  ParentControlNavigatorParamList,
  "viewActivityLog"
>;

const ViewActivityLog = () => {
  const { params } = useRoute<ViewActivityLogRouteProp>();
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const { isPending, error, data, refetch } = useGetKidActivityLog(
    params.childId
  );

  if (error)
    return <ErrorComponent message={error.message} refetch={refetch} />;
  if (isPending)
    return (
      <LoadingOverlay visible={isPending} label="Loading activity logs..." />
    );
  console.log("activity logs data", data);

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="min-h-full gap-y-10 max-w-screem-md mx-auto w-full"
    >
      <PageTitle goBack={() => navigator.goBack()} title="Activity Log" />
      {data.length > 0 ? (
        <View className="flex flex-col gap-y-4">
          {data.map((activity) => (
            <View
              className="p-4 rounded-2xl bg-slate-200 mx-5"
              key={activity.id}
            >
              <Text className="text-xl font-[abeezee] mb-10">
                {new Date(activity.createdAt).toLocaleString()}
              </Text>
              <Text>Device : {activity.deviceName}</Text>
              <Text>IP : {activity.ipAddress}</Text>
              <Text>Status : {activity.status}</Text>
              <Text>Detail : {activity.details}</Text>
            </View>
          ))}
        </View>
      ) : (
        <EmptyState />
      )}
    </ScrollView>
  );
};

export default ViewActivityLog;

const EmptyState = () => {
  return (
    <View className="rounded-lg mx-5 h-[30%] justify-center items-center flex flex-col bg-[#f5f5f5]">
      <Text className="text-xl font-[abeezee] text-dark text-center">
        No activity reports yet
      </Text>
    </View>
  );
};

const activityDummyData: ActivityLog[] = [
  {
    date: "2025-11-20 9:45 UTC",
    deviceName: "Samsung A14, Android v12.1",
    IP: "102.89.120.33",
    status: "Successful",
  },
  {
    date: "2025-11-20 9:46 UTC",
    deviceName: "Samsung A14, Android v18.1",
    IP: "102.89.120.33",
    status: "Successful",
  },
  {
    date: "2025-11-20 9:47 UTC",
    deviceName: "Redmi A4 Plus, Android v12.1",
    IP: "102.89.120.33",
    status: "Successful",
  },
];

type ActivityLog = {
  date: string;
  deviceName: string;
  IP: string;
  status: string;
};
