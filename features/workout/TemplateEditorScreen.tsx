import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { WorkoutTemplateExerciseRow } from "@/features/workout/components/WorkoutTemplateExerciseRow";
import { workoutContent } from "@/features/workout/data/workoutContent";
import { useWorkout } from "@/features/workout/context/WorkoutContext";

export default function TemplateEditorScreen() {
  const router = useRouter();
  const {
    draft,
    updateDraftField,
    updateDraftExercise,
    removeDraftExercise,
    saveDraft,
    cancelDraft,
  } = useWorkout();

  const exerciseCount = draft?.exercises.length ?? 0;
  const canSave = useMemo(() => {
    if (!draft) {
      return false;
    }

    return draft.title.trim().length > 0 && draft.exercises.length > 0;
  }, [draft]);

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

  function handleClose() {
    cancelDraft();
    router.replace("/workout");
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={handleClose} style={styles.headerAction}>
            <Text style={styles.headerActionText}>×</Text>
          </Pressable>
          <Text style={styles.pageTitle}>{workoutContent.newTemplateTitle}</Text>
          <Pressable
            onPress={handleSave}
            disabled={!canSave}
            style={[styles.headerSave, !canSave && styles.headerSaveDisabled]}
          >
            <Text style={styles.headerSaveText}>Save</Text>
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

          <View style={styles.metaRow}>
            <MetaPill label="Duration" value={`${draft.durationMinutes} min`} />
            <MetaPill label="Focus" value={draft.category} />
          </View>
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
              onChangeExercise={updateDraftExercise}
              onRemove={removeDraftExercise}
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

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>⚡</Text>
          <View style={styles.tipTextWrap}>
            <Text style={styles.tipTitle}>Pro Tip</Text>
            <Text style={styles.tipBody}>
              Add rest periods between exercises to get more accurate workout duration tracking.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={[styles.primaryButton, !canSave && styles.primaryButtonDisabled]}
        >
          <Text style={styles.primaryButtonText}>{workoutContent.saveTemplate}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaPill}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0B1014",
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#0B1014",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 18,
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
    backgroundColor: "#10241F",
    borderWidth: 1,
    borderColor: "#1E5C49",
  },
  headerSaveDisabled: {
    opacity: 0.5,
  },
  headerSaveText: {
    color: "#59D8A3",
    fontSize: 13,
    fontWeight: "800",
  },
  sectionCard: {
    backgroundColor: "#151A22",
    borderRadius: 22,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "#24303A",
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
  metaRow: {
    flexDirection: "row",
    gap: 10,
  },
  metaPill: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#10161D",
    borderWidth: 1,
    borderColor: "#24303A",
    gap: 4,
  },
  metaLabel: {
    color: "#8A94A6",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  metaValue: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "700",
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
    backgroundColor: "#364154",
  },
  countText: {
    color: "#F8FAFC",
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
    borderColor: "#24303A",
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
    borderColor: "#7C6FB7",
    backgroundColor: "#151A22",
  },
  addExercisesButtonText: {
    color: "#D8CCFF",
    fontSize: 15,
    fontWeight: "800",
  },
  tipCard: {
    backgroundColor: "#151A22",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#24303A",
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#173528",
    color: "#59D8A3",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    overflow: "hidden",
  },
  tipTextWrap: {
    flex: 1,
    gap: 4,
  },
  tipTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  tipBody: {
    color: "#A7B1C2",
    fontSize: 13,
    lineHeight: 19,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#36D280",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  primaryButtonText: {
    color: "#07110D",
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
