import { supabase } from "./supabase";
import { Chat } from "../types";

export const chatService = {
  async getUserChats(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from("chat_participants")
      .select(
        `
        chat_id,
        chats (
          id,
          name,
          type,
          created_at,
          created_by
        )
      `
      )
      .eq("user_id", userId);

    if (error) throw error;

    return data?.map((item: any) => item.chats) || [];
  },

  async createDirectChat(
    currentUserId: string,
    otherUserId: string
  ): Promise<string> {
    const existingChat = await this.findDirectChat(currentUserId, otherUserId);
    if (existingChat) {
      return existingChat.id;
    }

    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([
        {
          type: "direct",
          created_by: currentUserId,
        },
      ])
      .select()
      .single();

    if (chatError) throw chatError;

    const { error: participantError } = await supabase
      .from("chat_participants")
      .insert([
        { chat_id: chat.id, user_id: currentUserId },
        { chat_id: chat.id, user_id: otherUserId },
      ]);

    if (participantError) throw participantError;

    return chat.id;
  },

  async findDirectChat(userId1: string, userId2: string): Promise<Chat | null> {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        *,
        chat_participants!inner (user_id)
      `
      )
      .eq("type", "direct");

    if (error) throw error;

    const directChat = data?.find((chat: any) => {
      const participantIds = chat.chat_participants.map((p: any) => p.user_id);
      return (
        participantIds.includes(userId1) &&
        participantIds.includes(userId2) &&
        participantIds.length === 2
      );
    });

    return directChat || null;
  },

  async getChatParticipants(chatId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("chat_participants")
      .select("user_id")
      .eq("chat_id", chatId);

    if (error) throw error;

    return data?.map((p) => p.user_id) || [];
  },

  async searchUsers(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from("messages")
      .select("user_id")
      .ilike("user_id", `%${query}%`);

    if (error) throw error;

    const uniqueUsers = [...new Set(data?.map((m) => m.user_id) || [])];
    return uniqueUsers;
  },
};
