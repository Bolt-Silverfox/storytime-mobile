import { View, Text, Pressable, Image, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "lucide-react-native";
import colours from "../../../colours";
import defaultStyles from "../../../styles";
import TitleModal from "../../../components/TitleModal";
import { ParntControlNavigatorProp } from "../../../Navigation/parents/ParentControlsNavigator";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import PageTitle from "../../../components/PageTitle";

export default function EditChild() {
  const [childName, setChildName] = useState("");
  const [titleModal, setTitleModal] = useState(false);
  const [age, setAge] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);

  const navigator = useNavigation<ParntControlNavigatorProp>();
  const inset = useSafeAreaInsets();
  return (
    <View
      className="flex-1 bg-[#FFFCFBFB] "
      style={{ paddingTop: inset.top, paddingBottom: inset.bottom }}
    >
      <PageTitle title="Edit Child" goBack={() => navigator.goBack()} />

      <View className=" w-[95%] mx-auto gap-4">
        <Pressable
          style={{ position: "relative", width: 128 }}
          className=" items-center  mx-auto"
        >
          <Image
            source={require("../../../assets/avatars/Avatars-8.png")}
            style={{ width: 128, height: 128 }}
          />
          <Image
            source={require("../../../assets/icons/pen.png")}
            className="w-32 h-32 bg-white rounded-full "
            style={{
              position: "absolute",
              bottom: 10,
              right: 15,
              width: 25,
              height: 25,
              padding: 5,
            }}
          />
        </Pressable>
        <View className="gap-4">
          <View className="gap-2">
            <Text style={defaultStyles.label}>Child's Name</Text>
            <TextInput
              className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 border-border}`}
              placeholderTextColor={colours.text}
              placeholder="Enter Child Name"
              onChangeText={setChildName}
              value={childName}
            />
          </View>

          <View className="gap-2">
            <Text style={defaultStyles.label}>Age</Text>
            <Pressable
              className={`border rounded-full h-[50px] font-[abeezee] justify-center text-sm relative px-4 border-border`}
              onPress={() => setTitleModal(true)}
            >
              <Text>{age || "Select Age"}</Text>
            </Pressable>

            <Pressable
              style={{ position: "absolute", right: 16, top: 35 }}
              onPress={() => setTitleModal(true)}
            >
              <Image source={require("../../../assets/icons/arrow-down.png")} />
            </Pressable>
          </View>
          <TitleModal
            open={titleModal}
            setOpen={setTitleModal}
            setValue={setAge}
            options={["1-4", "5-9", "10-12"]}
          />

          <View className="gap-2">
            <View className="justify-between flex-row">
              <Text style={defaultStyles.label}>Child's Username</Text>
              <Pressable className="flex-row">
                <MaskedViewText text={"Suggest with AI"} />
                <Image
                  source={require("../../../assets/icons/sparkle.png")}
                  className="self-center "
                />
              </Pressable>
            </View>
            <TextInput
              className={`border rounded-full h-[50px] font-[abeezee] justify-center text-base text-black relative px-4 border-border}`}
              placeholderTextColor={colours.text}
              placeholder="Enter Child UserName"
              onChangeText={setChildName}
              value={childName}
            />
          </View>
        </View>
      </View>
      <View className="gap-4 flex-1 justify-center w-[95%] mx-auto">
        <Pressable
          onPress={() => navigator.navigate("manageChild")}
          style={[defaultStyles.button]}
        >
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className="text-center text-white"
          >
            Save
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setDeleteModal(true)}
          style={[
            defaultStyles.button,
            { backgroundColor: "white", borderColor: "#EC0707" },
          ]}
          className=" border-[0.5px]"
        >
          <Text
            style={[defaultStyles.defaultText, { color: "#EC0707" }]}
            className="text-center "
          >
            Delete Profile
          </Text>
        </Pressable>
      </View>
      <DeleteProfileModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
      />
    </View>
  );
}

function DeleteProfileModal({
  deleteModal,
  setDeleteModal,
}: {
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigator = useNavigation<ParntControlNavigatorProp>();

  if (!deleteModal) null;
  return (
    <Modal visible={deleteModal} transparent animationType="fade">
      <Pressable
        onPress={() => setDeleteModal(false)}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "flex-end",
        }}
      >
        <View
          className="bg-[#FFFCFBFB] py-8 gap-4 "
          style={{ borderTopRightRadius: 32, borderTopLeftRadius: 32 }}
          onStartShouldSetResponder={() => true}
        >
          <View
            className=" mx-auto "
            style={{
              width: 68,
              height: 6,
              backgroundColor: "#C5C5C5",
              borderRadius: 32,
            }}
          />
          <View className="gap-4 mb-10">
            <Text style={[defaultStyles.heading, { fontSize: 18 }]}>
              Delete child's profile
            </Text>
            <Text className="mx-auto" style={[defaultStyles.defaultText]}>
              Are you sure you want to delete this Profile?
            </Text>
          </View>

          <View className="gap-4 justify-center w-[95%] mx-auto mb-10">
            <Pressable
              style={[defaultStyles.button]}
              onPress={() => {
                setDeleteModal(false);
                navigator.navigate("deleteSuccess");
              }}
            >
              <Text
                style={[defaultStyles.defaultText, { color: "white" }]}
                className="text-center text-white"
              >
                Yes, Delete child
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setDeleteModal(false)}
              style={[
                defaultStyles.button,
                { backgroundColor: "white", borderColor: "#EC0707" },
              ]}
              className=" border-[0.5px]"
            >
              <Text
                style={[defaultStyles.defaultText, { color: "#EC0707" }]}
                className="text-center "
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const MaskedViewText = ({ text }: { text: string }) => {
  return (
    <View className=" h-[22px] w-[127px] ">
      <MaskedView
        style={{ flex: 1, flexDirection: "row", height: 27 }}
        maskElement={
          <Text
            style={[
              {
                fontSize: 14,
              },
              defaultStyles.label,
            ]}
          >
            {text}
          </Text>
        }
      >
        <LinearGradient
          colors={["#0731EC", "#D300A2"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: "100%", height: "100%" }}
        />
      </MaskedView>
    </View>
  );
};
