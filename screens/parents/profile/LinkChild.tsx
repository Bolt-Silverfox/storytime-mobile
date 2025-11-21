import { FlatList, ImageSourcePropType, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import defaultStyles from "../../../styles";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../../../Navigation/RootNavigator";
import { useState } from "react";
import LinkChildProfile from "../../../components/LinkChildProfile";
import colours from "../../../colours";

export type Child = {
  id: string;
  name: string;
  username: string;
  ageRange: string;
  photoUri?: string | null;
  img?: ImageSourcePropType;
};

const LinkChild = () => {
  const navigator = useNavigation<RootNavigatorProp>();
  const [children, setChildren] = useState<Child[]>([
     {
       id: "kid1",
       name: "Jane Luke",
       username: "Jane Luke",
       ageRange: "5 - 8 years",
       photoUri: null,
       img: require("../../../assets/avatars/Avatars-8.png"),
     },
     {
       id: "kid2",
       name: "Jacob Luke",
       username: "Jacob Luke",
       ageRange: "1 - 4 years",
       photoUri: null,
       img: require("../../../assets/avatars/Avatars-7.png"),
     },
     {
       id: "kid3",
       name: "Tim Luke",
       username: "Tim Luke",
       ageRange: "9 - 12 years",
       photoUri: null,
       img: require("../../../assets/avatars/Avatars-3.png"),
     },
   ]);

  return (
  <ScrollView
    contentContainerStyle={{
      minHeight: "100%",
      paddingVertical: 46,
    }}
  >
    <View style={{ paddingHorizontal: 16, marginBottom: 16, flexDirection: 'row', }}>
      <Pressable
        onPress={() => navigator.goBack()}
      >
        <ChevronLeft style={styles.image} />
      </Pressable>
      <Text style={[defaultStyles.defaultText, {fontSize: 18, marginLeft: 80}]}>Manage Child Profiles</Text>
    </View>
    <View style={{...defaultStyles.screen, flex: 1, backgroundColor: "#fffcfb"}}>
      <FlatList
          data={children}
          style={{ width: "100%", flexDirection: "column",}}
          scrollEnabled={false}
          keyExtractor={(child) => child.id}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => (
            <View style={{flexDirection: "column"}}>
              <LinkChildProfile child={item} />
            </View>
          )}
        />
        <TouchableOpacity
          style={[
            defaultStyles.button,
            styles.addButton
          ]}
          // onPress={() => navigator.navigate("auth", { screen: "kidsDetailsUpload" })}
        >
          <Text style={[defaultStyles.defaultText, styles.addText]}>Add Child</Text>
        </TouchableOpacity>
    </View>
  </ScrollView>)
};

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
  wrapper: {
    backgroundColor: ""
  },
  addButton: {
    width: "100%",
    backgroundColor: colours.primary
  },
  addText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "abeezee",
    fontSize: 16,
  },
})

export default LinkChild;
