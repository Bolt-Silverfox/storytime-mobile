import { Text, TouchableOpacity, View } from "react-native";

const ErrorComponent = ({
  message,
  refetch,
}: {
  message?: string;
  refetch: () => void;
}) => {
  return (
    <View className="bg-bg-light my-4 flex w-full flex-col items-center justify-center gap-y-4 rounded-2xl px-6 py-10">
      <Text className="text-primary text-center font-[quilka] text-lg">
        {message ?? "An unexpected error occurred!"}
      </Text>
      <TouchableOpacity
        onPress={refetch}
        className="bg-primary w-full max-w-[200px] flex-row items-center justify-center rounded-full py-3"
      >
        <Text className="text-center font-[abeezee] text-base text-white">
          Try again
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorComponent;
