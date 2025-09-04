import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { chatService } from "../../services/chatService";

interface UserSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  currentUserId: string;
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  visible,
  onClose,
  onStartChat,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await chatService.searchUsers(query);
      // Filter out current user from results
      const filteredResults = results.filter(
        (userId) => userId !== currentUserId
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  const handleStartChat = () => {
    if (!selectedUserId) {
      Alert.alert("Error", "Please select a user to chat with");
      return;
    }

    onStartChat(selectedUserId);
    // Reset modal state
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUserId(null);
  };

  const renderUserItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.userItem,
        selectedUserId === item && styles.selectedUserItem,
      ]}
      onPress={() => setSelectedUserId(item)}
    >
      <Text
        style={[
          styles.userText,
          selectedUserId === item && styles.selectedUserText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Start New Chat</Text>
          <TouchableOpacity
            onPress={handleStartChat}
            disabled={!selectedUserId}
          >
            <Text
              style={[
                styles.startButton,
                !selectedUserId && styles.startButtonDisabled,
              ]}
            >
              Start
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by User ID..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
        </View>

        <View style={styles.resultsContainer}>
          {searching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              renderItem={renderUserItem}
              keyExtractor={(item) => item}
              style={styles.resultsList}
            />
          ) : searchQuery.trim() ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No users found with ID containing "{searchQuery}"
              </Text>
              <Text style={styles.noResultsSubtext}>
                Make sure they've sent at least one message
              </Text>
            </View>
          ) : (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                Search for users by their User ID to start a chat
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  cancelButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  startButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  startButtonDisabled: {
    color: "#C7C7CC",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },
  resultsList: {
    flex: 1,
  },
  userItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
    backgroundColor: "#F8F8F8",
  },
  selectedUserItem: {
    backgroundColor: "#007AFF",
  },
  userText: {
    fontSize: 16,
    color: "#000000",
  },
  selectedUserText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  instructionsContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  instructionsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
