import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, X } from "lucide-react-native";

interface PhotoPickerProps {
  photoUri?: string;
  onPhotoSelected: (uri: string) => void;
  onPhotoRemoved: () => void;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({
  photoUri,
  onPhotoSelected,
  onPhotoRemoved,
}) => {
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera roll permissions are required to add photos"
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    Alert.alert("Add Photo", "Choose an option", [
      { text: "Camera", onPress: openCamera },
      { text: "Photo Library", onPress: openLibrary },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Camera access is required to take photos"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  const openLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      onPhotoSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <View style={styles.photoActions}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={onPhotoRemoved}
            >
              <Text style={styles.removeButtonText}>
                <X />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={pickImage}>
          <Text>
            <Camera />
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  addPhotoButton: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addPhotoText: {
    fontSize: 16,
    color: "#666",
  },
  photoContainer: {
    position: "relative",
    bottom: 10,
    margin: 20,
    alignItems: "center",
  },
  photo: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  photoActions: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    width: 40,
    height: 40,
    gap: 12,
  },
  removeButton: {
    bottom: 23,
    borderRadius: 6,
  },
  removeButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "500",
  },
});

export default PhotoPicker;
