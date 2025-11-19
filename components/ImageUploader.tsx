import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import colours from "../colours";
import defaultStyles from "../styles";
import { RootNavigatorProp } from '../Navigation/RootNavigator' 
import { useNavigation } from "@react-navigation/native";

type Props = {
  initialImageUri?: string;
  onSave?: (uri: string | null, file?: any) => void;
  onCancel?: () => void;
  maxSizeMB?: number;
};

const ImageUploader: React.FC<Props> = ({
  initialImageUri = null,
  onSave,
  onCancel,
  maxSizeMB = 5,
}) => {
  const [uri, setUri] = useState<string | null>(initialImageUri);
  const [error, setError] = useState<string | null>(null);
  const [fileObj, setFileObj] = useState<any>(null);
  const nativeIdRef = useRef<string>(`image-uploader-${Math.random().toString(36).slice(2)}`);
  const navigator = useNavigation<RootNavigatorProp>();

  useEffect(() => {
    if (Platform.OS === "web") {
      const id = nativeIdRef.current;
      const el = document.getElementById(id);
      if (!el) return;

      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
      };
      const onDrop = (e: DragEvent) => {
        e.preventDefault();
        const dt = (e as any).dataTransfer;
        if (dt && dt.files && dt.files.length) {
          handleFile(dt.files[0]);
        }
      };

      el.addEventListener("dragover", onDragOver);
      el.addEventListener("drop", onDrop);

      return () => {
        el.removeEventListener("dragover", onDragOver);
        el.removeEventListener("drop", onDrop);
      };
    }
  }, []);

  const validateFile = (file: { type?: string; size?: number; name?: string }) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    const sizeOK = typeof file.size === "number" ? file.size <= maxSizeMB * 1024 * 1024 : true;
    const typeOK = file.type ? allowed.includes(file.type) : /\.(jpe?g|png)$/i.test(file.name || "");

    if (!typeOK) return "Unsupported format. Use PNG or JPEG.";
    if (!sizeOK) return `File too large. Not more than ${maxSizeMB}MB.`;
    return null;
  };

  const handleFile = async (file: any) => {
    setError(null);
    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      return;
    }

    if (Platform.OS === "web") {
      const url = URL.createObjectURL(file);
      setUri(url);
      setFileObj(file);
      return;
    }

    if (file && file.uri) {
      setUri(file.uri);
      setFileObj(file);
      return;
    }
  };

  const pickImage = async () => {
    setError(null);
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/png, image/jpeg";
      input.onchange = () => {
        if (!input.files) return;
        const f = input.files[0];
        handleFile(f);
      };
      input.click();
      return;
    }

    try {
      // dynamic import so the app still runs if expo-image-picker isn't installed
      const ImagePicker = await import("expo-image-picker");
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.granted === false) {
        setError("Permission to access media library was denied.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (result.canceled || result.canceled) return;
      const asset = (result as any).assets ? (result as any).assets[0] : result;
      if (asset && asset.uri) {
        const fakeFile = { uri: asset.uri, name: asset.fileName || asset.uri, size: asset.fileSize };
        const validation = validateFile(fakeFile as any);
        if (validation) {
          setError(validation);
          return;
        }
        setUri(asset.uri);
        setFileObj(asset);
      }
    } catch (e) {
      setError("Image picker not available. Install expo-image-picker for native picking.");
    }
  };

  const onSavePress = () => {
    if (onSave) onSave(uri, fileObj);
  };

  const onCancelPress = () => {
    setUri(initialImageUri || null);
    setFileObj(null);
    setError(null);
    if (onCancel) onCancel();
  };

  return (
  <View style={styles.wrapper}>

    <View style={styles.middleSection}>
      <View style={styles.dropArea} nativeID={nativeIdRef.current}>
        <TouchableOpacity activeOpacity={0.8} onPress={pickImage} style={styles.touchableInner}>
          <>
  {uri ? (
    <View style={styles.previewWrapper}>
      <Image source={{ uri }} style={styles.preview} />

      {/* Trash Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          setUri(null);
          setFileObj(null);
        }}
      >
        <Image
      source={require("../assets/icons/trush-square.png")}
    />
      </TouchableOpacity>
    </View>
  ) : (
    <Image
      source={require("../assets/icons/image-upload.png")}
      style={styles.icon}
    />
  )}

  {/* These ALWAYS show */}
  <Text style={[defaultStyles.defaultText, styles.primaryText]}>
    <Text style={{ color: "red" }}>Click to upload</Text>
    <Text> or drag and drop file here</Text>
  </Text>

  <Text style={[defaultStyles.smallText, styles.hintText]}>
    Supported format: PNG, JPEG. Not more than {maxSizeMB}MB
  </Text>
</>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>

    <View style={styles.buttonRow}>
      <TouchableOpacity
  style={[
    defaultStyles.button,
    !uri && defaultStyles.buttonDisabled,  // Disable style when no image
    styles.saveButton
  ]}
  // onPress={onSavePress}
  onPress={() => navigator.navigate("auth", { screen: "kidsDetailsUpload" })}
  disabled={!uri}   // Disable press completely
>
  <Text style={[defaultStyles.defaultText, styles.saveText]}>Save</Text>
</TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancelPress}>
        <Text style={[defaultStyles.defaultText, styles.cancelText]}>Cancel</Text>
      </TouchableOpacity>
    </View>

  </View>
);

};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  alignItems: "center",
  flex: 1,
  },
  middleSection: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
},

previewWrapper: {
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
},

deleteButton: {
  position: "absolute",
  top: 26,
  right: 26,  
  borderRadius: 20,
  padding: 6,
  shadowOpacity: 0.3,
  shadowRadius: 3,
},

  dropArea: {
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 54,
    marginBottom: 29,
    tintColor: colours.black,
    resizeMode: "contain",
  },
  primaryText: {
    color: colours.black,
    marginBottom: 32,
  },
  hintText: {
    color: colours.text,
    fontSize: 14,
    marginBottom: 73,
  },
  preview: {
    width: 100,
    height: 100,
    marginTop: 54,
    marginBottom: 29,
    borderRadius: 300,
    resizeMode: "cover",
  },
  errorText: {
    color: "red",
    marginTop: 6,
    fontSize: 13,
  },
  buttonRow: {
    width: "100%",
  flexDirection: "column",
  gap: 24,
  marginTop: "auto",
  marginBottom: 24,
  },
  saveButton: {
    width: "100%",
  },
  touchableInner: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "abeezee",
    fontSize: 16,
  },
  cancelButton: {
  width: "100%",
  borderWidth: 1,
  borderColor: colours.border,
  borderRadius: 100,
  paddingVertical: 12,
  alignItems: "center",
  },
  cancelText: {
    color: colours.black,
    fontFamily: "abeezee",
    fontSize: 16,
  },
});

export default ImageUploader;
