import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "@chat_user_id";

const generateRandomUserId = (): string => {
  return `User_${Math.random().toString(36).slice(2, 10)}`;
};

export const getUserId = async (): Promise<string> => {
  try {
    const existingUserId = await AsyncStorage.getItem(USER_ID_KEY);

    if (existingUserId) {
      return existingUserId;
    }

    const newUserId = generateRandomUserId();
    await AsyncStorage.setItem(USER_ID_KEY, newUserId);
    return newUserId;
  } catch (error) {
    console.error("Error managing user ID:", error);
    return generateRandomUserId();
  }
};
