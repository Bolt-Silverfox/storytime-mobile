import { useNavigation } from "@react-navigation/native";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import colours from "../../colours";
import Icon from "../../components/Icon";
import LoadingOverlay from "../../components/LoadingOverlay";
import PageTitle from "../../components/PageTitle";
import AgeSelectionModal from "../../components/modals/AgeSelectionModal";
import { ageRange } from "../../data";

type KidProfileType = {
  name: string;
  ageRange: (typeof ageRange)[number];
  id: string;
};

const KidsSetupScreen = () => {
  const isProceedButtonDisabled = false;
  const navigator = useNavigation<AuthNavigatorProp>();
  const [kidsData, setKidsData] = useState<KidProfileType[]>([
    {
      ageRange: "",
      name: "",
      id: Date.now().toString(),
    },
  ]);
  const [currentlyActiveKid, setCurrentlyActiveKid] = useState<null | string>(
    null
  );
  const isLoading = false;

  const deleteKid = (id: string) => {
    const newKidsData = kidsData.filter((kid) => kid.id !== id);
    setKidsData(newKidsData);
  };

  const addKid = () => {
    setKidsData((k) => [
      ...k,
      { ageRange: "", name: "", id: Date.now().toString() },
    ]);
  };

  const updateKid = (id: string, updatedData: Partial<KidProfileType>) => {
    setKidsData((kids) =>
      kids.map((k) => (k.id === id ? { ...k, ...updatedData } : k))
    );
  };

  const submit = () => {
    const kidsWithoutId = kidsData.map(({ id, ...rest }) => rest);
    console.log("child data", kidsWithoutId);
  };

  return (
    <View className="flex flex-1  bg-bgLight ">
      <PageTitle title="Kid(s) setup" goBack={() => navigator.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="mt-8 mx-4 bg-bgLight "
        contentContainerClassName="min-h-full flex flex-col gap-y-8 max-w-screen-md mx-auto w-full "
      >
        <View className="sm:mx-auto w-full max-w-screen-sm ">
          <View className="flex  flex-col items-center gap-y-2">
            <Text className="font-[quilka] text-2xl">
              Enter Your Kids Details
            </Text>
            <Text className="font-[abeezee] text-text text-base">
              Complete setting up your kid(s) infuormation
            </Text>
          </View>
          <View className="flex flex-1 ">
            <View className="flex flex-col gap-y-4">
              {kidsData.map((k) => (
                <ChildForm
                  key={k.id}
                  updateKid={updateKid}
                  kid={k}
                  currentlyActiveKid={currentlyActiveKid}
                  setCurrentlyActiveKid={setCurrentlyActiveKid}
                  deleteKid={deleteKid}
                />
              ))}
            </View>

            <Pressable
              className="flex mt-2 flex-row gap-x-2 items-center w-fit self-end py-1 justify-center px-4 bg-white rounded-full border-black/5 border"
              onPress={addKid}
            >
              <Icon color="#292D32" size={24} name="CirclePlus" />
              <Text className=" text-black font-[abeezee] text-sm">
                Add a new child
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <View className="flex sm:mx-auto  max-w-screen-sm mx-4 mb-5 flex-row justify-center gap-x-10">
        <Pressable
          onPress={() => {}}
          className=" py-3 flex-1 rounded-full border-black border mt-4  bg-white"
        >
          <Text className="text-center text-black font-[abeezee]">Skip</Text>
        </Pressable>
        <Pressable
          onPress={() =>
            navigator.navigate("parentProfileSetup", { screen: "setPin" })
          }
          disabled={isProceedButtonDisabled}
          className={`${
            isProceedButtonDisabled ? "bg-primary/60" : "bg-primary"
          } py-3   flex-1 rounded-full mt-4 `}
        >
          <Text className="text-center text-white font-[abeezee]">
            {isLoading ? "Loading..." : "Finalize Profile"}
          </Text>
        </Pressable>
      </View>
      <LoadingOverlay visible={isLoading} />
    </View>
  );
};

export default KidsSetupScreen;

type PropTypes = {
  currentlyActiveKid: string | null;
  setCurrentlyActiveKid: Dispatch<SetStateAction<string | null>>;
  deleteKid: (id: string) => void;
  kid: KidProfileType;
  updateKid: (id: string, updatedData: Partial<KidProfileType>) => void;
};

const ChildForm = ({
  currentlyActiveKid,
  setCurrentlyActiveKid,
  deleteKid,
  kid,
  updateKid,
}: PropTypes) => {
  return (
    <View className="bg-white px-4 py-5 rounded-md flex flex-col gap-y-5">
      <View className="flex flex-row  justify-between items-center">
        <Image
          source={require("../../assets/avatars/Avatars-3.png")}
          className="size-[60px]"
        />
        <Pressable
          onPress={() => deleteKid(kid.id)}
          className="flex mt-2 flex-row gap-x-2 items-center w-fit  py-1 justify-center px-4 bg-white rounded-full border-red-300 border"
        >
          <Icon color="red" size={14} name="Trash2" />
          <Text className=" text-['red'] font-[abeezee] text-sm">Delete</Text>
        </Pressable>
      </View>
      <View className="flex flex-col gap-y-5  relative">
        <TextInput
          className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black px-4 border-border`}
          placeholder="Enter your child's name"
          onChangeText={(text) => updateKid(kid.id, { name: text })}
          value={kid.name}
        />
        <Pressable
          className="relative"
          onPress={() => setCurrentlyActiveKid(kid.id)}
        >
          <TextInput
            editable={false}
            placeholder="Select age range"
            value={kid.ageRange}
            className={`border w-full rounded-full h-[50px] font-[abeezee] justify-center text-base text-black px-4 border-border`}
            placeholderTextColor={colours.text}
          />
          <Pressable className="absolute top-4 right-4">
            {currentlyActiveKid === kid.id ? (
              <Icon name="ChevronUp" />
            ) : (
              <Icon name="ChevronDown" />
            )}
          </Pressable>
        </Pressable>
        <AgeSelectionModal
          isOpen={currentlyActiveKid === kid.id}
          onClose={() => setCurrentlyActiveKid(null)}
          handleSelectAge={(age) => updateKid(kid.id, { ageRange: age })}
        />
      </View>
    </View>
  );
};
