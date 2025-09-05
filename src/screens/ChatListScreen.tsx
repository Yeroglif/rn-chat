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
import { chatService } from "../services/chatService";
import { useUserContext } from "../context/UserContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ChatList">;

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [userIdLoading, setUserIdLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const { currentUserId, setCurrentUserId } = useUserContext();

  const { chats, loading, createDirectChat, refetch } = useChats(currentUserId);
  const [chatsWithParticipants, setChatsWithParticipants] = useState<Chat[]>(
    []
  );

  useEffect(() => {
    if (chats.length === 0) return;

    const loadParticipants = async () => {
      const chatsFull = await Promise.all(
        chats.map(async (chat) => {
          const participants = await chatService.getChatParticipants(chat.id);
          return { ...chat, participants };
        })
      );
      setChatsWithParticipants(chatsFull);
    };

    loadParticipants();
  }, [chats]);

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
  }, [setCurrentUserId]);

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
    if (chat.type === "direct") {
      const others = chat.participants?.filter(
        (participant) => participant !== currentUserId
      );
      return others?.join(", ") || "Direct Chat";
    }
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
      <View style={styles.content}>
        {chatsWithParticipants.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No chats yet</Text>
            <Text style={styles.emptySubText}>
              Start a conversation to get started!
            </Text>
          </View>
        ) : (
          <FlatList
            data={chatsWithParticipants}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={refetch} />
            }
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
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
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  chatItem: {
    backgroundColor: "#fff",
    padding: 16,
    marginVertical: 4,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  chatAvatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  chatDate: {
    fontSize: 14,
    color: "#666",
  },
  chatArrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 18,
    color: "#ccc",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4f46e5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
});
