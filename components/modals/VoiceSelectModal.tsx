import React from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  Image,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useGetVoices from "../../hooks/tanstack/queryHooks/useGetVoices";

type Voice = {
  id: string;
  label: string;
  image: ImageSourcePropType;
};

type Props = {
  visible: boolean;
  voices?: Voice[]; // external override (rare)
  initialVoiceId?: string | null;
  onClose: () => void;
  onSave: (voiceId: string, mode?: "readAlong" | "listen") => void;
  mode?: "readAlong" | "listen";
};

// local images
const localImages = [
  require("../../assets/story/milo.png"),
  require("../../assets/story/peony.png"),
  require("../../assets/story/luna.png"),
  require("../../assets/story/tiger.png"),
];

const defaultVoices: Voice[] = [
  { id: "milo", label: "Milo", image: localImages[0] },
  { id: "peony", label: "Peony", image: localImages[1] },
  { id: "luna", label: "Luna", image: localImages[2] },
  { id: "tiger", label: "Tiger", image: localImages[3] },
];

const VoiceSelectModal: React.FC<Props> = ({
  visible,
  voices = defaultVoices,
  initialVoiceId = null,
  onClose,
  onSave,
  mode
}) => {
  const [selected, setSelected] = React.useState<string | null>(initialVoiceId);

  // your hook — expected shape: data is an array or undefined
  const { error, data, refetch } = useGetVoices();

  const normalizeBackend = React.useCallback(
    (item: any, idx: number): Voice | null => {
      if (!item) return null;
      const id = String(
        item.voice_id ?? item.id ?? item.name ?? `voice-${idx}`
      );
      const label = String(item.name ?? item.label ?? id);
      const image = localImages[idx % localImages.length];
      return { id, label, image };
    },
    []
  );

  const voicesToShow = React.useMemo<Voice[]>(() => {
    const backend = Array.isArray(data) ? data : [];
    const normalized = backend
      .map((it: any, i: number) => normalizeBackend(it, i))
      .filter(Boolean) as Voice[];

    if (normalized.length > 0) {
      // append local defaults that are not present
      const missing = defaultVoices.filter(
        (d) =>
          !normalized.some(
            (n) => String(n.id).toLowerCase() === String(d.id).toLowerCase()
          )
      );
      return [...normalized, ...missing];
    }

    return Array.isArray(voices) && voices.length ? voices : defaultVoices;
  }, [data, voices, normalizeBackend]);

  React.useEffect(() => {
    setSelected(initialVoiceId ?? voicesToShow[0]?.id ?? null);
  }, [visible, initialVoiceId, voicesToShow]);
  React.useEffect(() => {
    setSelected(initialVoiceId ?? voicesToShow[0]?.id ?? null);
  }, [visible, initialVoiceId, voicesToShow]);

  const renderItem: ListRenderItem<Voice> = ({ item }) => {
    const isSelected = item.id === selected;
    return (
      <TouchableOpacity
        onPress={() => setSelected(item.id)}
        activeOpacity={1}
        className={`flex-col items-center justify-center gap-1 py-3 px-2 w-[48%]`}
        accessible
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
      >
        <View>
          <Image
            source={item.image}
            className={`w-24 h-24 rounded-full object-top ${
              isSelected ? "border-4 border-purple-600" : ""
            }`}
            style={
              isSelected
                ? { borderWidth: 4, borderColor: "#866EFF" }
                : undefined
            }
            resizeMode="cover"
          />
        </View>
        <Text className="text-lg font-[quilka] text-center">{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />

        <View className="bg-white rounded-3xl px-4 py-6 max-h-[500px] w-full max-w-[90%] mx-auto mb-6">
          <Text className="text-3xl text-center font-[quilka] mb-6">
            Select AI voice
          </Text>

          <Pressable
            className="absolute -top-8 right-1 z-20 rounded-full p-2"
            onPress={onClose}
          >
            <Image
              source={require("../../assets/story/close.png")}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </Pressable>

          {error ? (
            <View className="px-4 mb-3 flex-row items-center justify-between">
              <Text className="text-sm text-red-600">
                Couldn't load remote voices — using fallback.
              </Text>
              <Pressable onPress={() => refetch?.()}>
                <Text className="text-sm underline">Retry</Text>
              </Pressable>
            </View>
          ) : null}

          <FlatList
            data={voicesToShow}
            keyExtractor={(i) => i.id}
            className="max-h-[440px] flex-wrap gap-4"
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View className="h-4 w-4" />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
              paddingHorizontal: 8,
              alignItems: "center",
            }}
            contentContainerStyle={{ paddingBottom: 12 }}
          />

          <Pressable
            onPress={() => {
              if (selected) onSave(selected, mode);;
            }}
            className="bg-[#866EFF] p-4 flex-row gap-4 items-center justify-center border-b-4 border-[#5942CC] mx-4 mt-4 rounded-full"
          >
            <Image
              source={require("../../assets/story/forward.png")}
              className="w-8 h-8"
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default VoiceSelectModal;
