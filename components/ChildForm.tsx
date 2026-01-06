import { Image, Pressable, Text, TextInput, View } from "react-native";
import Icon from "./Icon";
import colours from "../colours";
import AgeSelectionModal from "./modals/AgeSelectionModal";
import { Dispatch, SetStateAction } from "react";
import { KidProfileType } from "../screens/parentProfileSetup/KidsSetupScreen";

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
          source={require("../assets/avatars/Avatars-3.png")}
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
          handleSelectAge={(age) =>
            updateKid(kid.id, { ageRange: age as KidProfileType["ageRange"] })
          }
        />
      </View>
    </View>
  );
};

export default ChildForm;
