import { ReactNode, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import defaultStyles from "../../styles";
import { ArrowRight } from "lucide-react-native";
import { RadioButton } from "../RadioButton";
import useAddFavorites from "../../hooks/tanstack/mutationHooks/useAddFavorites";
import useRemoveFromDownloads from "../../hooks/tanstack/mutationHooks/useRemoveFromDownloads";
import useRemoveFromLibrary from "../../hooks/tanstack/mutationHooks/useRemoveFromLibrary";
import useRemoveFromFavorite from "../../hooks/tanstack/mutationHooks/useRemoveFromFavorites";
import useDownloadKidStory from "../../hooks/tanstack/mutationHooks/useDownloadKidStory";

type Props = {
  kidId: string;
  isOpen: boolean;
  onClose: () => void;
  storyId: string;
  category?: string;
};

const ToddlerBookActionsModal = ({
  kidId,
  isOpen,
  onClose,
  storyId,
  category,
}: Props) => {
  const [selected, setSelected] = useState("");
  const { mutateAsync: addFavorites } = useAddFavorites();
  const { mutateAsync } = useRemoveFromLibrary(kidId, storyId);
  const { mutateAsync: removeFavorite } = useRemoveFromFavorite(kidId, storyId);
  const { mutateAsync: downloadStory } = useDownloadKidStory(kidId, storyId);
  const { mutateAsync: removeDownload } = useRemoveFromDownloads(
    kidId,
    storyId
  );

  console.log(selected, "selcted");
  const handleSubmit = () => {
    // if (selected === "addFavorite") {
    //   addFavorites({ kidId, storyId: storyId });
    // }
    // if (selected === "library") {
    //   mutateAsync();
    // }

    switch (selected) {
      case "addFavorite":
        addFavorites({ kidId, storyId: storyId });
        break; // stops execution here
      case "removeFromLibrary":
        mutateAsync();
        break;
      case "removeFromFavorite":
        removeFavorite();
        break;
      case "removeFromDownload":
        removeDownload();
        break;
      case "addToDownload":
        downloadStory();
        break;
      default:
      // console.log("Value is something else");
    }
  };
  console.log(category);
  if (category && category === "completed") {
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
                onPress={() => setSelected("addFavorite")}
                className="flex-row justify-between pb-4 "
              >
                <Text
                  style={[
                    defaultStyles.defaultText,
                    { fontSize: 16, color: "black" },
                  ]}
                >
                  Add to favourites
                </Text>
                <RadioButton
                  value="addFavorite"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>

              <Pressable
                onPress={() => setSelected("addToDownload")}
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
                  value="addToDownload"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>
            </View>

            <Pressable
              disabled={!selected}
              onPress={
                () => {
                  handleSubmit();
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
  }
  if (category && category === "creation") {
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
                onPress={() => setSelected("addFavorite")}
                className="flex-row justify-between pb-4 "
              >
                <Text
                  style={[
                    defaultStyles.defaultText,
                    { fontSize: 16, color: "black" },
                  ]}
                >
                  Add to favourites
                </Text>
                <RadioButton
                  value="addFavorite"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>

              <Pressable
                onPress={() => setSelected("addToDownload")}
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
                  value="addToDownload"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>
              <Pressable
                onPress={() => setSelected("removeFromCreation")}
                className="flex-row justify-between py-10 pb-4 border-t border-[#E0E0E0]"
              >
                <Text
                  style={[
                    defaultStyles.defaultText,
                    { fontSize: 16, color: "black" },
                  ]}
                >
                  Remove from creation
                </Text>
                <RadioButton
                  value="removeFromCreation"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>
            </View>

            <Pressable
              disabled={!selected}
              onPress={
                () => {
                  handleSubmit();
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
  }

  if (category && category === "favorite") {
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
                onPress={() => setSelected("removeFromFavorite")}
                className="flex-row justify-between pb-4 "
              >
                <Text
                  style={[
                    defaultStyles.defaultText,
                    { fontSize: 16, color: "black" },
                  ]}
                >
                  Remove from favourites
                </Text>
                <RadioButton
                  value="removeFromFavorite"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>

              <Pressable
                onPress={() => setSelected("addToDownload")}
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
                  value="addToDownload"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>
            </View>

            <Pressable
              disabled={!selected}
              onPress={
                () => {
                  handleSubmit();
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
  }

  if (category && category === "download") {
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
                onPress={() => setSelected("addFavorite")}
                className="flex-row justify-between pb-4 "
              >
                <Text
                  style={[
                    defaultStyles.defaultText,
                    { fontSize: 16, color: "black" },
                  ]}
                >
                  Add to favourites
                </Text>
                <RadioButton
                  value="addFavorite"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>
              <Pressable
                onPress={() => setSelected("removeFromDownload")}
                className="flex-row justify-between py-10 pb-4 border-t border-[#E0E0E0]"
              >
                <Text
                  style={[
                    defaultStyles.defaultText,
                    { fontSize: 16, color: "black" },
                  ]}
                >
                  Remove from download
                </Text>
                <RadioButton
                  value="removeFromDownload"
                  selected={selected}
                  onSelect={setSelected}
                />
              </Pressable>
            </View>

            <Pressable
              disabled={!selected}
              onPress={
                () => {
                  handleSubmit();
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
  }

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {}
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
              onPress={() => setSelected("addFavorite")}
              className="flex-row justify-between pb-4 "
            >
              <Text
                style={[
                  defaultStyles.defaultText,
                  { fontSize: 16, color: "black" },
                ]}
              >
                Add to favourites
              </Text>
              <RadioButton
                value="addFavorite"
                selected={selected}
                onSelect={setSelected}
              />
            </Pressable>

            <Pressable
              onPress={() => setSelected("addToDownload")}
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
                value="addToDownload"
                selected={selected}
                onSelect={setSelected}
              />
            </Pressable>
            <Pressable
              onPress={() => setSelected("removeFromLibrary")}
              className="flex-row justify-between py-10 pb-4 border-t border-[#E0E0E0]"
            >
              <Text
                style={[
                  defaultStyles.defaultText,
                  { fontSize: 16, color: "black" },
                ]}
              >
                Remove from library
              </Text>
              <RadioButton
                value="removeFromLibrary"
                selected={selected}
                onSelect={setSelected}
              />
            </Pressable>
          </View>

          <Pressable
            disabled={!selected}
            onPress={
              () => {
                handleSubmit();
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
