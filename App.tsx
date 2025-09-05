import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChatListScreen } from "./src/screens/ChatListScreen";
import { ChatScreen } from "./src/screens/ChatScreen";
import { TouchableOpacity, Text } from "react-native";
import { Settings } from "lucide-react-native";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { UserProvider } from "./src/context/UserContext";

export type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string; chatName: string };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ChatList">
          <Stack.Screen
            name="ChatList"
            component={ChatListScreen}
            options={({ navigation }) => ({
              title: "Expenses",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                  style={{ marginRight: 16 }}
                >
                  <Text style={{ fontSize: 18 }}>
                    <Settings />
                  </Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}
