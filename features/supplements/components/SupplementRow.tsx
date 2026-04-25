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
          color={supplement.isTaken ? "#07110D" : "#C7CCD6"}
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#343948",
    backgroundColor: "#171A24",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 19,
  },
  rowTaken: {
    borderColor: "#126B59",
    backgroundColor: "#101F22",
  },
  iconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#303548",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapTaken: {
    backgroundColor: "#2FE0AF",
  },
  textWrap: {
    flex: 1,
    gap: 5,
  },
  name: {
    color: "#F4F5F8",
    fontSize: 19,
    fontWeight: "800",
  },
  dosage: {
    color: "#C6CBD5",
    fontSize: 16,
    fontWeight: "700",
  },
  toggle: {
    width: 61,
    height: 30,
    borderRadius: 999,
    backgroundColor: "#353A4A",
    padding: 4,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  toggleOn: {
    backgroundColor: "#2FE0AF",
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
