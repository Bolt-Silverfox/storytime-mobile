import { Text, View } from "react-native";

type GuestQuotaBannerProps = {
  remaining: number;
};

const GuestQuotaBanner = ({ remaining }: GuestQuotaBannerProps) => {
  if (remaining > 3) return null;

  const isLast = remaining === 1;

  return (
    <View className="py-2">
      <Text
        className={`text-center font-[abeezee] text-xs ${
          isLast ? "text-red-500" : "text-text"
        }`}
      >
        {isLast ? "Last free story!" : `${remaining} free stories remaining`}
      </Text>
    </View>
  );
};

export default GuestQuotaBanner;
