import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Message } from "../../types";
import { useImageModal } from "../../hooks/useImageModal";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
}) => {
  const { openModal } = useImageModal();

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUser : styles.otherUser,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
        ]}
      >
        {!isCurrentUser && (
          <Text style={styles.username}>{message.user_id}</Text>
        )}

        {message.content ? (
          <Text
            style={[
              styles.messageText,
              isCurrentUser ? styles.currentUserText : styles.otherUserText,
            ]}
          >
            {message.content}
          </Text>
        ) : null}

        {message.photo_uri ? (
          <TouchableOpacity
            onPress={() => {
              if (message.photo_uri) {
                openModal(message.photo_uri);
              }
            }}
          >
            <Image
              source={{ uri: message.photo_uri }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : null}

        <Text
          style={[
            styles.timestamp,
            isCurrentUser
              ? styles.currentUserTimestamp
              : styles.otherUserTimestamp,
          ]}
        >
          {formatTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    flexDirection: "row",
  },
  currentUser: {
    justifyContent: "flex-end",
  },
  otherUser: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 12,
  },
  currentUserBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 0,
  },
  otherUserBubble: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 0,
  },
  username: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#555",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  currentUserText: {
    color: "white",
  },
  otherUserText: {
    color: "black",
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
  currentUserTimestamp: {
    color: "rgba(255,255,255,0.7)",
  },
  otherUserTimestamp: {
    color: "rgba(0,0,0,0.6)",
  },
});
