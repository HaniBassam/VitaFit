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
      style={[styles.card, completed && styles.cardCompleted]}
    >
      <View style={styles.icon}>
        <Text style={styles.iconText}>⟲</Text>
      </View>

      <View style={styles.textWrap}>
        <Text style={[styles.name, completed && styles.completedText]}>{exercise.name}</Text>
        <Text style={styles.meta}>
          {exercise.sets} sets · {exercise.reps} reps
        </Text>
      </View>

      <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
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
    borderColor: "#24303A",
  },
  cardCompleted: {
    borderColor: "#36D280",
    backgroundColor: "#10241F",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#173528",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    color: "#36D280",
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
  completedText: {
    textDecorationLine: "line-through",
    color: "#9FB3A9",
  },
  meta: {
    color: "#A7B1C2",
    fontSize: 12,
    fontWeight: "600",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#364154",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#36D280",
    borderColor: "#36D280",
  },
  checkboxText: {
    color: "#07110D",
    fontSize: 14,
    fontWeight: "900",
  },
});
