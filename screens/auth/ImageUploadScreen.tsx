import React from "react";
import { View, StyleSheet, Image,
  Pressable,
  ScrollView,
  Text,
  } from "react-native";
import ImageUploader from "../../components/ImageUploader";
import defaultStyles from "../../styles";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import { ChevronLeft } from "lucide-react-native";


const ImageUploadScreen = () => {
  const navigator = useNavigation<RootNavigatorProp>();

  return (
    <ScrollView
          contentContainerStyle={{
            minHeight: "100%",
            paddingVertical: 46,
          }}
        >
          <Pressable
            onPress={() => navigator.goBack()}
            style={{ paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', }}
          >
            <ChevronLeft style={styles.image} />
            <Text style={[defaultStyles.defaultText, {fontSize: 18, marginLeft: 16}]}>Upload Image</Text>
          </Pressable>
    <View style={styles.screen}>
      <ImageUploader
        onSave={() => {
          // after saving the image, navigate to home
          navigator.navigate("home");
        }}
        onCancel={() => navigator.goBack()}
      />
    </View>
    </ScrollView>
  );
};

export default ImageUploadScreen;

const styles = StyleSheet.create({
  screen: {
    ...defaultStyles.screen,
    justifyContent: "center",
  },
  image: {
    height: 20,
    width: 20,
  },
});
