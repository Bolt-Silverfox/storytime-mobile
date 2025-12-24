import { Dispatch, SetStateAction } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import useGetCountries from "../../hooks/tanstack/queryHooks/useGetCountries";
import CustomModal from "./CustomModal";
import CustomButton from "../UI/CustomButton";

type PropTypes = {
  isOpen: boolean;
  onClose: () => void;
  setCountry: Dispatch<SetStateAction<string>>;
};

const CountriesSelectionModal = ({
  isOpen,
  onClose,
  setCountry,
}: PropTypes) => {
  const { isPending, error, data, refetch } = useGetCountries();

  const selectCountry = (country: string) => {
    onClose();
    setCountry(country);
  };
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {isPending ? (
        <Text className="font-abeezee text-2xl text-center">Loading...</Text>
      ) : data ? (
        <FlatList
          data={data}
          keyExtractor={({ name }) => name.common}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => selectCountry(item.name.common)}
              key={item.name.common}
              className="py-4 px-3"
            >
              <Text>{item.name.common}</Text>
            </Pressable>
          )}
        />
      ) : (
        <View className="flex flex-col gap-y-3">
          <Text>{error?.message ?? "Failed to load countries, try again"}</Text>
          <CustomButton text="Reload" onPress={refetch} disabled={isPending} />
        </View>
      )}
    </CustomModal>
  );
};

export default CountriesSelectionModal;
