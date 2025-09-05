export interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  chat_id: string;
}

export interface Chat {
  participants: string[];
  id: string;
  name: string | null;
  type: "direct" | "group";
  created_at: string;
  created_by: string;
}

export interface ChatRow {
  chat_id: string;
  user_id: string;
  chats: {
    id: string;
    name: string | null;
    type: "direct" | "group";
    created_at: string;
    created_by: string;
  };
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  joined_at: string;
}

export type RootStackParamList = {
  ChatList: undefined;
  Chat: { chatId: string; chatName?: string };
};
