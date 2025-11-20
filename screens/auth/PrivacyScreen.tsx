import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";

const PrivacyScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  useLayoutEffect(() => {
    navigator.setOptions({
      title: "Privacy policy",
    });
  });
  return (
    <View style={styles.screen}>
      <Text>PrivacyScreen</Text>
    </View>
  );
};

export default PrivacyScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
