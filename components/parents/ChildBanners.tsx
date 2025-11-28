import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
  GestureResponderEvent,
} from "react-native";
import { CheckIcon} from "lucide-react-native";
import { Dimensions } from "react-native";

type Kid = {
  id: number | string;
  name: string;
  registered?: boolean;
  subtitle?: string;
  activityDates?: string[];
};

type Props = {
  kids: Kid[];
  onPressChild?: (kid: Kid, e?: GestureResponderEvent) => void;
};

const COLORS = ["#5720E3", "#EC4007", "#2E7D32"];
const SCREEN_WIDTH = Dimensions.get("window").width;

const todayISO = (d = new Date()) => {
  const t = new Date(d);
  t.setHours(0, 0, 0, 0);
  return t.toISOString().split("T")[0];
};

// helper: return ISO date for this week's weekday label (Sun..Sat)
const weekdayLabelToThisWeekISO = (label: string) => {
  const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const idx = labels.indexOf(label);
  if (idx === -1) return undefined;
  const today = new Date();
  const todayIdx = today.getDay();
  const diff = idx - todayIdx;
  const target = new Date();
  target.setDate(today.getDate() + diff);
  target.setHours(0, 0, 0, 0);
  return target.toISOString().split("T")[0];
};

// Week labels in order
const WEEK_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Check = () => (
  <View
    className="items-center justify-center rounded-full"
    style={{ backgroundColor: "#16A34A", width: 20, height: 20 }}
  >
    <CheckIcon size={12} color="#fff" strokeWidth={3} />
  </View>
);

const ChildBanners: React.FC<Props> = ({ kids = [], onPressChild }) => {
  const isSingle = kids.length === 1;

  const today = todayISO();

  const renderDayPill = (label: string) => {
    const iso = weekdayLabelToThisWeekISO(label);
    if (!iso) return null;

    // mark as checked only if the day is strictly before today
    const isPast = new Date(iso) < new Date(today);

    if (isPast) {
      return (
        <View
          key={label}
          className="flex-row items-center rounded-full px-3 py-1.5 mr-2 bg-white"
        >
          <Text className="text-sm mr-2">{label}</Text>
          <Check />
        </View>
      );
    }

    // not past (today or future) => upcoming style (no check)
    return (
      <View
        key={label}
        className="flex-row items-center rounded-full px-4 py-1.5 mr-2 bg-white/20 border border-white/30"
      >
        <Text className="text-white">{label}</Text>
      </View>
    );
  };

  const renderItem: ListRenderItem<Kid> = ({ item: kid, index }) => {
    const bg = COLORS[index % COLORS.length];

    return (
      <TouchableOpacity
        onPress={(e) => onPressChild?.(kid, e)}
        activeOpacity={0.85}
        className="rounded-2xl py-6"
        style={{
          backgroundColor: bg,
          width: isSingle ? SCREEN_WIDTH - 32 : 300,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        <Text className="text-white text-lg font-['quilka'] mb-4 text-center px-4">
          Daily Challenge for {kid.name}
        </Text>
        <Text className="text-white text-lg font-['abeezee'] mb-6 text-center px-4">
          {kid.subtitle ??
            "Complete your daily challenge to win amazing prizes today"}
        </Text>

        {/* Render full week, Sun -> Sat */}
        <View className="flex-row flex-wrap gap-x-2 gap-y-4 justify-center items-center">
          {WEEK_LABELS.map((lab) => (
            <View key={lab}>{renderDayPill(lab)}</View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      horizontal
      nestedScrollEnabled
      data={kids}
      keyExtractor={(k) => String(k.id)}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
    />
  );
};

export default ChildBanners;
