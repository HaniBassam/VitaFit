import { StyleSheet, Text, View } from "react-native";

export default function SupplementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supplements</Text>
      <Text style={styles.text}>Supplements screen will be built next.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#0B1014",
  },
  title: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "800",
  },
  text: {
    color: "#A7B1C2",
    fontSize: 14,
  },
});
