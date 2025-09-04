import { useState, useEffect } from "react";
import { chatService } from "../services/chatService";
import { Chat } from "../types";

export const useChats = (userId: string | null) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChats = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const userChats = await chatService.getUserChats(userId);
      setChats(userChats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  const createDirectChat = async (
    otherUserId: string
  ): Promise<string | null> => {
    if (!userId) return null;

    try {
      const chatId = await chatService.createDirectChat(userId, otherUserId);
      await fetchChats();
      return chatId;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create chat");
      return null;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId]);

  return {
    chats,
    loading,
    error,
    createDirectChat,
    refetch: fetchChats,
  };
};
