// import { useRef, useState } from "react";
// import { Audio, AVPlaybackStatus } from "expo-av";
// import { Alert } from "react-native";

// export const useAudioPlayer = () => {
//   const soundRef = useRef<Audio.Sound | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const play = async (url: string) => {
//     try {
//       setIsLoading(true);
//       if (soundRef.current) {
//         await soundRef.current.stopAsync().catch(() => {});
//         await soundRef.current.unloadAsync();
//       }

//       const { sound } = await Audio.Sound.createAsync(
//         { uri: url },
//         { shouldPlay: true }
//       );

//       soundRef.current = sound;

//       sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
//         if (status.isLoaded && status.didJustFinish) {
//           sound.unloadAsync();
//           soundRef.current = null;
//         }
//       });
//     } catch (err) {
//       Alert.alert("Error playing audio, try again");
//       console.error("Audio play error:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const stop = async () => {
//     if (soundRef.current) {
//       await soundRef.current.stopAsync();
//       await soundRef.current.unloadAsync();
//       soundRef.current = null;
//     }
//   };

//   return { play, stop, isLoading };
// };
