import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
  Share,
  Platform,
} from 'react-native';
import Icon from '../../../components/Icon';
import {
  ParntReportNavigatorProp,
  ParentReportNavigatorParamList,
} from '../../../Navigation/ParentsReportNavigator';
import { CheckCircle, Share2 } from 'lucide-react-native';
import ImageWithFallback from '../../../components/parents/ImageWithFallback';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ShareReportModal from './ShareReportModalComponent';

interface ScreenTimeData {
  date: string;
  hours: number;
}

type RouteProps = RouteProp<ParentReportNavigatorParamList, 'pdfReportPreview'>;

const PDFReportPreviewScreen = () => {
  const navigator = useNavigation<ParntReportNavigatorProp>();
  const route = useRoute<RouteProps>();
  const { childId, weekRange, reportData } = route.params;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [pdfFilePath, setPdfFilePath] = useState<string | null>(null);

  // Format screen time from minutes to hours
  const formatScreenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${mins} min${mins > 1 ? 's' : ''}`;
    }
  };

  const stats = {
    storiesCompleted: reportData.storiesCompleted,
    rightAnswers: reportData.rightAnswers,
    starsEarned: reportData.starsEarned,
    badgesEarned: reportData.badgesEarned,
    totalScreenTime: formatScreenTime(reportData.screenTimeMins),
    challengesCompleted: 0, // Not available in report data
  };

  const screenTimeData: ScreenTimeData[] = [
    { date: '13/11', hours: 2.5 },
    { date: '14/11', hours: 1.8 },
    { date: '15/11', hours: 3.2 },
    { date: '16/11', hours: 2.1 },
    { date: '17/11', hours: 3.5 },
    { date: '18/11', hours: 2.8 },
    { date: '19/11', hours: 3.8 },
  ];

  const maxHours = 5;

  const generatePDF = async () => {
    try {
      const html = generateHTMLReport();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      setPdfFilePath(uri);
      return uri;
    } catch (error) {
      console.error('PDF generation error:', error);
      throw error;
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const filePath = await generatePDF();

      if (filePath) {
        Alert.alert(
          'Success',
          'PDF Report generated successfully!',
          [
            {
              text: 'Share',
              onPress: () => handleSharePDF(filePath),
            },
            {
              text: 'OK',
              style: 'cancel',
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', error);
    }
  };

  const handleSharePDF = async (filePath?: string) => {
    try {
      const pdfPath = filePath || pdfFilePath;
      if (!pdfPath) {
        // Generate PDF if not already generated
        const generatedPath = await generatePDF();
        if (!generatedPath) {
          Alert.alert('Error', 'Failed to generate PDF for sharing.');
          return;
        }
        await sharePDFFile(generatedPath);
      } else {
        await sharePDFFile(pdfPath);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share PDF. Please try again.');
      console.error('PDF sharing error:', error);
    }
  };

  const sharePDFFile = async (filePath: string) => {
    try {
      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'application/pdf',
          dialogTitle: `Share ${reportData.kidName}'s Weekly Report`,
        });
        setIsShareModalOpen(false);
      } else {
        // Fallback to React Native Share API
        const result = await Share.share({
          url: filePath,
          title: `${reportData.kidName}'s Weekly Report`,
          message: `Check out ${reportData.kidName}'s weekly report!`,
        });

        if (result.action === Share.sharedAction) {
          setIsShareModalOpen(false);
        }
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      throw error;
    }
  };

  const handleOpenShareModal = async () => {
    // Generate PDF first if not already generated
    if (!pdfFilePath) {
      try {
        await generatePDF();
      } catch (error) {
        Alert.alert('Error', 'Failed to generate PDF for sharing.');
        return;
      }
    }
    setIsShareModalOpen(true);
  };

  const generateHTMLReport = () => {
    // Generate HTML content for PDF
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              padding: 30px 20px;
              background: #ffffff;
              color: #000000;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .header h1 {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #000000;
            }
            .header h2 {
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 10px;
              color: #000000;
            }
            .header .week {
              font-size: 14px;
              color: #666666;
              margin-top: 10px;
            }
            .week-display {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px 20px;
              background: #ffffff;
              border: 1px solid #e5e5e5;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .week-display .label {
              font-size: 16px;
              font-weight: bold;
              color: #000000;
            }
            .week-display .value {
              font-size: 14px;
              color: #666666;
            }
            .stats-container {
              display: flex;
              flex-direction: column;
              gap: 30px;
              margin-bottom: 30px;
            }
            .stats-row {
              display: flex;
              justify-content: space-around;
              gap: 20px;
            }
            .stat-item {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            .stat-icon {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 12px;
              font-size: 24px;
            }
            .stat-icon.stories {
              background: #E6E6FA;
              color: #6B5FE8;
            }
            .stat-icon.answers {
              background: #D4F4DD;
              color: #4CAF50;
            }
            .stat-icon.stars {
              background: #FFF9E6;
              color: #FFD700;
            }
            .stat-icon.badges {
              background: #E6E6FA;
              color: #9C27B0;
            }
            .stat-icon.screen-time {
              background: #E3F2FD;
              color: #2196F3;
            }
            .stat-icon.challenges {
              background: #FFF3E0;
              color: #FF9800;
            }
            .stat-value {
              font-size: 36px;
              font-weight: bold;
              margin-bottom: 8px;
              color: #000000;
            }
            .stat-label {
              font-size: 12px;
              color: #666666;
              text-align: center;
            }
            @media print {
              body {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CHILD WEEKLY REPORT</h1>
            <h2>${reportData.kidName}</h2>
          </div>
          
          <div class="week-display">
            <span class="label">WEEK</span>
            <span class="value">${weekRange}</span>
          </div>

          <div class="stats-container">
            <!-- Row 1 -->
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon stories">🏆</div>
                <div class="stat-value">${stats.storiesCompleted}</div>
                <div class="stat-label">Stories Completed</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon answers">✓</div>
                <div class="stat-value">${stats.rightAnswers}</div>
                <div class="stat-label">Right Answers</div>
              </div>
            </div>

            <!-- Row 2 -->
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon stars">⭐</div>
                <div class="stat-value">${stats.starsEarned}</div>
                <div class="stat-label">Stars Earned</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon badges">🏅</div>
                <div class="stat-value">${stats.badgesEarned}</div>
                <div class="stat-label">Badges Earned</div>
              </div>
            </div>

            <!-- Row 3 -->
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-icon screen-time">⏱</div>
                <div class="stat-value">${stats.totalScreenTime}</div>
                <div class="stat-label">Total Screen Time</div>
              </div>
              <div class="stat-item">
                <div class="stat-icon challenges">🎯</div>
                <div class="stat-value">${stats.challengesCompleted}</div>
                <div class="stat-label">Challenges Completed</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <ScrollView className='flex-1 bg-white'>
      {/* Header */}
      <View className='flex flex-row items-center justify-center px-4 py-5 bg-white'>
        <Pressable
          onPress={() => navigator.goBack()}
          className='absolute left-4'
        >
          <Icon name='ChevronLeft' size={24} />
        </Pressable>
      </View>

      {/* PDF Preview Content */}
      <View className='px-4 py-6'>
        {/* Title */}
        <Text className='text-2xl font-bold text-center mb-8'>
          CHILD WEEKLY REPORT
        </Text>

        {/* Child Info */}
        <View className='items-center mb-8'>
          <View className='mb-3'>
            <ImageWithFallback
              sourceUri={reportData.avatarUrl}
              fallbackRequire={require('../../../assets/avatars/Avatars-3.png')}
              style={{ width: 96, height: 96, borderRadius: 48 }}
              resizeMode='cover'
            />
          </View>
          <Text className='text-xl font-bold font-[abeezee]'>
            {reportData.kidName}
          </Text>
        </View>

        {/* Week Display */}
        <View className='flex flex-row justify-between items-center mb-8 px-4'>
          <Text className='text-sm font-[abeezee] font-bold'>WEEK</Text>
          <Text className='text-sm font-[abeezee] text-gray-600'>
            {weekRange}
          </Text>
        </View>

        {/* Stats Grid */}
        <View className='flex flex-col gap-y-6 mb-8'>
          {/* Row 1 */}
          <View className='flex flex-row justify-around'>
            <View className='items-center'>
              <View className='w-16 h-16 bg-[#E6E6FA] rounded-full items-center justify-center mb-3'>
                <Icon name='Trophy' size={28} color='#6B5FE8' />
              </View>
              <Text className='text-3xl font-bold'>
                {stats.storiesCompleted}
              </Text>
              <Text className='text-gray-600 font-[abeezee] text-sm text-center'>
                Stories Completed
              </Text>
            </View>
            <View className='items-center'>
              <View className='w-16 h-16 bg-[#D4F4DD] rounded-full items-center justify-center mb-3'>
                <CheckCircle size={28} color='#4CAF50' />
              </View>
              <Text className='text-3xl font-bold'>{stats.rightAnswers}</Text>
              <Text className='text-gray-600 font-[abeezee] text-sm text-center'>
                Right Answers
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View className='flex flex-row justify-around'>
            <View className='items-center'>
              <View className='w-16 h-16 bg-[#FFF9E6] rounded-full items-center justify-center mb-3'>
                <Icon name='Star' size={28} color='#FFD700' />
              </View>
              <Text className='text-3xl font-bold'>{stats.starsEarned}</Text>
              <Text className='text-gray-600 font-[abeezee] text-sm text-center'>
                Stars Earned
              </Text>
            </View>
            <View className='items-center'>
              <View className='w-16 h-16 bg-[#E6E6FA] rounded-full items-center justify-center mb-3'>
                <Icon name='Award' size={28} color='#9C27B0' />
              </View>
              <Text className='text-3xl font-bold'>{stats.badgesEarned}</Text>
              <Text className='text-gray-600 font-[abeezee] text-sm text-center'>
                Badges Earned
              </Text>
            </View>
          </View>

          {/* Row 3 */}
          <View className='flex flex-row justify-around'>
            <View className='items-center'>
              <View className='w-16 h-16 bg-[#E3F2FD] rounded-full items-center justify-center mb-3'>
                <Icon name='Clock' size={28} color='#2196F3' />
              </View>
              <Text className='text-3xl font-bold'>
                {stats.totalScreenTime}
              </Text>
              <Text className='text-gray-600 font-[abeezee] text-sm text-center'>
                Total Screen Time
              </Text>
            </View>
            <View className='items-center'>
              <View className='w-16 h-16 bg-[#FFF3E0] rounded-full items-center justify-center mb-3'>
                <Icon name='Target' size={28} color='#FF9800' />
              </View>
              <Text className='text-3xl font-bold'>
                {stats.challengesCompleted}
              </Text>
              <Text className='text-gray-600 font-[abeezee] text-sm text-center'>
                Challenges Completed
              </Text>
            </View>
          </View>
        </View>

        {/* Screen Time Distribution */}
        <View className='mt-6 mb-8'>
          <Text className='text-lg font-bold mb-6'>
            SCREEN TIME DISTRIBUTION
          </Text>

          <View className='flex flex-row items-end justify-between h-64 px-2'>
            {screenTimeData.map((data, index) => {
              const heightPercentage = (data.hours / maxHours) * 100;
              const darkHeight = (data.hours / maxHours) * 60;

              return (
                <View key={index} className='flex-1 items-center mx-1'>
                  <View className='w-full flex-1 justify-end'>
                    <View
                      className='w-full bg-[#E6E6FA] rounded-t-full overflow-hidden'
                      style={{ height: `${heightPercentage}%` }}
                    >
                      <View
                        className='w-full bg-[#6B5FE8] rounded-t-full'
                        style={{ height: `${darkHeight}%` }}
                      />
                    </View>
                  </View>
                  <Text className='text-xs text-gray-600 mt-2'>
                    {data.date}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Y-axis labels */}
          <View className='absolute right-0 top-12 flex flex-col justify-between h-64'>
            <Text className='text-xs text-gray-500'>5hrs</Text>
            <Text className='text-xs text-gray-500'>4hrs</Text>
            <Text className='text-xs text-gray-500'>3hrs</Text>
            <Text className='text-xs text-gray-500'>2hrs</Text>
            <Text className='text-xs text-gray-500'>1hr</Text>
            <Text className='text-xs text-gray-500'>0hr</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className='flex flex-col gap-4 mb-8'>
          <Pressable
            onPress={handleDownloadPDF}
            className='bg-[#FF6B4A] py-4 rounded-full mx-4'
          >
            <Text className='text-white text-center text-lg font-[abeezee] font-bold'>
              Download PDF
            </Text>
          </Pressable>

          <Pressable
            onPress={handleOpenShareModal}
            className='bg-[#6B5FE8] py-4 rounded-full mx-4 flex flex-row items-center justify-center gap-2'
          >
            <Share2 size={20} color='white' />
            <Text className='text-white text-center text-lg font-[abeezee] font-bold'>
              Share PDF
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Share Report Modal */}
      {isShareModalOpen && (
        <ShareReportModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          childName={reportData.kidName}
          reportData={reportData}
          pdfFilePath={pdfFilePath}
          onSharePDF={handleSharePDF}
        />
      )}
    </ScrollView>
  );
};

export default PDFReportPreviewScreen;
