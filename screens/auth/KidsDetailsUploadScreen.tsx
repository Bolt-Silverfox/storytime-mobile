import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import defaultStyles from "../../styles";
import colours from "../../colours";
import ImageUploader from "../../components/ImageUploader";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import { ChevronLeft } from "lucide-react-native";
import KidDetailsUploader from "../../components/KidDetailsUploader";
import { ImageSourcePropType } from "react-native";


type Child = {
  id: string;
  name: string;
  ageRange: string;
  photoUri?: string | null;
  placeholder?: string;
  img?: ImageSourcePropType;
};

const KidsDetailsUploadScreen = () => {
  const [children, setChildren] = useState<Child[]>([
  {
    id: "kid1",
    name: "",
    ageRange: "3-4 yrs",
    photoUri: null,
    img: require("../../assets/images/jane-kid.png"),
    placeholder: "Jane Luke"
  },
  {
    id: "kid2",
    name: "",
    ageRange: "3-4 yrs",
    photoUri: null,
    img: require("../../assets/images/jacob-kid.png"),
    placeholder: "Jacob Luke"
  },
  {
    id: "kid3",
    name: "",
    ageRange: "3-4 yrs",
    photoUri: null,
    img: require("../../assets/images/tim-kid.png"),
    placeholder: "Tim Luke"
  }
]);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const navigator = useNavigation<RootNavigatorProp>();

  const updateChild = (id: string, patch: Partial<Child>) => {
    setChildren((prev) =>
      prev.map((child) => (child.id === id ? { ...child, ...patch } : child))
    );
  };

  const handleSavePhoto = (uri: string | null) => {
    if (editingChildId) updateChild(editingChildId, { photoUri: uri });
    setEditingChildId(null);
  };

  return (
    <ScrollView
          contentContainerStyle={{
            minHeight: "100%",
            paddingVertical: 46,
          }}
        >
          <Pressable
            onPress={() => navigator.goBack()}
            style={{ paddingHorizontal: 16, marginBottom: 16 }}
          >
            <ChevronLeft style={styles.image} />
          </Pressable>
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Kids Details</Text>
      <Text style={styles.subtitle}>Complete setting up your kids information</Text>

      <FlatList
        data={children}
        style={{ alignSelf: "flex-start", width: "100%"}}
        scrollEnabled={false}
        keyExtractor={(child) => child.id}
        renderItem={({ item }) => (
          <>
            <KidDetailsUploader
              child={item}
              onEditPhoto={() => setEditingChildId(item.id)}
              onUpdate={(patch) => updateChild(item.id, patch)}
              placeholder={item.placeholder}
              img={item.img}
            />
          </>
        )}
      />

      {/* Bottom Action Buttons */}
      <View style={styles.bottomButtons}>
        <Pressable style={styles.skipButton}>
          <Text style={{ color: colours.primary, textAlign: "center" }}>Skip</Text>
        </Pressable>
        <Pressable style={[defaultStyles.button, { flex: 1 }]}>
          <Text style={{ color: "white", textAlign: "center" }}>Finalize profile</Text>
        </Pressable>
      </View>

      {/* Photo Upload Modal */}
      <Modal visible={!!editingChildId} animationType="slide">
        <View style={styles.modalView}>
          <Text style={defaultStyles.heading}>Upload photo</Text>
          <ImageUploader onSave={handleSavePhoto} onCancel={() => setEditingChildId(null)} />
        </View>
      </Modal>
    </View>
    </ScrollView>
  );
};

/* ----------------- STYLES ------------------- */

const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 20,
  },
  container: {
    ...defaultStyles.screen,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    ...defaultStyles.heading,
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    ...defaultStyles.defaultText,
    marginBottom: 20,
  },
  
  addBtn: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 80,
  },

  bottomButtons: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 28,
  },
  skipButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colours.border,
    paddingVertical: 12,
    borderRadius: 100,
  },

  modalView: {
    flex: 1,
    padding: 20,
    backgroundColor: colours["bg-light"],
  },
});

export default KidsDetailsUploadScreen;
