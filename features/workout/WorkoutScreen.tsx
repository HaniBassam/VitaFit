import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { WorkoutEmptyState } from "@/features/workout/components/WorkoutEmptyState";
import { WorkoutTemplateCard } from "@/features/workout/components/WorkoutTemplateCard";
import { WorkoutProgressCard } from "@/features/workout/components/WorkoutProgressCard";
import { WorkoutSessionExerciseRow } from "@/features/workout/components/WorkoutSessionExerciseRow";
import { workoutContent } from "@/features/workout/data/workoutContent";
import { useWorkout } from "@/features/workout/context/WorkoutContext";

export default function WorkoutScreen() {
  const router = useRouter();
  const {
    templates,
    loading,
    activeTemplateId,
    completedExerciseIds,
    completedTodayPlanIds,
    startEditingTemplate,
    startNewDraft,
    startWorkout,
    completeWorkout,
    toggleWorkoutExercise,
  } = useWorkout();

  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [congratsTitle, setCongratsTitle] = useState("");
  const completionLockRef = useRef<string | null>(null);

  const activeTemplate = templates.find((template) => template.id === activeTemplateId) ?? null;
  const completedSet = new Set(completedExerciseIds);
  const isCompletedToday = activeTemplate
    ? completedTodayPlanIds.includes(activeTemplate.id)
    : false;

  useEffect(() => {
    if (!activeTemplateId && templates[0]) {
      startWorkout(templates[0].id);
    }
  }, [activeTemplateId, startWorkout, templates]);

  function handleCreateTemplate() {
    startNewDraft();
    router.push("/workout-template");
  }

  function handleTemplatePress(templateId: string) {
    startWorkout(templateId);
  }

  function handleEditTemplate(templateId: string) {
    startEditingTemplate(templateId);
    router.push("/workout-template");
  }

  async function handleCompleteWorkout() {
    if (!activeTemplate || isCompletedToday) {
      return;
    }

    if (completedSet.size !== activeTemplate.exercises.length || activeTemplate.exercises.length === 0) {
      return;
    }

    if (completionLockRef.current === activeTemplate.id) {
      return;
    }

    completionLockRef.current = activeTemplate.id;
    const wasSaved = await completeWorkout();

    if (wasSaved) {
      setCongratsTitle(activeTemplate.title);
      setShowCongratsModal(true);
    } else {
      completionLockRef.current = null;
    }
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>{workoutContent.title}</Text>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>Loading templates...</Text>
          </View>
        ) : templates.length === 0 ? (
          <WorkoutEmptyState onCreateTemplate={handleCreateTemplate} />
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templateRow}
            >
              {templates.map((template) => (
                <WorkoutTemplateCard
                  key={template.id}
                  template={template}
                  selected={template.id === activeTemplate?.id}
                  completedToday={completedTodayPlanIds.includes(template.id)}
                  onPress={() => handleTemplatePress(template.id)}
                />
              ))}

              <WorkoutTemplateCard
                variant="create"
                onPress={handleCreateTemplate}
              />
            </ScrollView>

            {activeTemplate ? (
              isCompletedToday ? (
                <View style={styles.completedBlock}>
                  <WorkoutProgressCard
                    title={activeTemplate.title}
                    completed={activeTemplate.exercises.length}
                    total={activeTemplate.exercises.length}
                  />

                  <View style={styles.completedCard}>
                    <Text style={styles.completedTitle}>{workoutContent.completedTodayLabel}</Text>
                    <Text style={styles.completedSubtitle}>
                      {workoutContent.completedTodayHelper}
                    </Text>

                    <View style={styles.completedExerciseList}>
                      {activeTemplate.exercises.map((exercise) => (
                        <View key={exercise.id} style={styles.completedExerciseCard}>
                          <Text style={styles.completedExerciseName}>{exercise.name}</Text>

                          <View style={styles.completedExerciseSets}>
                            {exercise.exerciseSets.map((set) => (
                              <Text key={set.id} style={styles.completedExerciseSetLine}>
                                Set {set.setNumber} · {set.reps || "--"} reps
                                {set.weightKg ? ` · ${set.weightKg} kg` : ""}
                              </Text>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>

                    <Pressable
                      onPress={() => handleEditTemplate(activeTemplate.id)}
                      style={styles.editButton}
                    >
                      <Text style={styles.editButtonText}>{workoutContent.editTemplate}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={styles.sessionBlock}>
                  <WorkoutProgressCard
                    title={`Active: ${activeTemplate.title}`}
                    completed={completedSet.size}
                    total={activeTemplate.exercises.length}
                  />

                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Exercises List</Text>
                    <Text style={styles.sectionCount}>
                      {completedSet.size} / {activeTemplate.exercises.length}
                    </Text>
                  </View>

                  <View style={styles.sessionList}>
                    {activeTemplate.exercises.map((exercise) => (
                      <WorkoutSessionExerciseRow
                        key={exercise.id}
                        exercise={exercise}
                        completed={completedSet.has(exercise.id)}
                        onToggle={toggleWorkoutExercise}
                      />
                    ))}
                  </View>

                  <Pressable
                    onPress={() => handleEditTemplate(activeTemplate.id)}
                    style={styles.secondaryButton}
                  >
                    <Text style={styles.secondaryButtonText}>
                      {workoutContent.editTemplate}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleCompleteWorkout}
                    disabled={
                      completedSet.size !== activeTemplate.exercises.length ||
                      activeTemplate.exercises.length === 0
                    }
                    style={[
                      styles.completeButton,
                      (completedSet.size !== activeTemplate.exercises.length ||
                        activeTemplate.exercises.length === 0) &&
                        styles.completeButtonDisabled,
                    ]}
                  >
                    <Text style={styles.completeButtonText}>
                      {workoutContent.completeWorkout}
                    </Text>
                  </Pressable>
                </View>
              )
            ) : null}
          </>
        )}
      </ScrollView>

      <Modal transparent visible={showCongratsModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{workoutContent.congratsTitle}</Text>
            <Text style={styles.modalBody}>{congratsTitle}</Text>
            <Text style={styles.modalCopy}>{workoutContent.congratsMessage}</Text>

            <Pressable
              onPress={() => {
                setShowCongratsModal(false);
                completionLockRef.current = null;
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Great</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 18,
    gap: 18,
  },
  templateRow: {
    alignItems: "flex-start",
    gap: 12,
    paddingRight: 16,
  },
  topBar: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  pageTitle: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "800",
  },
  loadingCard: {
    minHeight: 120,
    borderRadius: 18,
    backgroundColor: "#151A22",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#A7B1C2",
    fontSize: 14,
  },
  sessionBlock: {
    gap: 14,
    minHeight: 392,
    paddingHorizontal: 16,
  },
  completedBlock: {
    gap: 14,
    minHeight: 392,
    paddingHorizontal: 16,
  },
  completedCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#171425",
    borderWidth: 1,
    borderColor: "#7C6FB7",
    gap: 12,
  },
  completedTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  completedSubtitle: {
    color: "#A7B1C2",
    fontSize: 13,
    lineHeight: 19,
  },
  completedExerciseList: {
    gap: 12,
  },
  completedExerciseCard: {
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#121724",
    borderWidth: 1,
    borderColor: "#2A2440",
  },
  completedExerciseName: {
    color: "#F8FAFC",
    fontSize: 14,
    fontWeight: "800",
  },
  completedExerciseSets: {
    gap: 4,
  },
  completedExerciseSetLine: {
    color: "#C7D0DB",
    fontSize: 13,
  },
  editButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#151A22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4D4566",
  },
  editButtonText: {
    color: "#D8CCFF",
    fontSize: 14,
    fontWeight: "800",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "800",
  },
  sectionCount: {
    color: "#D8CCFF",
    fontSize: 13,
    fontWeight: "800",
  },
  sessionList: {
    gap: 12,
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#151A22",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4D4566",
  },
  secondaryButtonText: {
    color: "#D8CCFF",
    fontSize: 14,
    fontWeight: "800",
  },
  completeButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#9B8CFF",
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonDisabled: {
    opacity: 0.45,
  },
  completeButtonText: {
    color: "#141022",
    fontSize: 15,
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(3, 7, 10, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 24,
    backgroundColor: "#0F1715",
    borderWidth: 1,
    borderColor: "#7C6FB7",
    padding: 20,
    gap: 10,
  },
  modalTitle: {
    color: "#D8CCFF",
    fontSize: 24,
    fontWeight: "900",
  },
  modalBody: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  modalCopy: {
    color: "#A7B1C2",
    fontSize: 14,
    lineHeight: 20,
  },
  modalButton: {
    marginTop: 6,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#9B8CFF",
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#141022",
    fontSize: 15,
    fontWeight: "900",
  },
});
