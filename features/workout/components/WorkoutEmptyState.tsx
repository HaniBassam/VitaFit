import { Pressable, StyleSheet, Text, View } from "react-native";

import { workoutContent } from "@/features/workout/data/workoutContent";

type WorkoutEmptyStateProps = {
  onCreateTemplate: () => void;
};

export function WorkoutEmptyState({ onCreateTemplate }: WorkoutEmptyStateProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.iconCard}>
        <Text style={styles.iconText}>🏋</Text>
      </View>
      <Text style={styles.title}>{workoutContent.emptyTitle}</Text>
      <Text style={styles.subtitle}>{workoutContent.emptySubtitle}</Text>

      <Pressable onPress={onCreateTemplate} style={styles.button}>
        <Text style={styles.buttonText}>+ {workoutContent.createTemplate}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 18,
  },
  iconCard: {
    width: 108,
    height: 108,
    borderRadius: 22,
    backgroundColor: "#151A22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#7C6FB7",
  },
  iconText: {
    fontSize: 34,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#A7B1C2",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 290,
  },
  button: {
    marginTop: 10,
    minHeight: 54,
    width: "100%",
    borderRadius: 18,
    backgroundColor: "#9B8CFF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#141022",
    fontSize: 16,
    fontWeight: "800",
  },
});
