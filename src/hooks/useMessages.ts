import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Message } from "../types";

export const useMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    if (!chatId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    content: string,
    userId: string,
    photo_uri?: string,
  ) => {
    if (!chatId) return;

    try {
      const { error } = await supabase
        .from("messages")
        .insert([
          { content, user_id: userId, chat_id: chatId, photo_uri: photo_uri },
        ]);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  useEffect(() => {
    if (!chatId) return;

    fetchMessages();

    const channel = supabase
      .channel(`messages_${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages,
  };
};
