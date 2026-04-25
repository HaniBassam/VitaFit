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
        <Feather name="activity" size={17} color="#2FE0AF" />
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
    color: "#BFC4CE",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  nextPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#16745F",
    paddingHorizontal: 13,
    paddingVertical: 7,
    backgroundColor: "#10191C",
  },
  nextText: {
    color: "#2FE0AF",
    fontSize: 13,
    fontWeight: "800",
  },
});
