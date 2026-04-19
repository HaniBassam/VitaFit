import { StyleSheet, Text, View } from "react-native";

import { profileContent } from "@/features/profile/data/profileContent";

export function ProfileStats() {
  return (
    <View style={styles.metricRow}>
      {profileContent.metrics.map((metric) => (
        <View key={metric.label} style={styles.metricCard}>
          <Text style={styles.metricLabel}>{metric.label}</Text>
          <Text style={styles.metricValue}>{metric.value}</Text>
          <Text style={styles.metricHelper}>{metric.helper}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#151A22",
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  metricLabel: {
    color: "#B0B8C7",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  metricValue: {
    color: "#31D9A6",
    fontSize: 22,
    fontWeight: "800",
  },
  metricHelper: {
    color: "#D4D8E1",
    fontSize: 12,
  },
});
