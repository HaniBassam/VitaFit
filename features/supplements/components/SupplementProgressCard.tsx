import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { supplementContent } from "@/features/supplements/data/supplementContent";

type SupplementProgressCardProps = {
  completed: number;
  total: number;
  progress: number;
};

export function SupplementProgressCard({
  completed,
  total,
  progress,
}: SupplementProgressCardProps) {
  const percent = total > 0 ? Math.round(progress * 100) : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>{supplementContent.dailyGoalLabel}</Text>
      <View style={styles.goalRow}>
        <Text style={styles.goalText}>
          {supplementContent.todayLabel}: {completed} of {total}{" "}
          {supplementContent.takenLabel}
        </Text>
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(0, percent)}%` }]} />
      </View>

      <View style={styles.streakRow}>
        <Feather name="calendar" size={15} color="#C6CBD5" />
        <Text style={styles.streakText}>{supplementContent.streakMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
  },
  eyebrow: {
    color: "#A7B1C2",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 14,
  },
  goalText: {
    flex: 1,
    color: "#F4F5F8",
    fontSize: 28,
    fontWeight: "800",
  },
  percent: {
    color: "#2FE0AF",
    fontSize: 27,
    fontWeight: "800",
  },
  track: {
    height: 9,
    borderRadius: 999,
    backgroundColor: "#3B4050",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#2FE0AF",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakText: {
    color: "#C6CBD5",
    fontSize: 15,
    fontWeight: "700",
  },
});
