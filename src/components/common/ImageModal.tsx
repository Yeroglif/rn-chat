import React from "react";
import { Modal, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useImageModal } from "../../hooks/useImageModal";

export const ImageModal = () => {
  const { isOpen, imageUri, closeModal } = useImageModal();
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <TouchableOpacity style={styles.overlay} onPress={closeModal}>
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: "70%",
    borderRadius: 12,
  },
});
