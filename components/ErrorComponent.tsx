import { Text, TouchableOpacity, View } from "react-native";

const ErrorComponent = ({
  message,
  refetch,
  goBack,
}: {
  message?: string;
  refetch?: () => void;
  goBack?: () => void;
}) => {
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-y-4 bg-bg-light px-8">
      <Text className="flex text-center font-[quilka] text-2xl text-primary">
        {message ?? "An Unexpected error occured!"}
      </Text>
      <View className="flex flex-row items-center gap-3">
        <TouchableOpacity
          onPress={refetch}
          className="w-full max-w-80 flex-1 rounded-full bg-primary py-4 text-center"
        >
          <Text className="text-center font-[abeezee] text-white">
            Try again
          </Text>
        </TouchableOpacity>
        {goBack && (
          <TouchableOpacity
            onPress={goBack}
            className="w-full max-w-80 flex-1 rounded-full border border-black bg-transparent py-4 text-center"
          >
            <Text className="text-center font-[abeezee] text-black">
              Go back
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ErrorComponent;
