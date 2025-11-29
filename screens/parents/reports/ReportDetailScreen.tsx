import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "../../../components/Icon";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import CustomDateRangeModal from "./DateRangeModalComponent";
import ShareReportModal from "./ShareReportModalComponent";
import {  Share2, Star, Target } from "lucide-react-native";
import {
  Award,
  Clock,
  Cup,
  Heart,
  ImportCurve,
  MedalStar,
  TickCircle,
  Timer,
} from "iconsax-react-nativejs";
import ReportScore from "../../../components/ReportScore";

type ReportPeriod = "thisWeek" | "lastWeek" | "custom";

interface ScreenTimeData {
  date: string;
  hours: number;
}

const ReportDetailScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const route = useRoute();
  const { childId } = route.params as { childId: string };

  const [selectedPeriod, setSelectedPeriod] =
    useState<ReportPeriod>("thisWeek");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  // Mock data - replace with actual data
  const childName = "Jacob Luke";
  const todayScreenTime = 2;
  const remainingTime = "1 hour 30 minutes";
  const weekRange = "Nov 18, 2025 - Nov 24, 2025";

  const stats = {
    storiesCompleted: 10,
    rightAnswers: 12,
    starsEarned: 6,
    badgesEarned: 2,
    totalScreenTime: "8 hours",
    challengesCompleted: 5,
    favourites: 5,
    lastActive: "20 mins ago",
  };

  const screenTimeData: ScreenTimeData[] = [
    { date: "13/11", hours: 2.5 },
    { date: "14/11", hours: 1.8 },
    { date: "15/11", hours: 3.2 },
    { date: "16/11", hours: 2.1 },
    { date: "17/11", hours: 3.5 },
    { date: "18/11", hours: 2.8 },
    { date: "19/11", hours: 3.8 },
  ];

  const maxHours = 5;

  const handleDownloadPDF = () => {
    // navigator.navigate("pdfReportPreview", {
    //   childId,
    //   weekRange: getWeekDisplay(),
    // });
  };

  const handlePeriodChange = (period: ReportPeriod) => {
    if (period === "custom") {
      setIsDateModalOpen(true);
    } else {
      setSelectedPeriod(period);
    }
  };

  const handleCustomDateSelect = (start: Date, end: Date) => {
    setCustomDateRange({ start, end });
    setSelectedPeriod("custom");
    setIsDateModalOpen(false);
  };

  const getWeekDisplay = () => {
    if (selectedPeriod === "custom" && customDateRange) {
      const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      };
      return `${formatDate(customDateRange.start)} - ${formatDate(customDateRange.end)}`;
    }
    return weekRange;
  };

  return (
    <ScrollView className="flex-1 bg-[#FFFCFBFB]">
      {/* Header */}
      <View className="flex flex-row items-center justify-between px-4 py-5 bg-white">
        <Pressable onPress={() => navigator.goBack()}>
          <Icon name="ChevronLeft" size={24} />
        </Pressable>
        <Text className="text-lg font-[abeezee] ">{childName}</Text>
        <View className="flex flex-row gap-x-3">
          <Pressable onPress={handleDownloadPDF}>
            <ImportCurve size={24} />
          </Pressable>
          <Pressable onPress={() => setIsShareModalOpen(true)}>
            <Share2 size={24} />
          </Pressable>
        </View>
      </View>

      {/* Today's Screen Time */}
      <View className="px-4 mt-6 mx-2 bg-white py-4 rounded-[20]">
        <Text className="text-xl font-bold mb-3 font-[quilka] text-[20px]">
          Today's Screen Time: {todayScreenTime} Hours
        </Text>
        <View className="bg-[#E6E6FA] border-b-[2px] border-[#9AA8EF] p-1.5 rounded-full h-10 overflow-hidden">
          <View className="w-full bg-[#B0BAFF] rounded-full">
            <View
              className="bg-[#0731EC] h-full rounded-full"
              style={{
                width: `${(todayScreenTime / (todayScreenTime + 1.5)) * 100}%`,
              }}
            />
          </View>
        </View>
        <Text className="text-sm text-gray-600 mt-2">
          {remainingTime} remaining
        </Text>
      </View>

      {/* Weekly Report Overview */}
      <View className="px-4 mt-8">
        <Text className="text-xl font-[abeezee] mb-4">
          WEEKLY REPORT OVERVIEW
        </Text>

        {/* Period Selection */}
        <View className="flex flex-row gap-x-5 mb-4 mx-auto">
          <Pressable
            onPress={() => handlePeriodChange("thisWeek")}
            className={`px-6 py-2 rounded-full ${
              selectedPeriod === "thisWeek"
                ? "bg-[#4807EC]"
                : "bg-white border border-gray-300"
            }`}
          >
            <Text
              className={`font-[abeezee] ${
                selectedPeriod === "thisWeek" ? "text-white" : "text-black"
              }`}
            >
              This week
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handlePeriodChange("lastWeek")}
            className={`px-6 py-2 rounded-full ${
              selectedPeriod === "lastWeek"
                ? "bg-[#6B5FE8]"
                : "bg-white border border-gray-300"
            }`}
          >
            <Text
              className={`font-[abeezee] ${
                selectedPeriod === "lastWeek" ? "text-white" : "text-black"
              }`}
            >
              Last week
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handlePeriodChange("custom")}
            className={`px-6 py-2 rounded-full ${
              selectedPeriod === "custom"
                ? "bg-[#6B5FE8]"
                : "bg-white border border-gray-300"
            }`}
          >
            <Text
              className={`font-[abeezee] ${
                selectedPeriod === "custom" ? "text-white" : "text-black"
              }`}
            >
              Custom
            </Text>
          </Pressable>
        </View>

        {/* Week Display */}
        <View className="flex flex-row justify-between items-center mb-6 h-[73] bg-white">
          <Text className="text-lg font-[abeezee] font-bold">WEEK</Text>
          <Text className="text-sm font-[abeezee] text-gray-600">
            {getWeekDisplay()}
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex flex-col gap-y-8">
          {/* Row 1 */}
          <View className="flex flex-row justify-around">
            <ReportScore
              icon={<Cup color="#0731EC" />}
              score={stats.storiesCompleted}
              color="#5776FF33"
              title={"Stories Completed"}
            />
            {/* <ReportScore
              icon={<TimerStart color="#FF8771" />}
              score={stats.storiesCompleted}
              color="#FB958333"
              title="Screen Time"
            /> */}
            <ReportScore
              icon={<TickCircle color="#4CAF50" />}
              score={stats.rightAnswers}
              color="#D4F4DD"
              title="Right Answers"
            />
          </View>

          {/* Row 2 */}
          <View className="flex flex-row justify-around">
            <ReportScore
              icon={<Star color="#FFD700" />}
              score={stats.starsEarned}
              color="#FFF9E6"
              title="Stars Earned"
            />
            <ReportScore
              icon={<MedalStar color="#9C27B0" />}
              score={stats.starsEarned}
              color="#E6E6FA"
              title=" Badges Earned"
            />
          </View>

          {/* Row 3 */}
          <View className="flex flex-row justify-around">
            <ReportScore
              icon={<Timer color="#2196F3" />}
              score={stats.totalScreenTime}
              color="#E3F2FD"
              title="Total Screen Time"
            />
            <ReportScore
              icon={<Target color="#FF9800" />}
              score={stats.challengesCompleted}
              color="#FFF3E0"
              title="Challenges Completed"
            />
          </View>

          {/* Row 4 */}
          <View className="flex flex-row justify-around">
            <ReportScore
              icon={<Heart color="#E91E63" />}
              score={stats.favourites}
              color="#EC079433"
              title="Favourites"
            />
            <ReportScore
              icon={<Clock color="#FF6B6B" />}
              score={stats.lastActive}
              color="#FFE4E1"
              title="Last Active"
            />
          </View>
        </View>
      </View>

      {/* Screen Time Distribution */}
      <View className="px-4 mt-10 mb-8">
        <Text className="text-xl font-[abeezee] mb-6">
          SCREEN TIME DISTRIBUTION
        </Text>

        <View className="flex flex-row items-start justify-start h-64 px-2">
          {screenTimeData.map((data, index) => {
            const heightPercentage = (data.hours / maxHours) * 100;
            const darkHeight = (data.hours / maxHours) * 60; // Striped portion

            return (
              <View key={index} className="flex-1 items-center mx-1">
                <View className="w-full flex-1 justify-end">
                  <View
                    className=" bg-[#E6E6FA]  rounded-full border-b-[2px]  p-1.5 ] border-[#DAE1F1] overflow-hidden"
                    style={{ height: `${heightPercentage}%` }}
                  >
                    <View className="h-full  rounded-full p-1 bg-[#0731EC]">
                      <View
                        className="w-full bg-[#B0BAFF] rounded-t-full"
                        style={{
                          height: `${darkHeight}%`,
                          // background: "repeating-linear-gradient(45deg, #6B5FE8, #6B5FE8 4px, #4338CA 4px, #4338CA 8px)",
                        }}
                      />
                    </View>
                  </View>
                </View>
                <Text className="text-xs text-gray-600 mt-2">{data.date}</Text>
              </View>
            );
          })}
        </View>

        {/* Y-axis labels */}
        <View className="absolute right-4 top-12 flex flex-col justify-between h-64">
          <Text className="text-xs text-gray-500">5hrs</Text>
          <Text className="text-xs text-gray-500">4hrs</Text>
          <Text className="text-xs text-gray-500">3hrs</Text>
          <Text className="text-xs text-gray-500">2hrs</Text>
          <Text className="text-xs text-gray-500">1hr</Text>
          <Text className="text-xs text-gray-500">0hr</Text>
        </View>
      </View>

      {/* Custom Date Range Modal */}
      {isDateModalOpen && (
        <CustomDateRangeModal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          onSelectRange={handleCustomDateSelect}
        />
      )}

      {/* Share Report Modal */}
      {isShareModalOpen && (
        <ShareReportModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          childName={childName}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // box: {
  //   shadowColor: "#9AA8EF",
  //   shadowOffset: { width: 1, height: 3 },
  //   shadowOpacity: 1,
  //   shadowRadius: 0,
  //   elevation: 0,
  // },
});

export default ReportDetailScreen;
