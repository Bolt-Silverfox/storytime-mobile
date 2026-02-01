import { Text, TouchableOpacity, View } from "react-native";
import useAuth from "../contexts/AuthContext";

const ErrorComponent = ({
  message,
  refetch,
}: {
  message?: string;
  refetch: () => void;
}) => {
  const { logout: _logout } = useAuth();
  return (
    <View className="flex flex-1 flex-col items-center justify-center gap-y-4 bg-bg-light px-8">
      <Text className="flex text-center font-[quilka] text-2xl text-primary">
        {message ?? "An Unexpected error occured!"}
      </Text>
      <TouchableOpacity
        onPress={refetch}
        className="w-full max-w-80 rounded-full bg-primary py-4 text-center"
      >
        <Text className="text-center font-[abeezee] text-white">Try again</Text>
      </TouchableOpacity>
      {/* <Button onPress={logout} title="Logout now" /> */}
    </View>
  );
};

export default ErrorComponent;
