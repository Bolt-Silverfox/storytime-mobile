import { useNavigation } from "@react-navigation/native";
import { FlatList, Text, View } from "react-native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import PageTitle from "../../components/PageTitle";
import { termsAndConditionsData } from "../../data";

const TermsOfServiceScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();
  return (
    <View className="flex flex-col">
      <PageTitle
        title="Terms and Conditions"
        goBack={() => navigator.goBack()}
      />
      <FlatList
        data={termsAndConditionsData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(data) => data.index}
        contentContainerClassName="px-4 flex flex-col gap-y-8 pt-14 mx-auto max-w-[600px]"
        ListFooterComponent={<View style={{ height: 60 }} />}
        renderItem={({ item }) => (
          <View className="flex flex-col gap-y-3 ">
            <Text className="font-[quilka] text-[18px]">
              {item.index}. {item.heading}
            </Text>
            {Array.isArray(item.paragraph) ? (
              item.paragraph.map((p, i) => (
                <Text key={i} className="text-base font-[abeezee]">
                  {p}
                </Text>
              ))
            ) : (
              <Text className="text-base font-[abeezee]">{item.paragraph}</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

export default TermsOfServiceScreen;
