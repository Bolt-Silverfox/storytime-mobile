import { useSuspenseQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import getCountriesQuery from "../../hooks/useGetCountries";
import CustomButton from "../UI/CustomButton";
import CustomModal from "./CustomModal";

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
  const { isPending, error, data, refetch } =
    useSuspenseQuery(getCountriesQuery());
  const [searchValue, setSearchValue] = useState<string | undefined>();

  const selectCountry = (country: string) => {
    onClose();
    setCountry(country);
  };

  if (error)
    return (
      <View className="flex flex-col gap-y-3">
        <Text>{error?.message ?? "Failed to load countries, try again"}</Text>
        <CustomButton text="Reload" onPress={refetch} disabled={isPending} />
      </View>
    );

  let filteredCountries = data;

  if (searchValue) {
    filteredCountries = data.filter((country) =>
      country.name.common
        .toLowerCase()
        .includes(searchValue.trim().toLowerCase())
    );
  }
  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      <TextInput
        className="rounded-full h-10 flex flex-col justify-center border mt-16"
        onChangeText={setSearchValue}
        placeholder="Search country"
      />
      <FlatList
        data={filteredCountries}
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
    </CustomModal>
  );
};

export default CountriesSelectionModal;
