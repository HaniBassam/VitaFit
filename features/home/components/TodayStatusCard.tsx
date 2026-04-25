import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TodayStatusCardProps = {
  completionLabel: string;
  workoutTitle: string;
  workoutSubtitle: string;
  workoutDone: boolean;
  supplementsTitle: string;
  supplementsSubtitle: string;
  supplementsDone: boolean;
  workoutActionLabel: string;
  supplementsActionLabel: string;
};

function StatusRow({
  icon,
  title,
  subtitle,
  done,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  done: boolean;
}) {
  return (
    <View style={styles.statusRow}>
      <View style={styles.statusLeft}>
        <View style={styles.iconWrap}>
          <Feather name={icon} size={16} color="#D8CCFF" />
        </View>
        <View style={styles.statusTextWrap}>
          <Text style={styles.statusTitle}>{title}</Text>
          <Text style={styles.statusSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.statusRight}>
        <Ionicons
          name={done ? "checkmark-circle-outline" : "ellipse-outline"}
          size={22}
          color={done ? "#D8CCFF" : "#4B5563"}
        />
      </View>
    </View>
  );
}

export function TodayStatusCard({
  completionLabel,
  workoutTitle,
  workoutSubtitle,
  workoutDone,
  supplementsTitle,
  supplementsSubtitle,
  supplementsDone,
  workoutActionLabel,
  supplementsActionLabel,
}: TodayStatusCardProps) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Feather name="activity" size={16} color="#D8CCFF" />
          <Text style={styles.headerTitle}>TODAY STATUS</Text>
        </View>
        <View style={styles.completionPill}>
          <Text style={styles.completionText}>{completionLabel}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <StatusRow
        icon="repeat"
        title={workoutTitle}
        subtitle={workoutSubtitle}
        done={workoutDone}
      />

      <View style={styles.rowDivider} />

      <StatusRow
        icon="link"
        title={supplementsTitle}
        subtitle={supplementsSubtitle}
        done={supplementsDone}
      />

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.actionButton, styles.actionPrimary]}
          onPress={() => router.push("/workout")}
        >
          <Feather name="activity" size={16} color="#141022" />
          <Text style={[styles.actionText, styles.actionPrimaryText]}>
            {workoutActionLabel}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.actionSecondary]}
          onPress={() => router.push("/supplements")}
        >
          <Feather name="link" size={16} color="#D8CCFF" />
          <Text style={styles.actionText}>{supplementsActionLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#12181D",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#3B3550",
    padding: 18,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  completionPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#181426",
    borderWidth: 1,
    borderColor: "#7C6FB7",
  },
  completionText: {
    color: "#D8CCFF",
    fontSize: 12,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: "#1D252B",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  statusLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#231D33",
    alignItems: "center",
    justifyContent: "center",
  },
  statusTextWrap: {
    gap: 2,
    flex: 1,
  },
  statusTitle: {
    color: "#F8FAFC",
    fontSize: 17,
    fontWeight: "800",
  },
  statusSubtitle: {
    color: "#8A94A6",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statusRight: {
    width: 26,
    alignItems: "flex-end",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#1D252B",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
  },
  actionPrimary: {
    backgroundColor: "#9B8CFF",
  },
  actionSecondary: {
    backgroundColor: "#0F171B",
    borderWidth: 1,
    borderColor: "#7C6FB7",
  },
  actionText: {
    color: "#D8CCFF",
    fontSize: 13,
    fontWeight: "800",
  },
  actionPrimaryText: {
    color: "#141022",
  },
});
