import { User } from "../types";
import supabase from "./supabase";

export const userService = {
  async getUser(id: string): Promise<User> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select(`*`)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateUserName(id: string, newName: string) {
    const { error } = await supabase
      .from("user_profiles")
      .update({ username: newName })
      .eq("id", id);

    if (error) {
      throw error;
    }
  },
  async searchUsers(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from("user_profiles")
      .select("username")
      .ilike("username", `%${query}%`);

    if (error) throw error;

    const uniqueUsers = [...new Set(data?.map((m) => m.username) || [])];
    return uniqueUsers;
  },
};
