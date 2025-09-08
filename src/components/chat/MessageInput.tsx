import { SendHorizonal } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import PhotoPicker from "./PhotoPicker";

interface MessageInputProps {
  onSendMessage: (message: string, photoUri?: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

  const handleSend = () => {
    if ((!message.trim() && !photoUri) || disabled) return;

    onSendMessage(message.trim(), photoUri);
    setMessage("");
    setPhotoUri(undefined);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
          maxLength={500}
          editable={!disabled}
          submitBehavior="newline"
          onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
            if (Platform.OS === "web") {
              const keyEvent = e.nativeEvent as unknown as KeyboardEvent;

              if (e.nativeEvent.key === "Enter" && !keyEvent.shiftKey) {
                e.preventDefault?.();
                handleSend();
              }
            }
          }}
        />

        <PhotoPicker
          photoUri={photoUri}
          onPhotoSelected={(uri) => setPhotoUri(uri)}
          onPhotoRemoved={() => setPhotoUri(undefined)}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            ((!message.trim() && !photoUri) || disabled) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={(!message.trim() && !photoUri) || disabled}
        >
          <SendHorizonal
 
            size={24}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 60,
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sendButtonTextDisabled: {
    color: "#8E8E93",
  },
});
