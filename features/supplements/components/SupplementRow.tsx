import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { DailySupplement } from "@/features/supplements/types";

type SupplementRowProps = {
  supplement: DailySupplement;
  onToggle: (supplement: DailySupplement) => void;
};

export function SupplementRow({ supplement, onToggle }: SupplementRowProps) {
  return (
    <Pressable
      onPress={() => onToggle(supplement)}
      style={[styles.row, supplement.isTaken && styles.rowTaken]}
    >
      <View style={[styles.iconWrap, supplement.isTaken && styles.iconWrapTaken]}>
        <Feather
          name="link-2"
          size={30}
          color={supplement.isTaken ? "#D8CCFF" : "#D8CCFF"}
        />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.name}>{supplement.name}</Text>
        <Text style={styles.dosage}>
          {supplement.dosage} {supplement.unit}
        </Text>
      </View>

      <View style={[styles.toggle, supplement.isTaken && styles.toggleOn]}>
        <View style={[styles.knob, supplement.isTaken && styles.knobOn]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 104,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#3B3550",
    backgroundColor: "#151A22",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rowTaken: {
    borderColor: "#7C6FB7",
    backgroundColor: "#181426",
  },
  iconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#231D33",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapTaken: {
    borderWidth: 1,
    borderColor: "#7C6FB7",
  },
  textWrap: {
    flex: 1,
    gap: 5,
  },
  name: {
    color: "#F4F5F8",
    fontSize: 18,
    fontWeight: "800",
  },
  dosage: {
    color: "#A8A0C8",
    fontSize: 13,
    fontWeight: "700",
  },
  toggle: {
    width: 61,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#2A2F3C",
    padding: 4,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  toggleOn: {
    backgroundColor: "#9B8CFF",
    alignItems: "flex-end",
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F4F5F8",
  },
  knobOn: {
    backgroundColor: "#F4F5F8",
  },
});
