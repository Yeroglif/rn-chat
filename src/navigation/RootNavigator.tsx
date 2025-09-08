import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Text } from "react-native";
import { Settings } from "lucide-react-native";
import { ChatListScreen } from "../screens/ChatListScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { AuthScreen } from "../screens/AuthScreen";
import { useAuth } from "../hooks/useAuth";

export type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string; chatName: string };
  Settings: undefined;
  Auth: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="ChatList"
            component={ChatListScreen}
            options={({ navigation }) => ({
              title: "Chat",
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
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
