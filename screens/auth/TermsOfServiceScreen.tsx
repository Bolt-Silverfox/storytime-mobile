import { useNavigation } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import PageTitle from "../../components/PageTitle";
import { termsAndConditionsData } from "../../data";
import SafeAreaWrapper from "../../components/UI/SafeAreaWrapper";

const styles = StyleSheet.create({
  listFooter: {
    height: 60,
  },
});

const TermsOfServiceScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();
  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-col">
        <PageTitle
          title="Terms & Conditions"
          goBack={() => navigator.goBack()}
        />
        <FlatList
          data={termsAndConditionsData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(data) => data.index}
          contentContainerClassName="px-4 flex flex-col gap-y-8 pt-8 mx-auto max-w-[600px]"
          ListFooterComponent={<View style={styles.listFooter} />}
          renderItem={({ item }) => (
            <View className="flex flex-col gap-y-3 ">
              <Text className="font-[abeezee] text-[18px]">
                {item.index}. {item.heading}
              </Text>
              {Array.isArray(item.paragraph) ? (
                item.paragraph.map((p, i) => (
                  <Text key={i} className="font-[abeezee] text-base">
                    {p}
                  </Text>
                ))
              ) : (
                <Text className="font-[abeezee] text-base">
                  {item.paragraph}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default TermsOfServiceScreen;
