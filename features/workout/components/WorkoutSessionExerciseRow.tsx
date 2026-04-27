import { Pressable, StyleSheet, Text, View } from "react-native";

import type { TemplateExercise } from "@/features/workout/types";

type WorkoutSessionExerciseRowProps = {
  exercise: TemplateExercise;
  completed: boolean;
  onToggle: (id: string) => void;
};

export function WorkoutSessionExerciseRow({
  exercise,
  completed,
  onToggle,
}: WorkoutSessionExerciseRowProps) {
  return (
    <Pressable
      onPress={() => onToggle(exercise.id)}
      style={styles.card}
    >
      <View style={styles.icon}>
        <Text style={styles.iconText}>⟲</Text>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.name}>{exercise.name}</Text>
        <Text style={styles.meta}>
          {exercise.sets} sets · {exercise.reps} reps
          {exercise.weight ? ` · ${exercise.weight} kg` : ""}
        </Text>
        {completed ? (
          <View style={styles.setList}>
            {exercise.exerciseSets.map((set) => (
              <Text key={set.id} style={styles.setLine}>
                Set {set.setNumber} · {set.reps || "--"} reps
                {set.weightKg ? ` · ${set.weightKg} kg` : ""}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.checkbox}>
        <Text style={styles.checkboxText}>{completed ? "✓" : ""}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#151A22",
    borderWidth: 1,
    borderColor: "#3B3550",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#231D33",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#D8CCFF",
    fontSize: 18,
    fontWeight: "800",
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "800",
  },
  meta: {
    color: "#A7B1C2",
    fontSize: 12,
    fontWeight: "600",
  },
  setList: {
    gap: 2,
    marginTop: 2,
  },
  setLine: {
    color: "#D8CCFF",
    fontSize: 12,
    fontWeight: "700",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4D4566",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxText: {
    color: "#D8CCFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
