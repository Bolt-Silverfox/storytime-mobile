import { useState } from "react";
import { ScrollView, Switch, Text, View } from "react-native";
import PageTitle from "../../../components/PageTitle";
import { useNavigation } from "@react-navigation/native";
import { ParentControlNavigatorProp } from "../../../Navigation/ParentControlsNavigator";

const screenLimit: Limit[] = [
  "30 Minutes",
  "1 Hours",
  "2 Hours",
  "3 Hours",
  "4 Hours",
  "5 Hours",
  "6 Hours",
  "7 Hours",
  "No Limit",
];

type Limit =
  | "30 Minutes"
  | "1 Hours"
  | "2 Hours"
  | "3 Hours"
  | "4 Hours"
  | "5 Hours"
  | "6 Hours"
  | "7 Hours"
  | "No Limit";

const SetDailyLimit = () => {
  const [limit, setLimit] = useState<Limit>("No Limit");
  const navigator = useNavigation<ParentControlNavigatorProp>();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="min-h-full pb-10 bg-light flex flex-col gap-y-10 sm:mx-auto max-w-screen-md w-full"
    >
      <PageTitle
        title="Set Daily Usage Limit"
        goBack={() => navigator.goBack()}
      />
      <View className="p-5 mx-5  flex flex-col gap-y-2 rounded-2xl bg-white">
        <Text className="text-xl font-[abeezee] text-center mb-2">
          DEFAULT SCREEN LIMIT :{" "}
          <Text className="font-[quilka]">{"No Limit"}</Text>
        </Text>
        <Text className="text-text text-base font-[abeezee] text-center">
          Set up default screen time for your child.
        </Text>
        <Text className="text-text text-base font-[abeezee] text-center">
          Once timer expires, the app will be locked
        </Text>
      </View>
      <View className="p-5 flex flex-col gap-y-6 bg-white mx-5 rounded-2xl">
        <Text className="text-xl font-[abeezee]">SELECT SCREEN LIMIT</Text>
        <View className="flex flex-col rounded-2xl gap-y-5 ">
          {screenLimit.map((limitValue) => (
            <View
              key={limitValue}
              className="bg-white flex flex-row justify-between items-center p-3 border-b border-b-black/10"
            >
              <Text className="font-[quilka] text-sm">{limitValue}</Text>
              <Switch
                value={limitValue === limit}
                onValueChange={() => setLimit(limitValue)}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default SetDailyLimit;
