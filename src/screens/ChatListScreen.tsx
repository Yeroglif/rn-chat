import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Chat, RootStackParamList } from "../types";
import { useChats } from "../hooks/useChats";
import { getUserId } from "../utils/generateUserId";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { UserSearchModal } from "../components/chat/UserSearchModal";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ChatList">;

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [userIdLoading, setUserIdLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const { chats, loading, error, createDirectChat, refetch } =
    useChats(currentUserId);

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

  const handleChatPress = (chat: Chat) => {
    const chatName = chat.name || `Chat with other user`;
    navigation.navigate("Chat", {
      chatId: chat.id,
      chatName: chatName,
    });
  };

  const handleStartNewChat = async (otherUserId: string) => {
    try {
      const chatId = await createDirectChat(otherUserId);
      if (chatId) {
        setModalVisible(false);
        navigation.navigate("Chat", {
          chatId,
          chatName: `Chat with ${otherUserId}`,
        });
      }
    } catch (err) {
      Alert.alert("Error", "Failed to create chat. Please try again.");
    }
  };

  const formatChatName = (chat: Chat) => {
    if (chat.name) return chat.name;
    if (chat.type === "direct") return "Direct Chat";
    return "Group Chat";
  };

  const formatChatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "Today";
    } else if (diffDays === 2) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
    >
      <View style={styles.chatAvatar}>
        <Text style={styles.chatAvatarText}>
          {formatChatName(item).charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{formatChatName(item)}</Text>
        <Text style={styles.chatDate}>{formatChatDate(item.created_at)}</Text>
      </View>
      <View style={styles.chatArrow}>
        <Text style={styles.arrowText}>{`>`}</Text>
      </View>
    </TouchableOpacity>
  );

  if (userIdLoading || loading) {
    return <LoadingSpinner message="Loading chats..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>You are: {currentUserId}</Text>
      </View>

      {chats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No chats yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the + button to start a new chat
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <UserSearchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onStartChat={handleStartNewChat}
        currentUserId={currentUserId}
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
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
  chatDate: {
    fontSize: 14,
    color: "#666",
  },
  chatArrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 20,
    color: "#C7C7CC",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "300",
  },
});
