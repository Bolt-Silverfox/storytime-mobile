import { useNavigation } from '@react-navigation/native';
import { Award, ChevronRight, Icon, Share2 } from 'lucide-react-native';
import React, { FC, use, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import colours from '../../../colours';
import CustomText from '../../../components/CustomText';
import LoadingOverlay from '../../../components/LoadingOverlay';
import useAuth from '../../../contexts/AuthContext';
import {
  Cup,
  ImportCurve,
  MedalStar,
  Notepad2,
  Star,
  TimerStart,
} from 'iconsax-react-nativejs';
import ReportScore from '../../../components/ReportScore';
import defaultStyles from '../../../styles';
import { ParntReportNavigatorProp } from '../../../Navigation/ParentsReportNavigator';
import ShareReportModal from './ShareReportModalComponent';
import useGetReport from '../../../hooks/tanstack/queryHooks/useGetReport';
import { KidReport, WeeklyReport } from '../../../types';

const ReportScreen: FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { data } = useGetReport();
  const report: WeeklyReport | undefined = data;
  const children: KidReport[] | undefined = data?.kids;

  const navigator = useNavigation<ParntReportNavigatorProp>();

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const displayOrder = [
    children?.find((k) => k.rank === 2),
    children?.find((k) => k.rank === 1),
    children?.find((k) => k.rank === 3),
  ].filter(Boolean) as KidReport[];

  if (isLoading) return <LoadingOverlay visible={isLoading} />;

  const handleDownloadPDF = () => {
    // navigator.navigate("pdfReportPreview", {
    //   childId,
    //   weekRange: getWeekDisplay(),
    // });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require('../../../assets/bg-adaptive-image.png')}
          style={styles.header}
          resizeMode='contain'
          imageStyle={{
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
          className='relative -top-[15]'
        >
          <View className='p-[16] '>
            <CustomText
              style={{
                fontFamily: 'quilka',
                fontSize: isTablet ? 32 : 24,
                textAlign: 'center',
                marginTop: 16,
                color: colours.black,
                position: 'relative',
              }}
            >
              Reports
            </CustomText>
            <View className=' relative -top-[25] flex-row gap-7 justify-end'>
              <Pressable onPress={handleDownloadPDF}>
                <ImportCurve size={24} />
              </Pressable>
              <Pressable onPress={() => setIsShareModalOpen(true)}>
                <Share2 size={24} />
              </Pressable>
            </View>
          </View>
        </ImageBackground>
        <View className='min-h-[153] border-b border-[#BDBDBD] justify-between '>
          {!children ? (
            <CustomText
              style={{
                fontSize: 18,
                color: '#6B7280',
                textAlign: 'center',
                marginTop: 30,
              }}
            >
              No Child added yet
            </CustomText>
          ) : (
            <View className='px-4'>
              <View
                // horizontal
                // showsHorizontalScrollIndicator={false}
                className='flex flex-row justify-center gap-x-4'
              >
                {displayOrder.map((child) => (
                  <Pressable
                    key={child.kidId}
                    onPress={() => setSelectedChild(child.kidId)}
                    className='items-center mb-3'
                  >
                    <View
                      className={`w-20 h-20 rounded-full overflow-hidden border-2 ${
                        selectedChild === child.kidId
                          ? 'border-primary'
                          : 'border-gray-300'
                      }`}
                    >
                      <Image
                        source={
                          child.avatarUrl
                            ? { uri: child.avatarUrl }
                            : require('../../../assets/avatars/Avatars-3.png')
                        }
                        className='w-full h-full'
                        resizeMode='cover'
                      />
                    </View>
                    <Text className='text-base font-[quilka] mt-2 font-bold'>
                      {child.kidName}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
          <View className='flex-row justify-center gap-4'>
            {!children ? (
              <>
                <View
                  style={{
                    height: 65,
                    width: 75,
                    borderRightWidth: 3,
                    borderLeftWidth: 3,
                    borderTopWidth: 3,
                  }}
                  className='border-b rounded-tr-[8] rounded-tl-[8] border-[#BDBDBD33] bg-[#BDBDBD33]'
                />
                <View
                  style={{
                    height: 65,
                    width: 75,
                    borderRightWidth: 3,
                    borderLeftWidth: 3,
                    borderTopWidth: 3,
                  }}
                  className='border-b rounded-tr-[8] rounded-tl-[8] border-[#BDBDBD33] bg-[#BDBDBD33]'
                />
                <View
                  style={{
                    height: 65,
                    width: 75,
                    borderRightWidth: 3,
                    borderLeftWidth: 3,
                    borderTopWidth: 3,
                  }}
                  className='border-b rounded-tr-[8] rounded-tl-[8] border-[#BDBDBD33] bg-[#BDBDBD33]'
                />
              </>
            ) : (
              children.slice(0, 3).map((child) => (
                <View
                  key={child.kidId}
                  style={{
                    height: 65,
                    width: 75,
                    borderRightWidth: 3,
                    borderLeftWidth: 3,
                    borderTopWidth: 3,
                  }}
                  className='border-b rounded-tr-[8] rounded-tl-[8] border-[#BDBDBD33] bg-[#BDBDBD33]'
                />
              ))
            )}
          </View>
        </View>
        <View className='mx-[16]'>
          <Text className='font-[abeezee] my-6'>OVERVIEW</Text>
          <View className='flex-row justify-center gap-[20]'>
            <ReportScore
              icon={<Cup color='#0731EC' />}
              score={report?.totalStoriesCompleted || 0}
              color='#5776FF33'
              title={'Stories Completed'}
            />
            <ReportScore
              icon={<TimerStart color='#FF8771' />}
              score={report?.totalScreenTimeMins || 0}
              color='#FB958333'
              title='Screen Time'
            />
          </View>
        </View>

        <View className='mx-[16]'>
          <Text className='font-[abeezee] my-6'>WEEKLY REPORT</Text>
          {children ? (
            <View className='flex flex-col gap-y-4'>
              {children.map((child) => (
                <Pressable
                  key={child.kidId}
                  onPress={() =>
                    navigator.navigate('reportDetails', {
                      childId: child.kidId,
                    })
                  }
                  className='flex flex-row items-center justify-between bg-white border border-gray-200 rounded-2xl py-9 px-4 shadow-sm'
                >
                  <View className='flex flex-row items-center gap-x-3 flex-1'>
                    <Image
                      source={
                        child.avatarUrl
                          ? { uri: child.avatarUrl }
                          : require('../../../assets/avatars/Avatars-3.png')
                      }
                      className='w-12 h-12 rounded-full'
                    />
                    <View className='flex-1'>
                      <Text className='text-lg font-[abeezee] font-bold mb-2'>
                        {child.kidName}
                      </Text>
                      <View className='flex flex-row gap-x-4'>
                        <View className='flex flex-row items-center gap-x-1'>
                          <Star variant='Bold' size={22} color='#FFD700' />
                          <Text className='text-sm text-gray-600 font-[abeezee]'>
                            {child.starsEarned} Stars Earned
                          </Text>
                        </View>
                        <View className='flex flex-row items-center gap-x-1'>
                          <MedalStar size={22} color='#FFD700' />
                          <Text className='text-sm text-gray-600 font-[abeezee]'>
                            {child.badgesEarned} Badges Earned
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <ChevronRight size={24} color='#999' />
                </Pressable>
              ))}
            </View>
          ) : (
            <View className='items-center'>
              <Notepad2 size={120} color='#EC400733' />
              <Text style={defaultStyles.defaultText} className='mt-3'>
                Child weekly report will appear here
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {isShareModalOpen && (
        <ShareReportModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          childName={''}
        />
      )}
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFCFBFB' },
  scrollContent: { paddingBottom: 100 },
  header: {
    width: '100%',
    height: 192,
    position: 'relative',
    overflow: 'visible',
  },
  addPhotoText: { fontSize: 10, color: '#6B7280', marginTop: 4 },
  nameContainer: { alignItems: 'center', marginTop: 56 },
});
