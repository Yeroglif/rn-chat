import { User } from "../types";
import supabase from "./supabase";

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select(`*`);

    if (error) {
      throw error;
    }
    return data || [];
  },

  async getUser(id: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
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
      .from("users")
      .update({ name: newName })
      .eq("id", id);

    if (error) {
      throw error;
    }
  },
  async searchUsers(query: string): Promise<string[]> {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .ilike("id", `%${query}%`);

    if (error) throw error;

    const uniqueUsers = [...new Set(data?.map((m) => m.id) || [])];
    return uniqueUsers;
  },
};
