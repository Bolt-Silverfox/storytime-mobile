import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import * as ImagePicker from "expo-image-picker";
import React, { useState } from 'react'
import { ImageSourcePropType } from "react-native";
import { ChevronDown, Pencil } from 'lucide-react-native';
import defaultStyles from '../styles';
import colours from '../colours';

type Child = {
  id: string;
  name: string;
  ageRange: string;
  photoUri?: string | null;
};

const AGE_OPTIONS = ["3-4 yrs", "5-6 yrs", "7-8 yrs", "9-10 yrs"];

const KidDetailsUploader = ({
  child,
  onEditPhoto,
  onUpdate,
  placeholder = "Jane Luke",
  img,
}: {
  child: Child;
  onEditPhoto: () => void;
  onUpdate: (patch: Partial<Child>) => void;
  placeholder?: string;
  img?: ImageSourcePropType;
}) => {
 const [open, setOpen] = useState(false);
 const fallbackImage = require("../assets/images/jane-kid.png");

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
    <View style={styles.card}>
        {/* Photo Section */}
        <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
          <View style={{ width: 80, height: 80, position: "relative" }}>
            <Image
              source={child.photoUri ? { uri: child.photoUri } : img || fallbackImage}
              style={styles.photoPreview}
              resizeMode="cover"
            />
            {/* Pen Icon Overlay */}
            <View style={styles.penWrapper}>
      <Pencil color="#000" style={styles.penIcon} />
    </View>
          </View>
        </TouchableOpacity>
    
        <View style={{ flex: 1, gap: 12 }}>
          <TextInput
            value={child.name}
            style={[defaultStyles.input, { width: "100%" }]}
            placeholder={placeholder}
            onChangeText={(text) => onUpdate({ name: text })}
          />
          <View>
      <TouchableOpacity
        style={[styles.dropdown, { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }]}
        onPress={() => setOpen(!open)}
      >
        <Text>{child.ageRange}</Text>
        <ChevronDown style={styles.image} />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdownList}>
          {AGE_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.dropdownItem}
              onPress={() => {
                onUpdate({ ageRange: opt }); 
                setOpen(false);
              }}
            >
              <Text>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
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
  width: 28,       
  height: 28,
  borderRadius: 14,  
  backgroundColor: "white",
  justifyContent: "center",
  alignItems: "center",
  elevation: 4,       
  shadowColor: "#000", 
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
  image: {
    height: 20,
    width: 20,
  },
  removeBtn: {
    justifyContent: "center",
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
})

export default KidDetailsUploader