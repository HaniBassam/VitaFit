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
        <Feather name="calendar" size={15} color="#D8CCFF" />
        <Text style={styles.streakText}>{supplementContent.streakMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    backgroundColor: "#12181D",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#3B3550",
    padding: 16,
  },
  eyebrow: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  goalText: {
    flex: 1,
    color: "#F4F5F8",
    fontSize: 20,
    fontWeight: "800",
  },
  percent: {
    color: "#D8CCFF",
    fontSize: 20,
    fontWeight: "800",
  },
  track: {
    height: 9,
    borderRadius: 999,
    backgroundColor: "#1D252B",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#9B8CFF",
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  streakText: {
    color: "#A8A0C8",
    fontSize: 13,
    fontWeight: "700",
  },
});
