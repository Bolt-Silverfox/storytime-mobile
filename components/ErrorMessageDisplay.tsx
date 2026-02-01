import { View, Text } from "react-native";

const ErrorMessageDisplay = ({
  errorMessage,
}: {
  errorMessage: string | string[] | undefined;
}) => {
  return (
    <View className="">
      {Array.isArray(errorMessage) && errorMessage.length ? (
        errorMessage.map((message) => (
          <Text key={message} className="text-sm text-red-600">
            {message}
          </Text>
        ))
      ) : (
        <Text className="text-sm text-red-600">{errorMessage}</Text>
      )}
    </View>
  );
};

export default ErrorMessageDisplay;
