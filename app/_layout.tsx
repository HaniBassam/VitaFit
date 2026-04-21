import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "@/components/navigation/BottomNav";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";

function AppNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { session, loading } = useAuth();

  const isAuthRoute = segments[0] === "(auth)";

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!session && !isAuthRoute) {
      router.replace("/login");
      return;
    }

    if (session && isAuthRoute) {
      router.replace("/home");
    }
  }, [isAuthRoute, loading, router, session]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.stackArea}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: styles.stackContent,
            }}
          />
        </View>
        {!isAuthRoute ? <BottomNav /> : null}
      </View>
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B1014",
  },
  container: {
    flex: 1,
    backgroundColor: "#0B1014",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 12,
  },
  stackArea: {
    flex: 1,
  },
  stackContent: {
    backgroundColor: "#0B1014",
  },
});
