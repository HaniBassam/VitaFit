import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { supplementContent } from "@/features/supplements/data/supplementContent";

type SupplementSectionHeaderProps = {
  nextTime: string;
};

export function SupplementSectionHeader({ nextTime }: SupplementSectionHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Feather name="activity" size={17} color="#D8CCFF" />
        <Text style={styles.title}>{supplementContent.stackTitle}</Text>
      </View>

      <View style={styles.nextPill}>
        <Text style={styles.nextText}>
          {supplementContent.nextLabel}: {nextTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  titleRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  title: {
    color: "#94A3B8",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  nextPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#7C6FB7",
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: "#181426",
  },
  nextText: {
    color: "#D8CCFF",
    fontSize: 12,
    fontWeight: "800",
  },
});
