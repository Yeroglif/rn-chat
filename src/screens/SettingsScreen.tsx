import { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { userService } from "../services/userService";
import { useAuth } from "../hooks/useAuth";

export const SettingsScreen: React.FC = () => {
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { id: currentUserId } = user || {};

  useEffect(() => {
    const loadUser = async () => {
      if (!currentUserId) return;
      try {
        const currentUser = await userService.getUser(currentUserId);
        console.log("Current user name:", currentUser?.username);
        if (currentUser?.username) {
          setUserName(currentUser.username);
        }
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to load user data");
      }
    };
    loadUser();
  }, [currentUserId]);

  const handleSaveSettings = async () => {
    if (!currentUserId) return;
    if (!userName.trim()) {
      Alert.alert("Validation", "User name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      await userService.updateUserName(currentUserId, userName.trim());
      Alert.alert("Success", "User name updated");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update user name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.debug}>Current User ID: {user?.id || "Not set"}</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>User name: {userName}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={userName}
          onChangeText={setUserName}
          autoFocus
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSaveSettings}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  debug: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#4f46e5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#a5b4fc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
