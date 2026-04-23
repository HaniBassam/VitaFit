import { StyleSheet, Text, View } from "react-native";

type WorkoutProgressCardProps = {
  title: string;
  completed: number;
  total: number;
};

export function WorkoutProgressCard({ title, completed, total }: WorkoutProgressCardProps) {
  const progress = total > 0 ? completed / total : 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>
          {completed} of {total} Done
        </Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.max(8, progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#10241F",
    borderWidth: 1,
    borderColor: "#1E5C49",
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  count: {
    color: "#A7F3D0",
    fontSize: 12,
    fontWeight: "800",
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#173528",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#36D280",
  },
});
