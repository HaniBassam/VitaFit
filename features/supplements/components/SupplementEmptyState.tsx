import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { supplementContent } from "@/features/supplements/data/supplementContent";

export function SupplementEmptyState() {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Feather name="droplet" size={26} color="#2FE0AF" />
      </View>
      <Text style={styles.title}>{supplementContent.emptyTitle}</Text>
      <Text style={styles.subtitle}>{supplementContent.emptySubtitle}</Text>
      <Text style={styles.hint}>{supplementContent.seedHint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#24303A",
    backgroundColor: "#151A22",
    padding: 22,
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#10241F",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#A7B1C2",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  hint: {
    color: "#2FE0AF",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
});
