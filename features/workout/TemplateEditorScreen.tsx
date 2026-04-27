import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { WorkoutTemplateExerciseRow } from "@/features/workout/components/WorkoutTemplateExerciseRow";
import { workoutContent } from "@/features/workout/data/workoutContent";
import { useWorkout } from "@/features/workout/context/WorkoutContext";

export default function TemplateEditorScreen() {
  const router = useRouter();
  const {
    draft,
    editingTemplateId,
    updateDraftField,
    removeDraftExercise,
    addDraftExerciseSet,
    updateDraftExerciseSet,
    removeDraftExerciseSet,
    deleteDraft,
    saveDraft,
    cancelDraft,
  } = useWorkout();

  const exerciseCount = draft?.exercises.length ?? 0;
  const canSave = !!draft && draft.title.trim().length > 0 && draft.exercises.length > 0;

  if (!draft) {
    return (
      <View style={styles.safeArea}>
        <StatusBar style="light" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No draft open</Text>
          <Text style={styles.emptySubtitle}>
            Create a template from the workout page first.
          </Text>
          <Pressable onPress={() => router.replace("/workout")} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Back to Workout</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  async function handleSave() {
    if (await saveDraft()) {
      router.replace("/workout");
    }
  }

  function handleDelete() {
    Alert.alert(
      "Delete template?",
      "This will permanently remove the template and all of its exercises.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (await deleteDraft()) {
              router.replace("/workout");
            }
          },
        },
      ],
    );
  }

  function handleClose() {
    cancelDraft();
    router.replace("/workout");
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <Pressable onPress={handleClose} style={styles.headerAction}>
              <Text style={styles.headerActionText}>×</Text>
            </Pressable>
            <Text style={styles.pageTitle}>
              {editingTemplateId ? workoutContent.editTemplateTitle : workoutContent.newTemplateTitle}
            </Text>
            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              style={[styles.headerSave, !canSave && styles.headerSaveDisabled]}
            >
              <Text style={styles.headerSaveText}>
                {editingTemplateId ? workoutContent.updateTemplate : workoutContent.saveTemplate}
              </Text>
            </Pressable>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>{workoutContent.templateNameLabel}</Text>
            <TextInput
              value={draft.title}
              onChangeText={(text) => updateDraftField("title", text)}
              placeholder={workoutContent.templateNamePlaceholder}
              placeholderTextColor="#6B7280"
              style={styles.nameInput}
            />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{workoutContent.exercisesTitle}</Text>
            <View style={styles.countPill}>
              <Text style={styles.countText}>{exerciseCount} Total</Text>
            </View>
          </View>

          <View style={styles.exerciseList}>
            {exerciseCount === 0 ? (
              <View style={styles.emptyExercises}>
                <Text style={styles.emptyExercisesText}>
                  Add exercises from the library to build this template.
                </Text>
              </View>
            ) : null}

            {draft.exercises.map((exercise) => (
              <WorkoutTemplateExerciseRow
                key={exercise.id}
                exercise={exercise}
                isEditing
                onRemove={removeDraftExercise}
                onAddSet={addDraftExerciseSet}
                onUpdateSet={updateDraftExerciseSet}
                onRemoveSet={removeDraftExerciseSet}
              />
            ))}
          </View>

          <Pressable
            onPress={() => router.push("/exercise-library")}
            style={styles.addExercisesButton}
          >
            <Text style={styles.addExercisesButtonText}>
              + {workoutContent.addMoreExercises}
            </Text>
          </Pressable>

          <Pressable
            onPress={editingTemplateId ? handleDelete : handleSave}
            disabled={editingTemplateId ? false : !canSave}
            style={[
              styles.primaryButton,
              editingTemplateId ? styles.destructiveButton : null,
              !editingTemplateId && !canSave && styles.primaryButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.primaryButtonText,
                editingTemplateId && styles.destructiveButtonText,
              ]}
            >
              {editingTemplateId ? "Delete Template" : workoutContent.saveTemplate}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B1014",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#0B1014",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 36,
    gap: 18,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#151A22",
    alignItems: "center",
    justifyContent: "center",
  },
  headerActionText: {
    color: "#F8FAFC",
    fontSize: 28,
    lineHeight: 28,
    marginTop: -3,
  },
  pageTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "800",
  },
  headerSave: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#181426",
    borderWidth: 1,
    borderColor: "#7C6FB7",
  },
  headerSaveDisabled: {
    opacity: 0.5,
  },
  headerSaveText: {
    color: "#D8CCFF",
    fontSize: 13,
    fontWeight: "800",
  },
  sectionCard: {
    backgroundColor: "#151A22",
    borderRadius: 22,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#3B3550",
  },
  sectionLabel: {
    color: "#B0B8C7",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  nameInput: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "800",
    paddingVertical: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "800",
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#181426",
    borderWidth: 1,
    borderColor: "#7C6FB7",
  },
  countText: {
    color: "#D8CCFF",
    fontSize: 12,
    fontWeight: "800",
  },
  exerciseList: {
    gap: 12,
  },
  emptyExercises: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#10161D",
    borderWidth: 1,
    borderColor: "#4D4566",
  },
  emptyExercisesText: {
    color: "#A7B1C2",
    fontSize: 13,
    lineHeight: 19,
  },
  addExercisesButton: {
    minHeight: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#9B8CFF",
    backgroundColor: "#151A22",
  },
  addExercisesButtonText: {
    color: "#D8CCFF",
    fontSize: 15,
    fontWeight: "800",
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#9B8CFF",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  destructiveButton: {
    backgroundColor: "#24171A",
    borderWidth: 1,
    borderColor: "#4C2129",
  },
  destructiveButtonText: {
    color: "#FF6B81",
  },
  primaryButtonText: {
    color: "#141022",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: "#F8FAFC",
    fontSize: 24,
    fontWeight: "800",
  },
  emptySubtitle: {
    color: "#A7B1C2",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
});
