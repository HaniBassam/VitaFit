import { Feather, Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { homeContent } from "@/data/homeContent";

export function HomeTopBar() {
  return (
    <View style={styles.row}>
      <View style={styles.logoBox}>
        <Ionicons name="flash" size={18} color="#1A2226" />
      </View>

      <Pressable style={styles.bellButton}>
        <Feather name="bell" size={18} color="#E5E7EB" />
        <View style={styles.bellDot} />
      </Pressable>
    </View>
  );
}

export function HomeGreeting() {
  return (
    <View style={styles.greetingBlock}>
      <Text style={styles.title}>Hi, {homeContent.greetingName}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.dateText}>{homeContent.dateText}</Text>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>{homeContent.streakLabel}</Text>
        </View>
        <View style={styles.caloriesPill}>
          <Ionicons name="flame-outline" size={12} color="#F59E0B" />
          <Text style={styles.caloriesText}>{homeContent.caloriesLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#59D8A3",
    alignItems: "center",
    justifyContent: "center",
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1B222A",
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#EF4444",
  },
  greetingBlock: {
    gap: 10,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -1,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    color: "#A1AAB6",
    fontSize: 14,
    fontWeight: "600",
  },
  streakPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#153128",
    borderWidth: 1,
    borderColor: "#1E5C49",
  },
  streakText: {
    color: "#59D8A3",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  caloriesPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#1B1B1B",
    borderWidth: 1,
    borderColor: "#303030",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  caloriesText: {
    color: "#F5F5F5",
    fontSize: 12,
    fontWeight: "700",
  },
});
