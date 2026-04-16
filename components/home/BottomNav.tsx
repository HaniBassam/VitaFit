import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { homeContent } from "@/data/homeContent";

export function BottomNav() {
  return (
    <View style={styles.nav}>
      {homeContent.bottomNavItems.map((item) => (
        <View key={item.label} style={styles.navItem}>
          <Feather
            name={item.icon}
            size={20}
            color={item.active ? "#59D8A3" : "#7A828E"}
          />
          <Text style={[styles.label, item.active && styles.labelActive]}>{item.label}</Text>
        </View>
      ))}
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
