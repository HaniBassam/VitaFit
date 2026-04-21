import { StyleSheet, Text, View } from "react-native";

import { profileContent } from "@/features/profile/data/profileContent";

function ActionRow({
  label,
  danger = false,
}: {
  label: string;
  danger?: boolean;
}) {
  return (
    <View style={[styles.actionRow, danger && styles.actionRowDanger]}>
      <View style={styles.detailLeft}>
        <View style={[styles.actionIcon, danger && styles.actionIconDanger]}>
          <Text style={[styles.actionIconText, danger && styles.actionIconTextDanger]}>
            {danger ? "↗" : "⌁"}
          </Text>
        </View>
        <Text style={[styles.actionLabel, danger && styles.actionLabelDanger]}>
          {label}
        </Text>
      </View>

      <Text style={[styles.actionChevron, danger && styles.actionChevronDanger]}>
        {danger ? "" : "›"}
      </Text>
    </View>
  );
}

export function ProfileActions() {
  return (
    <View style={styles.actionCard}>
      <ActionRow label={profileContent.actions[0]} />
      <ActionRow label={profileContent.actions[1]} />
      <ActionRow label={profileContent.actions[2]} danger />
    </View>
  );
}

const styles = StyleSheet.create({
  actionCard: {
    backgroundColor: "#151A22",
    borderRadius: 18,
    overflow: "hidden",
  },
  actionRow: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  actionRowDanger: {
    marginBottom: 0,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#1E242F",
    alignItems: "center",
    justifyContent: "center",
  },
  actionIconDanger: {
    backgroundColor: "#24171A",
  },
  actionIconText: {
    color: "#D8DDE6",
    fontSize: 15,
    fontWeight: "800",
  },
  actionIconTextDanger: {
    color: "#FF6B81",
  },
  actionLabel: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
  },
  actionLabelDanger: {
    color: "#FF6B81",
  },
  actionChevron: {
    color: "#7F8A9F",
    fontSize: 22,
    fontWeight: "700",
  },
  actionChevronDanger: {
    color: "#FF6B81",
  },
});
