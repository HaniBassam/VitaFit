import { Pressable, StyleSheet, Text, View } from "react-native";

import type { WorkoutTemplate } from "@/features/workout/types";

type WorkoutTemplateCardProps = {
  template?: WorkoutTemplate;
  onPress?: () => void;
  selected?: boolean;
  completedToday?: boolean;
  variant?: "template" | "create";
};

export function WorkoutTemplateCard({
  template,
  onPress,
  selected = false,
  completedToday = false,
  variant = "template",
}: WorkoutTemplateCardProps) {
  if (variant === "create") {
    return (
      <Pressable onPress={onPress} style={[styles.card, styles.createCard]}>
        <View style={styles.createTextBlock}>
          <Text style={styles.createTitle}>Create Template</Text>
          <Text style={styles.createMeta}>Add a new workout routine</Text>
        </View>
      </Pressable>
    );
  }

  if (!template) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        selected && styles.cardSelected,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{template.title}</Text>
          <Text style={styles.meta}>
            {template.category} • {template.durationMinutes} min
          </Text>
        </View>
        <View style={styles.countPill}>
          <Text
            style={[
              styles.countPillText,
              completedToday && styles.countPillTextCompleted,
            ]}
          >
            {completedToday ? "Done today" : `${template.exercises.length} exercises`}
          </Text>
        </View>
      </View>

      <View style={styles.exercisePreview}>
        {template.exercises.slice(0, 3).map((exercise) => (
          <Text key={exercise.id} style={styles.exerciseLine}>
            {exercise.name} • {exercise.sets} x {exercise.reps}
          </Text>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    flexShrink: 0,
    alignSelf: "flex-start",
    minHeight: 176,
    backgroundColor: "#151A22",
    borderRadius: 22,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#3B3550",
  },
  cardSelected: {
    borderColor: "#9B8CFF",
  },
  createCard: {
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#12181D",
  },
  createIcon: {
    color: "#D8CCFF",
    fontSize: 44,
    fontWeight: "700",
    marginTop: -4,
  },
  createTextBlock: {
    alignItems: "center",
    gap: 4,
  },
  createTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  createMeta: {
    color: "#A8A0C8",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  titleBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  meta: {
    color: "#A8A0C8",
    fontSize: 12,
    fontWeight: "600",
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#181426",
    borderWidth: 1,
    borderColor: "#5D5578",
    opacity: 0.9,
  },
  countPillText: {
    color: "#C7BDF5",
    fontSize: 10,
    fontWeight: "800",
  },
  countPillTextCompleted: {
    color: "#A7F3D0",
  },
  exercisePreview: {
    gap: 6,
    marginTop: 2,
  },
  exerciseLine: {
    color: "#C7D0DB",
    fontSize: 13,
  },
});
