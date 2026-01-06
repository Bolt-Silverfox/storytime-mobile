import { Facebook } from 'iconsax-react-nativejs';
import {
  Linkedin,
  MessageCircle,
  MessageSquare,
  Send,
  Twitter,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  View,
  Share,
  Platform,
  Alert,
} from 'react-native';

import { KidStats } from '../../../hooks/tanstack/queryHooks/useGetReportByKidId';

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  childName: string;
  reportData?: KidStats;
  weekRange?: string;
  pdfFilePath?: string | null;
  onSharePDF?: (filePath?: string) => Promise<void>;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  action: () => void;
}

const ShareReportModal = ({
  isOpen,
  onClose,
  childName,
  reportData,
  weekRange,
  pdfFilePath,
  onSharePDF,
}: ShareReportModalProps) => {
  const formatScreenTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const generateShareMessage = () => {
    if (!reportData) {
      return `Check out ${childName}'s achievements! 🌟\n\nShared from Parent App`;
    }

    const screenTime = formatScreenTime(reportData.screenTimeMins);
    const accuracy =
      reportData.totalAnswers > 0
        ? Math.round((reportData.rightAnswers / reportData.totalAnswers) * 100)
        : 0;

    return `Check out ${childName}'s achievements! 🌟\n\n📊 Weekly Report Summary${weekRange ? ` (${weekRange})` : ''}:\n\n✨ Stories Completed: ${reportData.storiesCompleted}\n✅ Right Answers: ${reportData.rightAnswers}${reportData.totalAnswers > 0 ? ` (${accuracy}% accuracy)` : ''}\n⭐ Stars Earned: ${reportData.starsEarned}\n🏆 Badges Earned: ${reportData.badgesEarned}\n⏱️ Screen Time: ${screenTime}\n❤️ Favorites: ${reportData.favoritesCount || 0}\n\nShared from Storytime App`;
  };

  const handleNativeShare = async (platform?: string) => {
    try {
      // If PDF file is available, share the PDF; otherwise share message
      if (pdfFilePath && onSharePDF) {
        await onSharePDF(pdfFilePath);
        onClose();
      } else {
        const message = generateShareMessage();
        const title = weekRange
          ? `${childName}'s Report - ${weekRange}`
          : `${childName}'s Report`;
        const result = await Share.share({
          message: message,
          title: title,
          ...(pdfFilePath && {
            url: Platform.OS === 'ios' ? pdfFilePath : `file://${pdfFilePath}`,
          }),
        });

        if (result.action === Share.sharedAction) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share. Please try again.');
    }
  };

  const handleWhatsAppShare = () => {
    // In a real app, you'd use Linking.openURL with WhatsApp deep link
    // For now, using native share
    handleNativeShare('whatsapp');
  };

  const handleFacebookShare = () => {
    // In a real app, you'd integrate Facebook SDK
    handleNativeShare('facebook');
  };

  const handleTwitterShare = () => {
    // In a real app, you'd use Twitter deep link or SDK
    handleNativeShare('twitter');
  };

  const handleTelegramShare = () => {
    // In a real app, you'd use Telegram deep link
    handleNativeShare('telegram');
  };

  const handleLinkedInShare = () => {
    // In a real app, you'd use LinkedIn deep link or SDK
    handleNativeShare('linkedin');
  };

  const handleDiscordShare = () => {
    // In a real app, you'd use Discord deep link
    handleNativeShare('discord');
  };

  const socialPlatforms: SocialPlatform[][] = [
    [
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'MessageCircle',
        color: '#25D366',
        action: handleWhatsAppShare,
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'Facebook',
        color: '#1877F2',
        action: handleFacebookShare,
      },
      {
        id: 'twitter',
        name: 'Twitter',
        icon: 'Twitter',
        color: '#000000',
        action: handleTwitterShare,
      },
    ],
    [
      {
        id: 'telegram',
        name: 'Telegram',
        icon: 'Send',
        color: '#0088cc',
        action: handleTelegramShare,
      },
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'Linkedin',
        color: '#0077B5',
        action: handleLinkedInShare,
      },
      {
        id: 'discord',
        name: 'Discord',
        icon: 'MessageSquare',
        color: '#5865F2',
        action: handleDiscordShare,
      },
    ],
  ];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <Pressable className='flex-1 justify-end bg-black/50' onPress={onClose}>
        <Pressable
          className='bg-white rounded-t-3xl px-6 py-8'
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <View className='w-12 h-1 bg-gray-300 rounded-full self-center mb-6' />

          {/* Title */}
          <Text className='text-2xl font-bold text-center mb-3'>
            Share Report
          </Text>
          <Text className='text-center text-gray-600 mb-8 px-4'>
            Share your child's achievements with family and friends.
          </Text>

          {/* Social Media Icons - Row 1 */}
          <View className='flex flex-row justify-around mb-8 px-4'>
            {socialPlatforms[0].map((platform) => (
              <Pressable
                key={platform.id}
                onPress={platform.action}
                className='items-center'
              >
                <View
                  className='w-16 h-16 rounded-full items-center justify-center mb-2'
                  style={{ backgroundColor: `${platform.color}15` }}
                >
                  {platform.id === 'whatsapp' && (
                    <View className='w-12 h-12 bg-[#25D366] rounded-full items-center justify-center'>
                      <MessageCircle size={24} color='white' />
                    </View>
                  )}
                  {platform.id === 'facebook' && (
                    <View className='w-12 h-12 bg-[#1877F2] rounded-full items-center justify-center'>
                      <Facebook size={24} color='white' />
                    </View>
                  )}
                  {platform.id === 'twitter' && (
                    <View className='w-12 h-12 bg-black rounded-full items-center justify-center'>
                      <Twitter size={24} color='white' />
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Social Media Icons - Row 2 */}
          <View className='flex flex-row justify-around mb-8 px-4'>
            {socialPlatforms[1].map((platform) => (
              <Pressable
                key={platform.id}
                onPress={platform.action}
                className='items-center'
              >
                <View
                  className='w-16 h-16 rounded-full items-center justify-center mb-2'
                  style={{ backgroundColor: `${platform.color}15` }}
                >
                  {platform.id === 'telegram' && (
                    <View className='w-12 h-12 bg-[#0088cc] rounded-full items-center justify-center'>
                      <Send size={24} color='white' />
                    </View>
                  )}
                  {platform.id === 'linkedin' && (
                    <View className='w-12 h-12 bg-[#0077B5] rounded-full items-center justify-center'>
                      <Linkedin size={24} color='white' />
                    </View>
                  )}
                  {platform.id === 'discord' && (
                    <View className='w-12 h-12 bg-[#5865F2] rounded-full items-center justify-center'>
                      <MessageSquare size={24} color='white' />
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Cancel Button */}
          <Pressable
            onPress={onClose}
            className='py-4 rounded-full border-2 border-gray-300 mt-4'
          >
            <Text className='text-black text-center text-base font-[abeezee]'>
              Cancel
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ShareReportModal;
