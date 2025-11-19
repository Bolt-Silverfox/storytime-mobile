import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import defaultStyles from "../../styles";
import colours from "../../colours";
import ImageUploader from "../../components/ImageUploader";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { RootNavigatorProp } from "../../Navigation/RootNavigator";
import { PencilLine, ChevronDown, ChevronLeft } from "lucide-react-native";


type Child = {
  id: string;
  name: string;
  ageRange: string;
  photoUri?: string | null;
};

const AGE_OPTIONS = ["3-4 yrs", "5-6 yrs", "7-8 yrs", "9-10 yrs"];

const newChild = () => ({
  id: `c_${Date.now()}`,
  name: "",
  ageRange: AGE_OPTIONS[0],
  photoUri: null,
});

const KidsDetailsUploadScreen = () => {
  const [children, setChildren] = useState<Child[]>([newChild()]);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);
  const navigator = useNavigation<RootNavigatorProp>();

  const updateChild = (id: string, patch: Partial<Child>) => {
    setChildren((prev) =>
      prev.map((child) => (child.id === id ? { ...child, ...patch } : child))
    );
  };

  const removeChild = (id: string) => {
    setChildren((prev) => prev.filter((child) => child.id !== id));
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
          <ChildCard
            child={item}
            onEditPhoto={() => setEditingChildId(item.id)}
            onUpdate={(patch) => updateChild(item.id, patch)}
            // onRemove={() => removeChild(item.id)}
          />
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

/* ----------------- CHILD CARD COMPONENT ------------------- */

const ChildCard = ({
  child,
  onEditPhoto,
  onUpdate,
}: {
  child: Child;
  onEditPhoto: () => void;
  onUpdate: (patch: Partial<Child>) => void;
}) => {
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access media library was denied!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = (result as any).assets[0];
      onUpdate({ photoUri: asset.uri });
    }
  };
  return (
  <>
  <View style={styles.card}>
    {/* Photo Section */}
    <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
      <View style={{ width: 80, height: 80, position: "relative" }}>
        <Image
          source={child.photoUri ? { uri: child.photoUri } : require("../../assets/images/jane-kid.png")}
          style={styles.photoPreview}
          resizeMode="cover"
        />
        {/* Pen Icon Overlay */}
        <View style={styles.penWrapper}>
  <PencilLine color="#000" style={styles.penIcon} />
</View>
      </View>
    </TouchableOpacity>

    <View style={{ flex: 1, gap: 12 }}>
      <TextInput
        value={child.name}
        style={[defaultStyles.input, { width: "100%" }]}
        placeholder="Jane Luke"
        onChangeText={(text) => onUpdate({ name: text })}
      />
      <SimpleDropdown
        value={child.ageRange}
        options={AGE_OPTIONS}
        onChange={(v) => onUpdate({ ageRange: v })}
      />
    </View>
  </View>
  
  {/* Style card */}

  <View style={styles.card}>
    {/* Photo Section */}
    <TouchableOpacity style={styles.photoBox} onPress={onEditPhoto}>
      <View style={{ width: 80, height: 80, position: "relative" }}>
        <Image
          source={child.photoUri ? { uri: child.photoUri } : require("../../assets/images/jacob-kid.png")}
          style={styles.photoPreview}
          resizeMode="cover"
        />
        {/* Pen Icon Overlay */}
        <View style={styles.penWrapper}>
  <PencilLine color="#000" style={styles.penIcon} />
</View>
      </View>
    </TouchableOpacity>

    <View style={{ flex: 1, gap: 12 }}>
      <TextInput
        value={child.name}
        style={[defaultStyles.input, { width: "100%" }]}
        placeholder="Jacob Luke"
        onChangeText={(text) => onUpdate({ name: text })}
      />
      <SimpleDropdown
        value={child.ageRange}
        options={AGE_OPTIONS}
        onChange={(v) => onUpdate({ ageRange: v })}
      />
    </View>
  </View>

    {/* Style card */}

  <View style={styles.card}>
    {/* Photo Section */}
    <TouchableOpacity style={styles.photoBox} onPress={onEditPhoto}>
      <View style={{ width: 80, height: 80, position: "relative" }}>
        <Image
          source={child.photoUri ? { uri: child.photoUri } : require("../../assets/images/tim-kid.png")}
          style={styles.photoPreview}
          resizeMode="cover"
        />
        {/* Pen Icon Overlay */}
        <View style={styles.penWrapper}>
          <PencilLine color="#000" style={styles.penIcon} />
        </View>
      </View>
    </TouchableOpacity>

    <View style={{ flex: 1, gap: 12 }}>
      <TextInput
        value={child.name}
        style={[defaultStyles.input, { width: "100%" }]}
        placeholder="Tim Luke"
        onChangeText={(text) => onUpdate({ name: text })}
      />
      <SimpleDropdown
        value={child.ageRange}
        options={AGE_OPTIONS}
        onChange={(v) => onUpdate({ ageRange: v })}
      />
    </View>
  </View>
  </>
)};

/* ----------------- SIMPLE DROPDOWN ------------------- */

const SimpleDropdown = ({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdown, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
        onPress={() => setOpen(!open)}
      >
        <Text>{value}</Text>
        <ChevronDown style={styles.image} />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.dropdownItem}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
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
  card: {
    flexDirection: "column",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  photoBox: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    borderRadius: 240,
  },
  penWrapper: {
  position: "absolute",
  bottom: 0,
  right: 0,
  width: 28,           // size of the background circle
  height: 28,
  borderRadius: 14,    // half of width/height for perfect circle
  backgroundColor: "white",
  justifyContent: "center",
  alignItems: "center",
  elevation: 4,        // Android shadow
  shadowColor: "#000", // iOS shadow
  shadowOpacity: 0.2,
  shadowRadius: 2,
},

penIcon: {
  width: 20,        
  height: 20,
  resizeMode: "contain",
},

  photoText: {
    ...defaultStyles.smallText,
    color: colours.text,
  },
  removeBtn: {
    justifyContent: "center",
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

  dropdown: {
    ...defaultStyles.input,
    justifyContent: "center",
  },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colours.border,
    borderRadius: 8,
    backgroundColor: "white",
  },
  dropdownItem: {
    padding: 12,
  },
});

export default KidsDetailsUploadScreen;
