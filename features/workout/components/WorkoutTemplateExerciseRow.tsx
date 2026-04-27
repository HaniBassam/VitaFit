import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { TemplateExercise, TemplateExerciseSet } from "@/features/workout/types";

type WorkoutTemplateExerciseRowProps = {
  exercise: TemplateExercise;
  onRemove: (id: string) => void;
  onAddSet: (exerciseId: string) => void;
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    updates: Partial<TemplateExerciseSet>,
  ) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
  isEditing: boolean;
};

export function WorkoutTemplateExerciseRow({
  exercise,
  onRemove,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
  isEditing,
}: WorkoutTemplateExerciseRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{exercise.name}</Text>
          <Text style={styles.subtitle}>{exercise.muscleGroup}</Text>
        </View>

        <Pressable onPress={() => onRemove(exercise.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableLabel, styles.setColumn]}>Set</Text>
        <Text style={[styles.tableLabel, styles.repsColumn]}>Reps</Text>
        <Text style={[styles.tableLabel, styles.weightColumn]}>Weight (kg)</Text>
        <View style={styles.tableSpacer} />
      </View>

      <View style={styles.setList}>
        {exercise.exerciseSets.map((set) => (
          <View key={set.id} style={styles.setRow}>
            <View style={[styles.setBadge, !isEditing && styles.setBadgeLocked]}>
              <Text style={styles.setBadgeText}>{set.setNumber}</Text>
            </View>

            <TextInput
              value={set.reps}
              onChangeText={(text) => onUpdateSet(exercise.id, set.id, { reps: text })}
              editable={isEditing}
              keyboardType="numeric"
              placeholder="--"
              placeholderTextColor="#6B7280"
              style={[styles.setInput, styles.repsColumn, !isEditing && styles.inputLocked]}
            />

            <TextInput
              value={set.weightKg}
              onChangeText={(text) => onUpdateSet(exercise.id, set.id, { weightKg: text })}
              editable={isEditing}
              keyboardType="numeric"
              placeholder="--"
              placeholderTextColor="#6B7280"
              style={[styles.setInput, styles.weightColumn, !isEditing && styles.inputLocked]}
            />

            <Pressable
              onPress={() => onRemoveSet(exercise.id, set.id)}
              disabled={!isEditing}
              style={[styles.removeSetButton, !isEditing && styles.removeSetButtonLocked]}
            >
              <Text style={styles.removeSetText}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => onAddSet(exercise.id)}
        disabled={!isEditing}
        style={[styles.addSetButton, !isEditing && styles.addSetButtonLocked]}
      >
        <Text style={styles.addSetText}>+ Add Set</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#151A22",
    borderRadius: 20,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: "#3B3550",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  subtitle: {
    color: "#8A94A6",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#24171A",
    borderWidth: 1,
    borderColor: "#4C2129",
  },
  deleteText: {
    color: "#FF6B81",
    fontSize: 11,
    fontWeight: "800",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tableLabel: {
    color: "#B0B8C7",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  tableSpacer: {
    width: 28,
  },
  setColumn: {
    width: 46,
  },
  repsColumn: {
    flex: 1,
  },
  weightColumn: {
    flex: 1.1,
  },
  setList: {
    gap: 10,
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  setBadge: {
    width: 46,
    minHeight: 42,
    borderRadius: 12,
    backgroundColor: "#10161D",
    borderWidth: 1,
    borderColor: "#4D4566",
    alignItems: "center",
    justifyContent: "center",
  },
  setBadgeLocked: {
    opacity: 0.7,
  },
  setBadgeText: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "800",
  },
  setInput: {
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: "#10161D",
    borderWidth: 1,
    borderColor: "#4D4566",
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  inputLocked: {
    opacity: 0.6,
  },
  removeSetButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#24171A",
    borderWidth: 1,
    borderColor: "#4C2129",
    alignItems: "center",
    justifyContent: "center",
  },
  removeSetButtonLocked: {
    opacity: 0.45,
  },
  removeSetText: {
    color: "#FF6B81",
    fontSize: 18,
    fontWeight: "900",
    marginTop: -2,
  },
  addSetButton: {
    minHeight: 44,
    borderRadius: 14,
    backgroundColor: "#10161D",
    borderWidth: 1,
    borderColor: "#4D4566",
    alignItems: "center",
    justifyContent: "center",
  },
  addSetButtonLocked: {
    opacity: 0.55,
  },
  addSetText: {
    color: "#D8CCFF",
    fontSize: 14,
    fontWeight: "800",
  },
});
