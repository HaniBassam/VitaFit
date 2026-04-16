import { Pressable, StyleSheet, Text, View } from "react-native";

import { homeContent } from "@/data/homeContent";

export function WeeklyProgressSection() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{homeContent.weeklyProgressTitle}</Text>
        <Pressable>
          <Text style={styles.historyText}>{homeContent.weeklyHistoryLabel} ›</Text>
        </Pressable>
      </View>

      <View style={styles.barsRow}>
        {homeContent.weeklyDays.map((day, index) => (
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
          <Text style={styles.noteTitle}>{homeContent.noteTitle}</Text>
          <Text style={styles.noteBody}>{homeContent.noteBody}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#E5E7EB",
    fontSize: 18,
    fontWeight: "800",
  },
  historyText: {
    color: "#59D8A3",
    fontSize: 12,
    fontWeight: "800",
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  dayColumn: {
    alignItems: "center",
    gap: 8,
    width: 36,
  },
  bar: {
    width: 22,
    borderRadius: 10,
  },
  barActive: {
    height: 40,
    backgroundColor: "#59D8A3",
  },
  barInactive: {
    height: 40,
    backgroundColor: "#171D22",
  },
  dayLabel: {
    color: "#8A94A6",
    fontSize: 12,
    fontWeight: "700",
  },
  noteCard: {
    backgroundColor: "#12201B",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1C332A",
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  noteIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#173528",
    alignItems: "center",
    justifyContent: "center",
  },
  noteIconText: {
    color: "#59D8A3",
    fontSize: 18,
    lineHeight: 18,
  },
  noteTextWrap: {
    flex: 1,
    gap: 3,
  },
  noteTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  noteBody: {
    color: "#A7B1C2",
    fontSize: 13,
    lineHeight: 19,
  },
});
