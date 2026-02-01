import { Dispatch, SetStateAction } from "react";
import { FlatList, Pressable, Text } from "react-native";
import CustomModal from "./CustomModal";

type PropTypes = {
  isOpen: boolean;
  onClose: () => void;
  setLanguage: Dispatch<
    SetStateAction<{ name: string; code: string } | undefined>
  >;
};

const availableLanguages = [
  {
    name: "english",
    code: "en",
  },
  {
    name: "spanish",
    code: "es",
  },
  {
    name: "italian",
    code: "it",
  },
  {
    name: "german",
    code: "de",
  },
  {
    name: "french",
    code: "fr",
  },
];

const LanguageSelectionModal = ({
  isOpen,
  onClose,
  setLanguage,
}: PropTypes) => {
  const selectLanguage = (language: { name: string; code: string }) => {
    onClose();
    setLanguage(language);
  };
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <FlatList
        data={availableLanguages}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => selectLanguage(item)}
            key={item.code}
            className="px-3 py-4"
          >
            <Text className="font-[abeezee] capitalize">{item.name}</Text>
          </Pressable>
        )}
      />
    </CustomModal>
  );
};

export default LanguageSelectionModal;
