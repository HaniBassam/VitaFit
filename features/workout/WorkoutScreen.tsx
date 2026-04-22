import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo } from "react";
import {
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
    startNewDraft,
    startWorkout,
    completeWorkout,
    toggleWorkoutExercise,
  } = useWorkout();

  const activeTemplate = useMemo(
    () => templates.find((template) => template.id === activeTemplateId) ?? null,
    [activeTemplateId, templates],
  );

  const completedSet = useMemo(() => new Set(completedExerciseIds), [completedExerciseIds]);

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

  async function handleCompleteWorkout() {
    const isSaved = await completeWorkout();

    if (isSaved) {
      router.replace("/workout");
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
                  onPress={() => handleTemplatePress(template.id)}
                />
              ))}
            </ScrollView>

            <Pressable onPress={handleCreateTemplate} style={styles.createAnother}>
              <Text style={styles.createAnotherText}>+ Create Template</Text>
            </Pressable>

            {activeTemplate ? (
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
                  onPress={handleCompleteWorkout}
                  style={styles.completeButton}
                >
                  <Text style={styles.completeButtonText}>
                    {workoutContent.completeWorkout}
                  </Text>
                </Pressable>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
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
  templateRow: {
    alignItems: "flex-start",
    gap: 12,
    paddingRight: 4,
  },
  topBar: {
    paddingVertical: 6,
  },
  pageTitle: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "800",
  },
  list: {
    gap: 14,
  },
  createAnother: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#24303A",
    backgroundColor: "#12181D",
    alignItems: "center",
    justifyContent: "center",
  },
  createAnotherText: {
    color: "#59D8A3",
    fontSize: 15,
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
    color: "#59D8A3",
    fontSize: 13,
    fontWeight: "800",
  },
  sessionList: {
    gap: 12,
  },
  completeButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#36D280",
    alignItems: "center",
    justifyContent: "center",
  },
  completeButtonText: {
    color: "#07110D",
    fontSize: 15,
    fontWeight: "800",
  },
});
