import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
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
    photoUri?: string
  ) => {
    if (!chatId) return;

    try {
      let uploadedPhotoUrl: string | undefined;

      if (photoUri) {
        const fileBase64 = await FileSystem.readAsStringAsync(photoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const fileArrayBuffer = decode(fileBase64);

        const fileExt = photoUri.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("rn-chat-images")
          .upload(fileName, fileArrayBuffer, {
            contentType: `image/${fileExt}`,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("rn-chat-images")
          .getPublicUrl(fileName);

        uploadedPhotoUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("messages").insert([
        {
          content,
          user_id: userId,
          chat_id: chatId,
          photo_uri: uploadedPhotoUrl,
        },
      ]);

      if (error) throw error;
    } catch (err) {
      console.error(err);
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
