import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const navItems = [
  { label: "Home", icon: "home" as const, href: "/home" },
  { label: "Workout", icon: "activity" as const, href: "/workout" },
  { label: "Supplements", icon: "droplet" as const, href: "/supplements" },
  { label: "Profile", icon: "user" as const, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.nav}>
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
              color={isActive ? "#59D8A3" : "#7A828E"}
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
    paddingTop: 10,
    paddingBottom: 14,
    borderRadius: 24,
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
    color: "#59D8A3",
  },
});
