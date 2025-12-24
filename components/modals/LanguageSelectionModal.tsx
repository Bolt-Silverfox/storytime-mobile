import { Dispatch, SetStateAction } from "react";
import { FlatList, Pressable, Text } from "react-native";
import CustomModal from "./CustomModal";

type PropTypes = {
  isOpen: boolean;
  onClose: () => void;
  setLanguage: Dispatch<SetStateAction<string>>;
};

const availableLanguages = [
  "english",
  "spanish",
  "italian",
  "igbo",
  "hausa",
  "yoruba",
];

const LanguageSelectionModal = ({
  isOpen,
  onClose,
  setLanguage,
}: PropTypes) => {
  const selectCountry = (country: string) => {
    onClose();
    setLanguage(country);
  };
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <FlatList
        data={availableLanguages}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => selectCountry(item)}
            key={item}
            className="py-4 px-3"
          >
            <Text className="font-[abeezee] capitalize">{item}</Text>
          </Pressable>
        )}
      />
    </CustomModal>
  );
};

export default LanguageSelectionModal;
