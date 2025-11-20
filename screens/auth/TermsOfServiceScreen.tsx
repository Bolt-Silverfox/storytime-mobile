import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";

const TermsOfServiceScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  useLayoutEffect(() => {
    navigator.setOptions({
      title: "Terms of service",
    });
  });
  return (
    <View style={styles.screen}>
      <Text>TermsOfServiceScreen</Text>
    </View>
  );
};

export default TermsOfServiceScreen;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
