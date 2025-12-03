import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import ErrorMessageDisplay from "../../../components/ErrorMessageDisplay";
import Icon from "../../../components/Icon";
import AgeSelectionModal from "../../../components/modals/AgeSelectionModal";
import useAddKids from "../../../hooks/tanstack/mutationHooks/useAddKids";
import {
  ParentProfileNavigatorParamList,
  ParentProfileNavigatorProp,
} from "../../../Navigation/ParentProfileNavigator";
import LoadingOverlay from "../../../components/LoadingOverlay";
import KidAvatar from "../../../components/KidAvatar";
import { ChevronDown } from "lucide-react-native";
import useGetAvatars from "../../../hooks/tanstack/queryHooks/useGetAvatars";
import { SystemAvatar } from "../../../types";
import ChooseChildAvatarModal from "../../../components/modals/ChooseChildAvatarModal";

type RouteProps = RouteProp<ParentProfileNavigatorParamList, "addChild">;

const AddChildScreen = () => {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const { params } = useRoute<RouteProps>();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [userName, setUsername] = useState("");
  const [error, setError] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [chooseAvatarOpen, setChooseAvatarOpen] = useState(false);
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState<
    "age" | "delete" | null
  >(null);
  const { isPending, mutate } = useAddKids(1, () =>
    navigator.reset({
      index: 1,
      routes: [
        { name: "indexPage" },
        { name: "manageChildProfiles" },
      ],
    })
  );
  const { data } = useGetAvatars();
  const avatars = data?.data;
  const avatarUrl = avatars?.find(
    (avatar: SystemAvatar) => avatar.id === selectedAvatarId
  )?.url;

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
    mutate([
      {
        name,
        ageRange: age,
        avatarId: selectedAvatarId ?? "cmiinivni0004qlto05vvzicv",
      },
    ]);
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
      <View className=" justify-center items-center">
        <KidAvatar
          onPress={() => setChooseAvatarOpen(true)}
          size={90}
          edit={true}
          uri={avatarUrl}
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
            placeholder="Enter child's name"
            className="border placeholder:text-black border-border px-4 py-3 rounded-full w-full"
          />
        </View>
        <View className="w-full max-w-xl mx-auto ">
          <Text className="text-base font-[abeezee]">Age:</Text>

          <Pressable
            onPress={() => setCurrentlyOpenModal("age")}
            className="border border-border flex-row justify-between px-4 py-3 rounded-full w-full"
          >
            <Text className="text-base text-black font-[abeezee]">
              {age || "Select child's age range"}
            </Text>
            <ChevronDown className="self-center" />
          </Pressable>
        </View>
        {/* <View className="w-full max-w-xl mx-auto ">
          <Text className="text-base font-[abeezee]">Child's Username:</Text>
          <TextInput
            value={userName}
            onChangeText={setUsername}
            className="border border-border px-4 py-3 rounded-full w-full"
          />
        </View> */}
      </View>
      <View className="flex flex-col gap-y-6 mt-20">
        <Pressable
          disabled={isPending}
          onPress={handleSubmit}
          className="bg-primary py-3 w-full max-w-96 rounded-full mx-auto"
        >
          <Text className="text-white font-[abeezee] text-center text-base">
            Save
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigator.goBack()}
          className="border-[black] border py-3 w-full max-w-96 rounded-full mx-auto"
        >
          <Text className="text-[black] font-[abeezee] text-center text-base">
            Cancel
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
      <ChooseChildAvatarModal
        isOpen={chooseAvatarOpen}
        onClose={() => setChooseAvatarOpen(false)}
        setSelectedAvatarId={setSelectedAvatarId}
        selectedAvatarId={selectedAvatarId}
      />
      <LoadingOverlay visible={isPending} label="Adding child..." />
    </ScrollView>
  );
};

export default AddChildScreen;
