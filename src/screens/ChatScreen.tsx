import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  Alert,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useMessages } from "../hooks/useMessages";
import { getUserId } from "../utils/generateUserId";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { MessageList } from "../components/chat/MessageList";
import { MessageInput } from "../components/chat/MessageInput";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { userService } from "../services/userService";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

export const ChatScreen: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [userIdLoading, setUserIdLoading] = useState(true);
  const [currentUserName, setCurrentUserName] = useState<string>("");
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId } = route.params;
  const { messages, loading, error, sendMessage, refetch } =
    useMessages(chatId);

  useEffect(() => {
    const initializeUserId = async () => {
      try {
        const userId = await getUserId();
        setCurrentUserId(userId);
      } catch (err) {
        console.error("Failed to get user ID:", err);
        Alert.alert("Error", "Failed to initialize user ID");
      } finally {
        setUserIdLoading(false);
      }
    };

    initializeUserId();
  }, []);

  useEffect(() => {
    const loadCurrentUserName = async () => {
      if (!currentUserId) {
        return;
      }
      try {
        const currentUser = await userService.getUser(currentUserId);
        if (currentUser && currentUser.name) {
          setCurrentUserName(currentUser.name);
        }
      } catch (err) {
        console.error("Loading username error: ", err);
      }
    };
    loadCurrentUserName();
  }, [currentUserId]);

  const handleSendMessage = async (content: string) => {
    if (!currentUserId) return;

    try {
      await sendMessage(content, currentUserId);
    } catch (err) {
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const handleRetry = () => {
    refetch();
  };

  if (userIdLoading || loading) {
    return <LoadingSpinner message="Loading chat..." />;
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.errorContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRetry} />
          }
        >
          <Text style={styles.errorText}>Failed to load messages</Text>
          <Text style={styles.errorSubtext}>Pull to refresh</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Group Chat</Text>
        <Text style={styles.headerSubtitle}>
          You are: {currentUserName || currentUserId}
        </Text>
      </View>

      <MessageList messages={messages} currentUserId={currentUserId} />

      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={!currentUserId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#F8F8F8",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF3B30",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
