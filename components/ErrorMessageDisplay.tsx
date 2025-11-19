import { StyleSheet, View, Text } from "react-native";

const ErrorMessageDisplay = ({
  errorMessage,
}: {
  errorMessage: string | string[] | undefined;
}) => {
  return (
    <View>
      {Array.isArray(errorMessage) && errorMessage.length ? (
        errorMessage.map((message) => (
          <Text key={message} className="text-red-600 text-sm">
            {message}
          </Text>
        ))
      ) : (
        <Text className="text-red-600 text-sm">{errorMessage}</Text>
      )}
    </View>
  );
};

export default ErrorMessageDisplay;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
