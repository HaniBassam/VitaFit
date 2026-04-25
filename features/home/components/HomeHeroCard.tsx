import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type HomeHeroCardProps = {
  displayName: string;
  dateText: string;
  profileValue: string;
  profileMeta: string;
  workoutValue: string;
  workoutMeta: string;
  supplementsValue: string;
  supplementsMeta: string;
};

export function HomeHeroCard({
  displayName,
  dateText,
  profileValue,
  profileMeta,
  workoutValue,
  workoutMeta,
  supplementsValue,
  supplementsMeta,
}: HomeHeroCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>TODAY AT A GLANCE</Text>
          <Text style={styles.title}>Hi, {displayName}</Text>
          <Text style={styles.subtitle}>Profile, workout, and supplements in one place.</Text>
        </View>

        <View style={styles.datePill}>
          <Feather name="calendar" size={12} color="#D8CCFF" />
          <Text style={styles.dateText}>{dateText}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <SummaryPill icon="user" label="PROFILE" value={profileValue} meta={profileMeta} />
        <SummaryPill icon="activity" label="WORKOUT" value={workoutValue} meta={workoutMeta} />
        <SummaryPill
          icon="droplet"
          label="SUPPS"
          value={supplementsValue}
          meta={supplementsMeta}
        />
      </View>
    </View>
  );
}

function SummaryPill({
  icon,
  label,
  value,
  meta,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricHeader}>
        <Feather name={icon} size={13} color="#D8CCFF" />
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text style={styles.metricValue} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.metricMeta} numberOfLines={1}>
        {meta}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#3B3550",
    backgroundColor: "#12181D",
    padding: 18,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 3,
  },
  kicker: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },
  subtitle: {
    color: "#A8A0C8",
    fontSize: 12,
    lineHeight: 16,
  },
  datePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#181426",
    borderWidth: 1,
    borderColor: "#7C6FB7",
  },
  dateText: {
    color: "#D8CCFF",
    fontSize: 11,
    fontWeight: "800",
  },
  grid: {
    flexDirection: "row",
    gap: 8,
  },
  metricCard: {
    flex: 1,
    minHeight: 84,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#4D4566",
    backgroundColor: "#181426",
    padding: 10,
    gap: 6,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricLabel: {
    color: "#94A3B8",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  metricValue: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18,
  },
  metricMeta: {
    color: "#A8A0C8",
    fontSize: 10,
    lineHeight: 14,
    fontWeight: "700",
  },
});
