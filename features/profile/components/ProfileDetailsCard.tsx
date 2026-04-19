import { StyleSheet, Text, View } from "react-native";

import { profileContent } from "@/features/profile/data/profileContent";

function DetailRow({
  label,
  value,
  hasBorder = true,
}: {
  label: string;
  value: string;
  hasBorder?: boolean;
}) {
  return (
    <View
      style={[
        styles.detailRow,
        hasBorder ? styles.rowBorder : styles.rowNoBorder,
      ]}
    >
      <View style={styles.detailLeft}>
        <View style={styles.detailIcon}>
          <Text style={styles.detailIconText}>•</Text>
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>

      <View style={styles.detailRight}>
        <Text style={styles.detailValue}>{value}</Text>
        <Text style={styles.detailChevron}>⌁</Text>
      </View>
    </View>
  );
}

export function ProfileDetailsCard() {
  return (
    <View style={styles.detailsCard}>
      <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>

      {profileContent.details.map((detail, index) => (
        <DetailRow
          key={detail.label}
          label={detail.label}
          value={detail.value}
          hasBorder={index !== profileContent.details.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  detailsCard: {
    backgroundColor: "#151A22",
    borderRadius: 22,
    padding: 16,
    gap: 2,
  },
  sectionTitle: {
    color: "#B0B8C7",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  detailRow: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowBorder: {
    marginBottom: 12,
  },
  rowNoBorder: {
    borderBottomWidth: 0,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#1E242F",
    alignItems: "center",
    justifyContent: "center",
  },
  detailIconText: {
    color: "#31D9A6",
    fontSize: 18,
    fontWeight: "900",
  },
  detailLabel: {
    color: "#D8DDE6",
    fontSize: 16,
    fontWeight: "700",
  },
  detailRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailValue: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "800",
  },
  detailChevron: {
    color: "#7F8A9F",
    fontSize: 17,
    fontWeight: "800",
  },
});
