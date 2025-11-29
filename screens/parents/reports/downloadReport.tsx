import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
} from "react-native";
import Icon from "../../../components/Icon";
import { ParentProfileNavigatorProp } from "../../../Navigation/ParentProfileNavigator";
import { CheckCircle } from "lucide-react-native";
// For PDF generation, you'd use: import RNHTMLtoPDF from 'react-native-html-to-pdf';
// Or: import * as Print from 'expo-print';
// Or: import RNPrint from 'react-native-print';

interface ScreenTimeData {
  date: string;
  hours: number;
}

const PDFReportPreviewScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const route = useRoute();
  const { childId, weekRange } = route.params as {
    childId: string;
    weekRange: string;
  };

  // Mock data - replace with actual data
  const childData = {
    name: "Jacob Luke",
    ageRange: "9-12 yrs",
    avatar: require("../../../assets/avatar-jacob.png"),
  };

  const stats = {
    storiesCompleted: 8,
    rightAnswers: 8,
    starsEarned: 7,
    badgesEarned: 1,
    totalScreenTime: "8 hours",
    challengesCompleted: 5,
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

  const handleDownloadPDF = async () => {
    try {
      // In a real implementation, you would:
      // 1. Generate HTML content from the report data
      // 2. Convert to PDF using one of these libraries:
      
      // Option 1: react-native-html-to-pdf
      /*
      const options = {
        html: generateHTMLReport(),
        fileName: `${childData.name}_Weekly_Report`,
        directory: 'Documents',
      };
      const file = await RNHTMLtoPDF.convert(options);
      */

      // Option 2: expo-print (if using Expo)
      /*
      const { uri } = await Print.printToFileAsync({
        html: generateHTMLReport(),
      });
      await shareAsync(uri);
      */

      // Option 3: react-native-print
      /*
      await RNPrint.print({
        html: generateHTMLReport(),
      });
      */

      // For now, show a success message
      Alert.alert(
        "Success",
        "PDF Report downloaded successfully!",
        [{ text: "OK", onPress: () => navigator.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to download PDF. Please try again.");
      console.error("PDF generation error:", error);
    }
  };

  const generateHTMLReport = () => {
    // Generate HTML content for PDF
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .stat-item { text-align: center; padding: 15px; background: #f5f5f5; border-radius: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CHILD WEEKLY REPORT</h1>
            <h2>${childData.name}</h2>
            <p>${childData.ageRange}</p>
            <p>WEEK: Nov 6, 2025 - Nov 13, 2025</p>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <h3>${stats.storiesCompleted}</h3>
              <p>Stories Completed</p>
            </div>
            <div class="stat-item">
              <h3>${stats.rightAnswers}</h3>
              <p>Right Answers</p>
            </div>
            <div class="stat-item">
              <h3>${stats.starsEarned}</h3>
              <p>Stars Earned</p>
            </div>
            <div class="stat-item">
              <h3>${stats.badgesEarned}</h3>
              <p>Badges Earned</p>
            </div>
            <div class="stat-item">
              <h3>${stats.totalScreenTime}</h3>
              <p>Total Screen Time</p>
            </div>
            <div class="stat-item">
              <h3>${stats.challengesCompleted}</h3>
              <p>Challenges Completed</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex flex-row items-center justify-center px-4 py-5 bg-white">
        <Pressable
          onPress={() => navigator.goBack()}
          className="absolute left-4"
        >
          <Icon name="ChevronLeft" size={24} />
        </Pressable>
      </View>

      {/* PDF Preview Content */}
      <View className="px-4 py-6">
        {/* Title */}
        <Text className="text-2xl font-bold text-center mb-8">
          CHILD WEEKLY REPORT
        </Text>

        {/* Child Info */}
        <View className="items-center mb-8">
          <Image
            source={childData.avatar}
            className="w-24 h-24 rounded-full mb-3"
          />
          <Text className="text-xl font-bold font-[abeezee]">
            {childData.name}
          </Text>
          <Text className="text-gray-600 font-[abeezee] mt-1">
            {childData.ageRange}
          </Text>
        </View>

        {/* Week Display */}
        <View className="flex flex-row justify-between items-center mb-8 px-4">
          <Text className="text-sm font-[abeezee] font-bold">WEEK</Text>
          <Text className="text-sm font-[abeezee] text-gray-600">
            Nov 6, 2025 - Nov 13, 2025
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="flex flex-col gap-y-6 mb-8">
          {/* Row 1 */}
          <View className="flex flex-row justify-around">
            <View className="items-center">
              <View className="w-16 h-16 bg-[#E6E6FA] rounded-full items-center justify-center mb-3">
                <Icon name="Trophy" size={28} color="#6B5FE8" />
              </View>
              <Text className="text-3xl font-bold">{stats.storiesCompleted}</Text>
              <Text className="text-gray-600 font-[abeezee] text-sm text-center">
                Stories Completed
              </Text>
            </View>
            <View className="items-center">
              <View className="w-16 h-16 bg-[#D4F4DD] rounded-full items-center justify-center mb-3">
                <CheckCircle size={28} color="#4CAF50" />
              </View>
              <Text className="text-3xl font-bold">{stats.rightAnswers}</Text>
              <Text className="text-gray-600 font-[abeezee] text-sm text-center">
                Right Answers
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View className="flex flex-row justify-around">
            <View className="items-center">
              <View className="w-16 h-16 bg-[#FFF9E6] rounded-full items-center justify-center mb-3">
                <Icon name="Star" size={28} color="#FFD700" />
              </View>
              <Text className="text-3xl font-bold">{stats.starsEarned}</Text>
              <Text className="text-gray-600 font-[abeezee] text-sm text-center">
                Stars Earned
              </Text>
            </View>
            <View className="items-center">
              <View className="w-16 h-16 bg-[#E6E6FA] rounded-full items-center justify-center mb-3">
                <Icon name="Award" size={28} color="#9C27B0" />
              </View>
              <Text className="text-3xl font-bold">{stats.badgesEarned}</Text>
              <Text className="text-gray-600 font-[abeezee] text-sm text-center">
                Badges Earned
              </Text>
            </View>
          </View>

          {/* Row 3 */}
          <View className="flex flex-row justify-around">
            <View className="items-center">
              <View className="w-16 h-16 bg-[#E3F2FD] rounded-full items-center justify-center mb-3">
                <Icon name="Clock" size={28} color="#2196F3" />
              </View>
              <Text className="text-3xl font-bold">{stats.totalScreenTime}</Text>
              <Text className="text-gray-600 font-[abeezee] text-sm text-center">
                Total Screen Time
              </Text>
            </View>
            <View className="items-center">
              <View className="w-16 h-16 bg-[#FFF3E0] rounded-full items-center justify-center mb-3">
                <Icon name="Target" size={28} color="#FF9800" />
              </View>
              <Text className="text-3xl font-bold">{stats.challengesCompleted}</Text>
              <Text className="text-gray-600 font-[abeezee] text-sm text-center">
                Challenges Completed
              </Text>
            </View>
          </View>
        </View>

        {/* Screen Time Distribution */}
        <View className="mt-6 mb-8">
          <Text className="text-lg font-bold mb-6">SCREEN TIME DISTRIBUTION</Text>

          <View className="flex flex-row items-end justify-between h-64 px-2">
            {screenTimeData.map((data, index) => {
              const heightPercentage = (data.hours / maxHours) * 100;
              const darkHeight = (data.hours / maxHours) * 60;

              return (
                <View key={index} className="flex-1 items-center mx-1">
                  <View className="w-full flex-1 justify-end">
                    <View
                      className="w-full bg-[#E6E6FA] rounded-t-full overflow-hidden"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      <View
                        className="w-full bg-[#6B5FE8] rounded-t-full"
                        style={{ height: `${darkHeight}%` }}
                      />
                    </View>
                  </View>
                  <Text className="text-xs text-gray-600 mt-2">{data.date}</Text>
                </View>
              );
            })}
          </View>

          {/* Y-axis labels */}
          <View className="absolute right-0 top-12 flex flex-col justify-between h-64">
            <Text className="text-xs text-gray-500">5hrs</Text>
            <Text className="text-xs text-gray-500">4hrs</Text>
            <Text className="text-xs text-gray-500">3hrs</Text>
            <Text className="text-xs text-gray-500">2hrs</Text>
            <Text className="text-xs text-gray-500">1hr</Text>
            <Text className="text-xs text-gray-500">0hr</Text>
          </View>
        </View>

        {/* Download Button */}
        <Pressable
          onPress={handleDownloadPDF}
          className="bg-[#FF6B4A] py-4 rounded-full mx-4 mb-8"
        >
          <Text className="text-white text-center text-lg font-[abeezee] font-bold">
            Download PDF
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default PDFReportPreviewScreen;
