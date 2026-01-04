import { useNavigation } from "@react-navigation/native";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";
import Icon from "../../../components/Icon";
import PageTitle from "../../../components/PageTitle";
import CustomButton from "../../../components/UI/CustomButton";
import CustomModal from "../../../components/modals/CustomModal";
import useUploadVoice from "../../../hooks/tanstack/mutationHooks/useUploadVoice";
import LoadingOverlay from "../../../components/LoadingOverlay";
import colours from "../../../colours";

const RecordVoice = () => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const navigator = useNavigation<ParentControlNavigatorProp>();
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const audioPlayer = useAudioPlayer(recordingUri);
  const [bars, setBars] = useState<number[]>(new Array(20).fill(5));
  const [recordingStatus, setRecordingStatus] = useState<
    "idle" | "recording" | "finished" | "playing"
  >("idle");
  const [elapsedTime, setElapsedTime] = useState(0);
  console.log("elapsed time", elapsedTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [saveVoiceModal, setSaveVoiceModal] = useState(false);

  const MAX_DURATION = 15000;

  useEffect(() => {
    if (recorderState.isRecording) {
      timerRef.current = setInterval(() => {
        setBars(bars.map(() => Math.floor(Math.random() * 35) + 5));
      }, 120);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setBars(new Array(20).fill(5));
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recorderState.isRecording]);

  useEffect(() => {
    if (recordingStatus === "recording") {
      const intervalId = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= 14) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    } else if (recordingStatus === "idle") {
      setElapsedTime(0);
    }
  }, [recordingStatus]);

  const startRecording = async () => {
    try {
      await audioRecorder.prepareToRecordAsync();
      setRecordingStatus("recording");
      audioRecorder.record();

      setTimeout(() => {
        if (recorderState.isRecording) stopRecording();
      }, MAX_DURATION);
    } catch (e) {
      console.log("Error starting recording:", e);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      setRecordingStatus("finished");
      if (audioRecorder.uri) {
        setRecordingUri(audioRecorder.uri);
        console.log("Saved:", audioRecorder.uri);
      }
    } catch (e) {
      console.log("Error stopping:", e);
    }
  };

  const previewRecording = async () => {
    if (!recordingUri) return;

    try {
      setRecordingStatus("playing");
      if (audioPlayer.currentTime > 0) {
        audioPlayer.seekTo(0);
      }
      await audioPlayer.play();
    } catch (e) {
      console.log("Playback error:", e);
      setRecordingStatus("finished");
    }
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Microphone permission denied");
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    })();
  }, []);

  return (
    <View className="flex-1  w-full bg-bgLight">
      <PageTitle title="Record Voice" goBack={() => navigator.goBack()} />
      <View className="pt-20 mx-5">
        {recordingStatus === "idle" && (
          <Pressable
            onPress={startRecording}
            className="flex flex-col gap-y-2 items-center"
          >
            <Image source={require("../../../assets/start-recording.png")} />
            <Text className="text-xl italic font-[abeezee] w-full text-center">
              Tap to start
            </Text>
          </Pressable>
        )}

        {recordingStatus === "recording" && (
          <View className="flex flex-col gap-y-2 items-center">
            <Image
              source={require("../../../assets/recording-in-progress.png")}
            />
            <Text className="text-xl italic w-full text-center font-[abeezee]">
              Recording in progress
            </Text>
          </View>
        )}

        {(recordingStatus === "finished" || recordingStatus === "playing") && (
          <View className="flex flex-col gap-y-2 items-center ">
            <Image
              source={require("../../../assets/recording-in-progress.png")}
            />
            <Text className="text-xl italic font-[abeezee] w-full text-center">
              Recording has stopped
            </Text>
          </View>
        )}
        <View className="flex flex-row max-w-screen-md mx-auto w-full justify-between mt-[74px]">
          <Icon size={40} name="CircleStop" onPress={stopRecording} />
          <Icon size={40} name={"CirclePause"} onPress={stopRecording} />
          <Icon size={40} name="Repeat" onPress={startRecording} />
        </View>
      </View>

      {recorderState.isRecording && (
        <View className="mt-6 items-center">
          <Text>
            {elapsedTime}s / {MAX_DURATION / 1000}s
          </Text>

          <View className="flex-row items-end mt-4">
            {bars.map((height, index) => (
              <View
                key={index}
                style={{
                  width: 6,
                  height,
                  backgroundColor: "red",
                  marginHorizontal: 2,
                  borderRadius: 4,
                }}
              />
            ))}
          </View>
        </View>
      )}

      <View className="mt-6 flex flex-col gap-y-3">
        <CustomButton
          disabled={recorderState.isRecording || !recordingUri}
          text="Save"
          onPress={() => setSaveVoiceModal(true)}
        />
        <Pressable
          onPress={previewRecording}
          disabled={recorderState.isRecording || !recordingUri}
          className="bg-inherit self-center  border border-black mx-5 max-w-sm w-full py-4 rounded-full mt-4 sm:mx-auto"
        >
          <Text className="text-center text-black font-[abeezee]">
            {recordingStatus === "playing" ? "Playing..." : "Preview"}
          </Text>
        </Pressable>
      </View>
      {saveVoiceModal && (
        <CustomModal
          onClose={() => setSaveVoiceModal(false)}
          isOpen={saveVoiceModal}
        >
          <AddVoiceForm recordingUrl={audioRecorder.uri!} />
        </CustomModal>
      )}
    </View>
  );
};

export default RecordVoice;

const AddVoiceForm = ({ recordingUrl }: { recordingUrl: string }) => {
  const [recordingName, setRecordingName] = useState("");
  const { mutate, isPending } = useUploadVoice();

  const onSubmit = () => {
    if (!recordingName.trim().length) {
      Alert.alert("Enter a valid recording name");
      return;
    }
    mutate({
      name: recordingName,
      file: recordingUrl,
    });
  };
  return (
    <View className="flex flex-col gap-y-3 px-5">
      <Text className="text-center font-[quilka] text-2xl mb-10">
        Save recording
      </Text>
      <View className="flex flex-col gap-y-2">
        <Text className="font-[abeezee] text-base">Save as:</Text>
        <TextInput
          className="rounded-full h-[40px] border border-primary px-5"
          value={recordingName}
          onChangeText={setRecordingName}
          placeholderTextColor={colours.text}
          placeholderClassName="font-[abeezee]"
          placeholder="Recording 1"
        />
      </View>
      <CustomButton
        disabled={isPending}
        text="Save Recording"
        onPress={onSubmit}
      />
      <LoadingOverlay visible={isPending} />
    </View>
  );
};
