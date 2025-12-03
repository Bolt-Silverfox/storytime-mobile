import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
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
import LoadingOverlay from "../../../components/LoadingOverlay";
import AgeSelectionModal from "../../../components/modals/AgeSelectionModal";
import DeleteChildModal from "../../../components/modals/DeleteChildModal";
import PageTitle from "../../../components/PageTitle";
import useDeleteKid from "../../../hooks/tanstack/mutationHooks/useDeleteKid";
import useUpdateKids from "../../../hooks/tanstack/mutationHooks/useUpdateKids";
import {
  ParentProfileNavigatorParamList,
  ParentProfileNavigatorProp,
} from "../../../Navigation/ParentProfileNavigator";
import useGetAvatars from "../../../hooks/tanstack/queryHooks/useGetAvatars";
import { SystemAvatar } from "../../../types";
import KidAvatar from "../../../components/KidAvatar";
import ChooseChildAvatarModal from "../../../components/modals/ChooseChildAvatarModal";

type EditChildProfileRouteProp = RouteProp<
  ParentProfileNavigatorParamList,
  "editChildProfile"
>;

const EditChildProfile = () => {
  const { params } = useRoute<EditChildProfileRouteProp>();
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [name, setName] = useState(params.name ?? "");
  const [age, setAge] = useState(params.ageRange ?? "");
  const [selectedAvatarId, setSelectedAvatarId] = useState<string | null>(null);
  const [chooseAvatarOpen, setChooseAvatarOpen] = useState(false);
  const [userName, setUsername] = useState(params?.userName ?? "");
  const [error, setError] = useState("");
  const [currentlyOpenModal, setCurrentlyOpenModal] = useState<
    "age" | "delete" | null
  >(null);
  const { isPending, mutate } = useUpdateKids({
    id: params.id,
    onSuccess: () =>
      navigator.reset({
        index: 1,
        routes: [{ name: "indexPage" },{ name: "manageChildProfiles" }],
      }),
  });
  const { isPending: isDeleting, mutate: deleteKid } = useDeleteKid();
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
      setError("Age is required ");
      return;
    }
    setError("");
    if (selectedAvatarId) {
      mutate({ name, ageRange: age, avatarId: selectedAvatarId });
    } else {
      mutate({ name, ageRange: age });
    }
  };

  const handleCloseModals = () => {
    setCurrentlyOpenModal(null);
  };
  return (
    <ScrollView contentContainerClassName="flex flex-col gap-y-12">
      <PageTitle title="Edit Child Profile" goBack={() => navigator.goBack()} />
      <View className="items-center ">
        <KidAvatar
          onPress={() => setChooseAvatarOpen(true)}
          size={90}
          edit={true}
          uri={selectedAvatarId ? avatarUrl : params.imageUrl}
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
          onPress={handleSubmit}
          className="bg-primary py-4 w-full max-w-96 rounded-full mx-auto"
        >
          <Text className="text-white font-[abeezee] text-center text-base">
            Save
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setCurrentlyOpenModal("delete")}
          className="bg-transparent border border-primary py-4 w-full max-w-96 rounded-full mx-auto"
        >
          <Text className="text-primary font-[abeezee] text-center text-base">
            Delete Profile
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
      {currentlyOpenModal === "delete" && (
        <DeleteChildModal
          onClose={handleCloseModals}
          handleDelete={() => deleteKid([params.id])}
          isOpen={currentlyOpenModal === "delete"}
          isDeleting={isDeleting}
          name={name}
        />
      )}
      <ChooseChildAvatarModal
        isOpen={chooseAvatarOpen}
        onClose={() => setChooseAvatarOpen(false)}
        setSelectedAvatarId={setSelectedAvatarId}
        selectedAvatarId={selectedAvatarId}
      />
      <LoadingOverlay
        visible={isPending || isDeleting}
        label="Saving changes..."
      />
    </ScrollView>
  );
};

export default EditChildProfile;
