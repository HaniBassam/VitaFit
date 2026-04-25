import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { supplementContent } from "@/features/supplements/data/supplementContent";

export function SupplementEmptyState() {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Feather name="droplet" size={26} color="#D8CCFF" />
      </View>
      <Text style={styles.title}>{supplementContent.emptyTitle}</Text>
      <Text style={styles.subtitle}>{supplementContent.emptySubtitle}</Text>
      <Text style={styles.hint}>{supplementContent.seedHint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#3B3550",
    backgroundColor: "#12181D",
    padding: 22,
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#181426",
    borderWidth: 1,
    borderColor: "#7C6FB7",
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
    color: "#A8A0C8",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  hint: {
    color: "#D8CCFF",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
});
