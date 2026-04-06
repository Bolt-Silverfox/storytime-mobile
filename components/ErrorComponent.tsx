import { Text, TouchableOpacity, View } from "react-native";
import useAuth from "../contexts/AuthContext";

const ErrorComponent = ({
  message,
  refetch,
}: {
  message?: string;
  refetch: () => void;
}) => {
  return (
    <View className="my-4 flex w-full flex-col items-center justify-center gap-y-4 rounded-2xl bg-bg-light px-6 py-10">
      <Text className="text-center font-[quilka] text-lg text-primary">
        {message ?? "An unexpected error occurred!"}
      </Text>
      <TouchableOpacity
        onPress={refetch}
        className="w-full max-w-[200px] flex-row items-center justify-center rounded-full bg-primary py-3"
      >
        <Text className="text-center font-[abeezee] text-base text-white">
          Try again
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorComponent;
