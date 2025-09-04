import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Message } from "../../types";

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isCurrentUser,
}) => {
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
        <Text
          style={[
            styles.messageText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText,
          ]}
        >
          {message.content}
        </Text>
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
    paddingHorizontal: 16,
  },
  currentUser: {
    alignItems: "flex-end",
  },
  otherUser: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  currentUserBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: "#E5E5EA",
    borderBottomLeftRadius: 4,
  },
  username: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: "#FFFFFF",
  },
  otherUserText: {
    color: "#000000",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  currentUserTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherUserTimestamp: {
    color: "#666",
  },
});
