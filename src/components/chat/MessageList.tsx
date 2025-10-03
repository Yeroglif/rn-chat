import React, { useRef, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Message } from "../../types";
import { MessageItem } from "./MessageItem";
import { useAuth } from "../../hooks/useAuth";

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const flatListRef = useRef<FlatList>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageItem message={item} isCurrentUser={item.user_id === user?.id} />
  );

  const keyExtractor = (item: Message) => item.id;

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessage}
      keyExtractor={keyExtractor}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() =>
        flatListRef.current?.scrollToEnd({ animated: true })
      }
      onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingVertical: 8,
  },
});
