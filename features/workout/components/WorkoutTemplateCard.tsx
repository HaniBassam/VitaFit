import { Pressable, StyleSheet, Text, View } from "react-native";

import type { WorkoutTemplate } from "@/features/workout/types";

type WorkoutTemplateCardProps = {
  template: WorkoutTemplate;
  onPress?: () => void;
  selected?: boolean;
};

export function WorkoutTemplateCard({ template, onPress, selected = false }: WorkoutTemplateCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{template.title}</Text>
          <Text style={styles.meta}>
            {template.category} • {template.durationMinutes} min
          </Text>
        </View>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{template.exercises.length} exercises</Text>
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
    borderColor: "#24303A",
  },
  cardSelected: {
    borderColor: "#36D280",
    backgroundColor: "#10241F",
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
    color: "#8A94A6",
    fontSize: 12,
    fontWeight: "600",
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#10241F",
    borderWidth: 1,
    borderColor: "#1E5C49",
  },
  countPillText: {
    color: "#59D8A3",
    fontSize: 11,
    fontWeight: "800",
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
