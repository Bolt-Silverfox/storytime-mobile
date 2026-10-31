import { Pressable, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import type { ThemePreference } from "../theme/themeStorage";

const OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "Light" },
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
];

const ThemePreferenceRow = () => {
  const { preference, setPreference } = useTheme();
  return (
    <View className="mx-auto mt-5 w-[90%] max-w-screen-md rounded-3xl border border-line-soft bg-surface p-4 lg:max-w-screen-lg xl:max-w-screen-xl">
      <Text className="mb-3 font-[abeezee] text-base text-fg">Appearance</Text>
      <View
        accessibilityRole="radiogroup"
        className="flex-row gap-x-2"
        aria-label="Theme"
      >
        {OPTIONS.map(({ value, label }) => {
          const selected = preference === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setPreference(value)}
              className={`h-10 flex-1 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary" : "border-line bg-surface"}`}
            >
              <Text
                className={`font-[abeezee] text-sm ${selected ? "text-white" : "text-fg"}`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default ThemePreferenceRow;
