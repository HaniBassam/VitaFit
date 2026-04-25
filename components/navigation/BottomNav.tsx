import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const navItems = [
  { label: "Home", icon: "home" as const, href: "/home" as const },
  { label: "Workout", icon: "activity" as const, href: "/workout" as const },
  { label: "Supplements", icon: "droplet" as const, href: "/supplements" as const },
  { label: "Profile", icon: "user" as const, href: "/profile" as const },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: 20 + bottom }]}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Pressable
            key={item.label}
            onPress={() => router.replace(item.href)}
            style={styles.navItem}
          >
            <Feather
              name={item.icon}
              size={20}
              color={isActive ? "#9B8CFF" : "#7A828E"}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#12181D",
    borderTopWidth: 1,
    borderTopColor: "#1E2830",
    paddingHorizontal: 12,
    paddingTop: 12,
    borderRadius: 0,
    marginBottom: 0,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
  },
  label: {
    color: "#7A828E",
    fontSize: 11,
    fontWeight: "700",
  },
  labelActive: {
    color: "#D8CCFF",
  },
});
