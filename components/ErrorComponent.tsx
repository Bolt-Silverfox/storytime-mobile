import { Text, TouchableOpacity, View } from "react-native";
import useAuth from "../contexts/AuthContext";

const ErrorComponent = ({
  message,
  refetch,
}: {
  message?: string;
  refetch: () => void;
}) => {
  const { logout } = useAuth();
  return (
    <View className="flex-1 flex justify-center items-center flex-col bg-bg-light gap-y-4 px-8">
      <Text className="flex font-[quilka] text-center text-2xl text-primary">
        {message ?? "An Unexpected error occured!"}
      </Text>
      <TouchableOpacity
        onPress={refetch}
        className="bg-primary py-4 w-full max-w-80 text-center rounded-full"
      >
        <Text className="text-white text-center font-[abeezee]">Try again</Text>
      </TouchableOpacity>
      {/* <Button onPress={logout} title="Logout now" /> */}
    </View>
  );
};

export default ErrorComponent;
