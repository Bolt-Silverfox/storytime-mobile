import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { ProtectedRoutesNavigationProp } from "../Navigation/ProtectedNavigator";
import useAddKids from "../hooks/tanstack/mutationHooks/useAddKids";
import AgeSelectionModal from "../components/modals/AgeSelectionModal";
import LoadingOverlay from "../components/LoadingOverlay";
import ErrorMessageDisplay from "../components/ErrorMessageDisplay";
import Icon from "../components/Icon";

const AddChildScreen = () => {
  const navigator = useNavigation<ProtectedRoutesNavigationProp>();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [userName, setUsername] = useState("");
  const [error, setError] = useState("");
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState<
    "age" | "delete" | null
  >(null);
  const { isPending, mutate } = useAddKids(1, () => navigator.goBack());

  const handleSubmit = () => {
    if (!name.trim().length) {
      setError("Name is required");
      return;
    }
    if (!age.trim().length) {
      setError("Age is required");
      return;
    }
    setError("");
    mutate([{ name: name.trim(), ageRange: age }]);
  };

  const handleCloseModals = () => {
    setCurrentlyOpenModal(null);
  };

  return (
    <ScrollView contentContainerClassName="flex flex-col gap-y-12 px-2">
      <View className="flex flex-row bg-white py-5">
        <Pressable onPress={() => navigator.goBack()}>
          <Icon name="ChevronLeft" />
        </Pressable>
        <Text className="text-center flex-1  text-[18px] font-[abeezee]">
          Add Child
        </Text>
      </View>
      <View className=" ">
        <Image
          source={require("../assets/placeholder-pfp.png")}
          className="size-[80px] self-center"
        />
        <Pressable className="absolute bottom-0 right-0"></Pressable>
      </View>
      <View className="flex flex-col gap-y-5 px-5">
        {error && <ErrorMessageDisplay errorMessage={error} />}
        <View className="w-full max-w-xl mx-auto ">
          <Text className="text-base font-[abeezee]">Child's Name:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="border border-border px-4 py-3 rounded-full w-full"
          />
        </View>
        <View className="w-full max-w-xl mx-auto ">
          <Text className="text-base font-[abeezee]">Age:</Text>

          <Pressable
            onPress={() => setCurrentlyOpenModal("age")}
            className="border border-border px-4 py-3 rounded-full w-full"
          >
            <Text className="text-base text-black font-[abeezee]">
              {age || "Select age"}
            </Text>
          </Pressable>
        </View>
      </View>
      <View className="flex flex-col gap-y-6 mt-20">
        <Pressable
          disabled={isPending}
          onPress={handleSubmit}
          className="bg-primary py-4 w-full max-w-96 rounded-full mx-auto"
        >
          <Text className="text-white font-[abeezee] text-center text-base">
            Save
          </Text>
        </Pressable>
      </View>
      {currentlyOpenModal === "age" && (
        <AgeSelectionModal
          isOpen={currentlyOpenModal === "age"}
          onClose={handleCloseModals}
          selectAge={setAge}
        />
      )}
      <LoadingOverlay visible={isPending} label="Adding child..." />
    </ScrollView>
  );
};

export default AddChildScreen;
