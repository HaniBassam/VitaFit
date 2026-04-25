import { StyleSheet, Text, View } from "react-native";

import { profileContent } from "@/features/profile/data/profileContent";

export function ProfileStats({
  bmi,
  filledFields,
  totalFields,
}: {
  bmi: string;
  filledFields: number;
  totalFields: number;
}) {
  return (
    <View style={styles.metricRow}>
      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>{profileContent.stats.bmiLabel}</Text>
        <Text style={styles.metricValue}>{bmi}</Text>
        <Text style={styles.metricHelper}>{profileContent.stats.bmiHelper}</Text>
      </View>

      <View style={styles.metricCard}>
        <Text style={styles.metricLabel}>
          {profileContent.stats.completionLabel}
        </Text>
        <Text style={styles.metricValue}>
          {filledFields}/{totalFields}
        </Text>
        <Text style={styles.metricHelper}>
          {profileContent.stats.completionHelper}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
    paddingHorizontal: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#151A22",
    borderRadius: 16,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "#4D4566",
  },
  metricLabel: {
    color: "#B0B8C7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  metricValue: {
    color: "#D8CCFF",
    fontSize: 22,
    fontWeight: "800",
  },
  metricHelper: {
    color: "#D4D8E1",
    fontSize: 12,
  },
});
