import React, { useEffect, useState } from "react";
import { Modal, View, Text, Pressable, Animated, Image } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPrimaryPress?: () => void;
  title?: string;
  subtitle?: string;
  message?: string;
};

const StoryCompletionModal: React.FC<Props> = ({
  visible,
  onClose,
  title = "Yayyyy!!!!!!!",
  subtitle = "You did it !",
  message = "You’ve completed your first story!",
  onPrimaryPress,
}) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.8)).current;
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setShowButton(false); // reset
      const t = setTimeout(() => {
        setShowButton(true);
      }, 1000); // 1 second
      return () => clearTimeout(t);
    } else {
      setShowButton(false);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        className="absolute inset-0 bg-black/60"
        android_ripple={{ color: "rgba(255,255,255,0.06)" }}
      />

      {/* Modal */}
      <View className="flex-1 items-center justify-center px-2">
        <Animated.View
          style={[
            {
              transform: [{ scale }],
            },
          ]}
          className="relative w-full max-w-sm mx-8 bg-[#9F50E5] rounded-[32px] p-6 py-10 border-8 border-[#7130AB]"
        >
          {/* --- STAR RATING ROW (IMAGES) --- */}
          <View className="flex-row justify-center items-center mb-4 absolute -top-3/4">
            <Image
              source={require("../../assets/story/star-empty.png")}
              className="mb-8"
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/story/star-filled-large.png")}
              className="mb-12"
              resizeMode="contain"
            />
            <Image
              source={require("../../assets/story/star-filled-small.png")}
              className="mb-8"
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text className="text-white text-2xl text-center font-[quilka]">
            {title}
          </Text>
          {/* Subtitle */}
          <Text className="text-white text-lg font-[quilka] text-center mt-2">
            {subtitle}
          </Text>

          {/* Message */}
          <Text className="text-white text-lg text-center mt-2 opacity-90 font-[quilka]">
            {message}
          </Text>

          <View className="w-[90%]  mx-auto flex-row items-center mt-8">
            {/* outer purple bar */}
            <View className="flex-1 h-5 bg-purple-600 rounded-full overflow-x-hidden">
              {/* inner yellow bar */}
              <View className="relative h-full w-5/5 bg-yellow-400 rounded-full">
                {/* pause icon */}
                <View className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-20">
                  <Image
                    source={require("../../assets/story/pause.png")}
                    className="w-12 h-12"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Button that appears after 1 second */}
      {showButton && (
        <Pressable
          onPress={() => {
            if (onPrimaryPress) onPrimaryPress();
            else onClose();
          }}
          className="bg-[#866EFF] mb-24 p-4 flex-row gap-4 items-center justify-center border-b-4 border-[#5942CC] mx-4 mt-4 rounded-full"
        >
          <Image
            source={require("../../assets/story/forward.png")}
            className="w-8 h-8"
            resizeMode="contain"
          />
        </Pressable>
      )}
    </Modal>
  );
};

export default StoryCompletionModal;
