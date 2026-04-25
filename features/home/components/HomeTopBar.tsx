import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { BrandLogo } from "@/components/BrandLogo";

export function HomeTopBar() {
  return (
    <View style={styles.row}>
      <BrandLogo width={78} height={78} scale={2.15} style={styles.logoBox} />

      <Pressable style={styles.bellButton}>
        <Feather name="bell" size={18} color="#D8CCFF" />
        <View style={styles.bellDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoBox: {
    width: 64,
    height: 74,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#171425",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#7C6FB7",
  },
  bellDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#EF4444",
  },
});
