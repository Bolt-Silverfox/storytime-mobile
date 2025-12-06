import { ReactNode, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import defaultStyles from "../../styles";
import { ArrowRight } from "lucide-react-native";
import { RadioButton } from "../RadioButton";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ToddlerBookActionsModal = ({ isOpen, onClose }: Props) => {
  const [selected, setSelected] = useState("");

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/40 px-4 justify-end pb-20  "
      >
        <View
          onStartShouldSetResponder={() => true}
          className="bg-white rounded-[40]  px-6 pb-8     w-full"
        >
          <Text
            style={[defaultStyles.heading, { fontSize: 24, color: "black" }]}
            className="my-8"
          >
            What do you want to do?
          </Text>
          <View className="mx-auto  w-full py-4 ">
            <Pressable
              onPress={() => setSelected('favourites')}
              className="flex-row justify-between pb-4 ">
              <Text
                style={[
                  defaultStyles.defaultText,
                  { fontSize: 16, color: "black" },
                ]}
              >
                Add to favourites
              </Text>
              <RadioButton
                value="favourites"
                selected={selected}
                onSelect={setSelected}
              />
            </Pressable>

            <Pressable
              onPress={() => setSelected('downloads')}
              className="flex-row justify-between py-10 pb-4 border-t border-[#E0E0E0]"
            >
              <Text
                style={[
                  defaultStyles.defaultText,
                  { fontSize: 16, color: "black" },
                ]}
              >
                Download
              </Text>
              <RadioButton
                value="downloads"
                selected={selected}
                onSelect={setSelected}
              />
            </Pressable>
            <Pressable
              onPress={() => setSelected('library')}
              className="flex-row justify-between py-10 pb-4 border-t border-[#E0E0E0]">
              <Text
                style={[
                  defaultStyles.defaultText,
                  { fontSize: 16, color: "black" },
                ]}
              >
                Remove from library
              </Text>
              <RadioButton
                value="library"
                selected={selected}
                onSelect={setSelected}
              />
            </Pressable>
          </View>

          <Pressable
            disabled={!selected}
            onPress={
              () => {
                onClose();
              }
              // libNav.navigate("allStories", { childId: params.childId! })
            }
            className={`bg-[#866EFF] border-b-[5px] border-[#5942CC]  py-[18] px-[10] rounded-[60] flex-row items-center justify-center ${selected ? "bg-[#866EFF] border-[#5942CC]" : "bg-[#866EFF]/20 border-[#5942CC]/20"}`}
          >
            <Text
              style={[defaultStyles.heading, { fontSize: 32, color: "#fff" }]}
            >
              Continue
            </Text>
            <ArrowRight
              className="self-center"
              color={"white"}
              size={40}
              strokeWidth={4}
            />
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ToddlerBookActionsModal;
