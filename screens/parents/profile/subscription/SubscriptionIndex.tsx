import {
  View,
  Text,
  Switch,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { ParentProfileNavigatorProp } from "../../../../Navigation/ParentProfileNavigator";
import defaultStyles from "../../../../styles";

type RadioButton = {
  value: string;
  label?: string;
  selected: string;
  onSelect: React.Dispatch<React.SetStateAction<string>>;
};
export default function SubscriptionIndex() {
  const navigator = useNavigation<ParentProfileNavigatorProp>();
  const [selected, setSelected] = useState("free");

  return (
    <View className="bg-[#FFFCFBFB] flex-1">
      <View className="flex-row border-b-[0.5px] border-[#EAE8E8] p-4 relative gap-[10px] bg-white justify-center ">
        <Pressable className="absolute left-0 p-4">
          <ChevronLeft onPress={() => navigator.goBack()} />
        </Pressable>
        <Text
          style={[defaultStyles.defaultText, { color: "black", fontSize: 18 }]}
          className="self-center text-center  "
        >
          Subscription
        </Text>
      </View>
      <View className="mt-12  items-center">
        <Text style={[defaultStyles.heading, { fontSize: 18 }]}>
          Get Unlimited Stories with StoryTime Premium
        </Text>
      </View>
      <View className="mt-[24px] mx-[16] gap-4">
        <View className="flex-row justify-between py-[34] border-[0.5px] border-[#EAE8E8]   rounded-[20px] px-[16] bg-white">
          <View className="flex-row">
            <RadioButton
              value="free"
              selected={selected}
              onSelect={setSelected}
            />
            <View>
              <Text
                style={[
                  defaultStyles.defaultText,
                  { color: "black", fontSize: 16 },
                ]}
              >
                Free
              </Text>
              <Text
                style={[
                  defaultStyles.defaultText,
                  { color: "black", fontSize: 14 },
                ]}
              >
                Only one story per day, no downloads
              </Text>
            </View>
          </View>
          {/* <View className="self-center">
            <ChevronRight />
          </View> */}
        </View>
        <View className="flex-row justify-between py-[34] border-[0.5px] border-[#EAE8E8]   rounded-[20px] px-[16] bg-white">
          <View className="flex-row">
            {/* <RadioButton
              value="premium"
              selected={selected}
              onSelect={setSelected}
            /> */}
            <Pressable
              style={styles.radioContainer} className=" opacity-15"
            >
              <View style={styles.radioCircle}>
              </View>
            </Pressable>
            <View>
              <Text
                style={[
                  defaultStyles.defaultText,
                  { color: "black", fontSize: 16 },
                ]}
              >
                Storytime Premium
              </Text>
              <Text
                style={[
                  defaultStyles.defaultText,
                  { color: "black", fontSize: 14 },
                ]}
              >
                Access unlimited stories
              </Text>
            </View>
          </View>
          {/* <View className="self-center">
            <ChevronRight />
          </View> */}
        </View>
      </View>
      {/* <View className="flex-1 justify-end  px-4 gap-6">
        <Pressable
          className="pb-10"
          onPress={() => navigator.navigate("indexPage")}
        >
          <Text
            style={[defaultStyles.defaultText, { color: "white" }]}
            className={` rounded-[99px] py-3 px-2 text-center mx-auto w-full bg-[#EC4007]`}
          >
            Save
          </Text>
        </Pressable>
      </View> */}
    </View>
  );
}
const RadioButton = ({ value, label, selected, onSelect }: RadioButton) => (
  <Pressable style={styles.radioContainer} onPress={() => onSelect(value)}>
    <View style={styles.radioCircle}>
      {selected === value && <View style={styles.selectedRb} />}
    </View>
    <Text style={styles.radioText}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4807EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4807EC",
  },
  radioText: {
    fontSize: 16,
  },
});
