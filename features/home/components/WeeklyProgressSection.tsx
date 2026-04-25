import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type WeeklyDay = {
  label: string;
  completed: boolean;
};

type WeeklyProgressSectionProps = {
  days: WeeklyDay[];
  noteTitle: string;
  noteBody: string;
};

export function WeeklyProgressSection({
  days,
  noteTitle,
  noteBody,
}: WeeklyProgressSectionProps) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Weekly Progress</Text>
        <Pressable onPress={() => router.push("/workout")}>
          <Text style={styles.historyText}>View history ›</Text>
        </Pressable>
      </View>

      <View style={styles.barsRow}>
        {days.map((day, index) => (
          <View key={`${day.label}-${index}`} style={styles.dayColumn}>
            <View style={[styles.bar, day.completed ? styles.barActive : styles.barInactive]} />
            <Text style={styles.dayLabel}>{day.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noteCard}>
        <View style={styles.noteIcon}>
          <Text style={styles.noteIconText}>◔</Text>
        </View>
        <View style={styles.noteTextWrap}>
          <Text style={styles.noteTitle}>{noteTitle}</Text>
          <Text style={styles.noteBody}>{noteBody}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    backgroundColor: "#12181D",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#3B3550",
    padding: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  historyText: {
    color: "#D8CCFF",
    fontSize: 11,
    fontWeight: "800",
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 2,
    paddingHorizontal: 2,
  },
  dayColumn: {
    alignItems: "center",
    gap: 7,
    width: 34,
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
  barActive: {
    height: 42,
    backgroundColor: "#9B8CFF",
  },
  barInactive: {
    height: 42,
    backgroundColor: "#171D22",
  },
  dayLabel: {
    color: "#8A94A6",
    fontSize: 11,
    fontWeight: "700",
  },
  noteCard: {
    backgroundColor: "#181426",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#7C6FB7",
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  noteIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#231D33",
    alignItems: "center",
    justifyContent: "center",
  },
  noteIconText: {
    color: "#D8CCFF",
    fontSize: 18,
    lineHeight: 18,
  },
  noteTextWrap: {
    flex: 1,
    gap: 3,
  },
  noteTitle: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "800",
  },
  noteBody: {
    color: "#A7B1C2",
    fontSize: 12,
    lineHeight: 18,
  },
});
