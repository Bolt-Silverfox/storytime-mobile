import { Text, TouchableOpacity, View } from "react-native";

/**
 * `message` is rendered verbatim. Callers own what reaches it: app-authored
 * copy is passed through as written, while an unknown SERVER string must be
 * run through `getUserFacingError` at the call site (where the ApiError — and
 * so its status code — is still available). Sanitising here instead would also
 * rewrite our own hardcoded copy into generic text.
 */
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
        {message?.trim() || "An unexpected error occurred!"}
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
