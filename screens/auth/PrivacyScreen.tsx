import { useNavigation } from "@react-navigation/native";
import { FlatList, Text, View } from "react-native";
import PageTitle from "../../components/PageTitle";
import { AuthNavigatorProp } from "../../Navigation/AuthNavigator";
import { privacyPolicyData } from "../../data";

const PrivacyScreen = () => {
  const navigator = useNavigation<AuthNavigatorProp>();
  return (
    <View className="flex flex-col">
      <PageTitle title="Privacy Policy" goBack={() => navigator.goBack()} />
      <FlatList
        data={privacyPolicyData}
        showsVerticalScrollIndicator={false}
        keyExtractor={(data) => data.number}
        contentContainerClassName="px-4 flex flex-col gap-y-8 pt-14 mx-auto max-w-[600px]"
        ListFooterComponent={<View style={{ height: 60 }} />}
        renderItem={({ item }) => (
          <View className="flex flex-col gap-y-3 ">
            <Text className="font-[quilka] text-[18px]">
              {item.number}. {item.title}
            </Text>
            <Text className="text-base font-[abeezee]">{item.paragraph}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default PrivacyScreen;
