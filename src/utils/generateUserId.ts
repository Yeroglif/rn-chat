import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "@chat_user_id";

export const getUserId = async (): Promise<string> => {
  try {
    const existingUserId = await AsyncStorage.getItem(USER_ID_KEY);

    if (existingUserId) {
      return existingUserId;
    } else {
      throw new Error("User ID not found");
    }
  } catch (error) {
    console.error("Error managing user ID:", error);
    return "";
  }
};
