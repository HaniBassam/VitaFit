import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import type { TemplateExercise } from "@/features/workout/types";

type WorkoutTemplateExerciseRowProps = {
  exercise: TemplateExercise;
  onChangeExercise: (id: string, updates: Partial<TemplateExercise>) => void;
  onRemove: (id: string) => void;
  isEditing: boolean;
};

export function WorkoutTemplateExerciseRow({
  exercise,
  onChangeExercise,
  onRemove,
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

      <View style={styles.inputsRow}>
        <TemplateInput
          label="Sets"
          value={exercise.sets}
          editable={isEditing}
          onChangeText={(text) => onChangeExercise(exercise.id, { sets: text })}
        />
        <TemplateInput
          label="Reps"
          value={exercise.reps}
          editable={isEditing}
          onChangeText={(text) => onChangeExercise(exercise.id, { reps: text })}
        />
        <TemplateInput
          label="Weight (kg)"
          value={exercise.weight}
          editable={isEditing}
          onChangeText={(text) => onChangeExercise(exercise.id, { weight: text })}
          placeholder="--"
        />
      </View>
    </View>
  );
}

function TemplateInput({
  label,
  value,
  onChangeText,
  editable,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  editable: boolean;
  placeholder?: string;
}) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        keyboardType="numeric"
        style={[styles.input, !editable && styles.inputLocked]}
      />
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
    borderColor: "#24303A",
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
  inputsRow: {
    flexDirection: "row",
    gap: 10,
  },
  inputBlock: {
    flex: 1,
    gap: 6,
  },
  inputLabel: {
    color: "#B0B8C7",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    minHeight: 42,
    borderRadius: 14,
    backgroundColor: "#10161D",
    borderWidth: 1,
    borderColor: "#24303A",
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  inputLocked: {
    opacity: 0.6,
  },
});
