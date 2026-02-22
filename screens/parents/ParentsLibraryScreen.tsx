import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import LibraryStories from "../../components/LibraryStories";
import RemoveStoryModal from "../../components/modals/storyModals/RemoveStoryModal";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";
import Toast from "../../components/UI/Toast";

const ParentsLibraryScreen = () => {
  const [storyFilter, setStoryFilter] = useState<LibraryFilterType>("ongoing");
  const [activeStory, setActiveStory] = useState<{
    title: string;
    id: string;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleRemoveSuccess = (title: string) => {
    setToastMsg(`"${title}" removed from library`);
    setShowToast(true);
  };

  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex-1 flex-col gap-y-8 bg-bgLight">
        <View className="flex flex-row border-b border-b-border-lighter bg-white px-4 pb-5 pt-2">
          <Text className="flex-1  font-[abeezee] text-[18px]">Library</Text>
        </View>
        <View className="mx-4 flex flex-row items-center justify-between gap-x-2">
          {libraryFilters.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setStoryFilter(filter)}
              className={`${filter === storyFilter ? "bg-blue" : "border bg-white"} flex h-10 flex-1 items-center justify-center rounded-full`}
            >
              <Text
                className={`font-[abeezee] text-base capitalize ${filter === storyFilter ? "text-white" : "text-text"}`}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>
        <LibraryStories
          setActiveStory={setActiveStory}
          storyFilter={storyFilter}
        />
        {activeStory && (
          <RemoveStoryModal
            isOpen
            onClose={() => setActiveStory(null)}
            activeStory={activeStory}
            onRemoveSuccess={handleRemoveSuccess}
          />
        )}
        <Toast
          visible={showToast}
          message={toastMsg}
          onHide={() => setShowToast(false)}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default ParentsLibraryScreen;

const libraryFilters = ["ongoing", "completed"] as const;
export type LibraryFilterType = (typeof libraryFilters)[number];
