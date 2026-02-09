import { StyleSheet, View, Text, FlatList } from "react-native";
import SafeAreaWrapper from "../UI/SafeAreaWrapper";
import PageTitle from "../PageTitle";
import { termsAndConditionsData } from "../../data";

const TermsAndConditionsScreenComponent = ({
  goBack,
}: {
  goBack: () => void;
}) => {
  return (
    <SafeAreaWrapper variant="solid">
      <View className="flex flex-col">
        <PageTitle title="Terms & Conditions" goBack={goBack} />
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

export default TermsAndConditionsScreenComponent;

const styles = StyleSheet.create({
  listFooter: {
    height: 60,
  },
});
