import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ChatScreen } from "./src/screens/ChatScreen";

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <ChatScreen />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
