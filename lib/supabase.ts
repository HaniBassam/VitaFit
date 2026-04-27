import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

export const hasSupabaseConfig =
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

const webStorage = {
  async getItem(key: string) {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(key);
  },
};

const storage = typeof window === "undefined" ? webStorage : AsyncStorage;

export async function clearSupabaseAuthStorage() {
  if (typeof window !== "undefined") {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith("sb-"))
      .forEach((key) => window.localStorage.removeItem(key));
    return;
  }

  const keys = await AsyncStorage.getAllKeys();
  const authKeys = keys.filter((key) => key.startsWith("sb-"));

  if (authKeys.length > 0) {
    await AsyncStorage.multiRemove(authKeys);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
