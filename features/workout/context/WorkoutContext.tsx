import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/providers/AuthProvider";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import type {
  ExerciseLibraryRow,
  TemplateExercise,
  WorkoutDraft,
  WorkoutTemplate,
} from "@/features/workout/types";
import { workoutContent } from "@/features/workout/data/workoutContent";

type WorkoutContextValue = {
  templates: WorkoutTemplate[];
  draft: WorkoutDraft | null;
  activeTemplateId: string | null;
  completedExerciseIds: string[];
  loading: boolean;
  startNewDraft: () => void;
  cancelDraft: () => void;
  updateDraftField: (field: "title" | "category" | "durationMinutes", value: string) => void;
  addExercisesToDraft: (items: ExerciseLibraryRow[]) => void;
  updateDraftExercise: (id: string, updates: Partial<TemplateExercise>) => void;
  removeDraftExercise: (id: string) => void;
  saveDraft: () => Promise<boolean>;
  startWorkout: (templateId: string) => void;
  completeWorkout: () => Promise<boolean>;
  toggleWorkoutExercise: (exerciseId: string) => void;
};

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function toTemplateExercise(item: ExerciseLibraryRow): TemplateExercise {
  return {
    id: createId("exercise"),
    exerciseLibraryId: item.id,
    name: item.name,
    description: item.description ?? "",
    muscleGroup: item.muscle_group ?? item.category ?? "General",
    equipment: item.equipment ?? "Bodyweight",
    imageUrl: item.image_url,
    sets: "3",
    reps: "10",
    weight: "",
  };
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [draft, setDraft] = useState<WorkoutDraft | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTemplates() {
      if (!hasSupabaseConfig || !user) {
        if (isMounted) {
          setTemplates([]);
          setActiveTemplateId(null);
          setCompletedExerciseIds([]);
          setLoading(false);
        }

        return;
      }

      setLoading(true);

      const { data: planRows, error: planError } = await supabase
        .from("workout_plans")
        .select("id, title, category, description, duration_minutes, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (planError) {
        setTemplates([]);
        setActiveTemplateId(null);
        setCompletedExerciseIds([]);
        setLoading(false);
        return;
      }

      const planIds = (planRows ?? []).map((plan) => plan.id);

      const exercisesByPlan = new Map<string, TemplateExercise[]>();

      if (planIds.length > 0) {
        const { data: exerciseRows, error: exerciseError } = await supabase
          .from("exercises")
          .select("id, workout_plan_id, name, sets, reps")
          .in("workout_plan_id", planIds)
          .order("id", { ascending: true });

        if (!isMounted) {
          return;
        }

        if (!exerciseError) {
          (exerciseRows ?? []).forEach((row) => {
            const planId = row.workout_plan_id as string;
            const existing = exercisesByPlan.get(planId) ?? [];

            existing.push({
              id: String(row.id),
              exerciseLibraryId: String(row.id),
              name: row.name,
              description: "",
              muscleGroup: "General",
              equipment: "Bodyweight",
              imageUrl: null,
              sets: String(row.sets ?? ""),
              reps: String(row.reps ?? ""),
              weight: "",
            });

            exercisesByPlan.set(planId, existing);
          });
        }
      }

      const nextTemplates = (planRows ?? []).map((plan) => ({
        id: plan.id,
        title: plan.title,
        category: plan.category ?? workoutContent.defaultCategory,
        description: plan.description ?? "",
        durationMinutes: String(plan.duration_minutes ?? workoutContent.defaultDuration),
        exercises: exercisesByPlan.get(plan.id) ?? [],
        createdAt: plan.created_at,
      }));

      setTemplates(nextTemplates);
      setActiveTemplateId((current) =>
        current && nextTemplates.some((template) => template.id === current)
          ? current
          : nextTemplates[0]?.id ?? null,
      );
      setCompletedExerciseIds([]);
      setLoading(false);
    }

    void loadTemplates();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const value = useMemo<WorkoutContextValue>(
    () => ({
      templates,
      draft,
      activeTemplateId,
      completedExerciseIds,
      loading,
      startNewDraft: () => {
        setDraft({
          id: createId("template"),
          title: "",
          category: workoutContent.defaultCategory,
          description: workoutContent.defaultCategory,
          durationMinutes: workoutContent.defaultDuration,
          exercises: [],
          createdAt: new Date().toISOString(),
        });
      },
      cancelDraft: () => setDraft(null),
      updateDraftField: (field, value) => {
        setDraft((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            [field]: value,
          };
        });
      },
      addExercisesToDraft: (items) => {
        setDraft((current) => {
          if (!current) {
            return current;
          }

          const existingIds = new Set(
            current.exercises.map((exercise) => exercise.exerciseLibraryId),
          );
          const nextExercises = items
            .filter((item) => !existingIds.has(item.id))
            .map(toTemplateExercise);

          return {
            ...current,
            exercises: [...current.exercises, ...nextExercises],
          };
        });
      },
      updateDraftExercise: (id, updates) => {
        setDraft((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            exercises: current.exercises.map((exercise) =>
              exercise.id === id ? { ...exercise, ...updates } : exercise,
            ),
          };
        });
      },
      removeDraftExercise: (id) => {
        setDraft((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            exercises: current.exercises.filter((exercise) => exercise.id !== id),
          };
        });
      },
      saveDraft: async () => {
        if (!draft || !draft.title.trim() || draft.exercises.length === 0 || !user) {
          return false;
        }

        const title = draft.title.trim();
        const category = draft.category.trim() || workoutContent.defaultCategory;
        const durationMinutes = draft.durationMinutes.trim() || workoutContent.defaultDuration;

        if (!hasSupabaseConfig) {
          return false;
        }

        const { data: createdPlan, error: planError } = await supabase
          .from("workout_plans")
          .insert({
            user_id: user.id,
            title,
            category,
            description: category,
            duration_minutes: Number(durationMinutes),
          })
          .select("id, title, category, description, duration_minutes, created_at")
          .single();

        if (planError || !createdPlan) {
          return false;
        }

        const exerciseRows = draft.exercises.map((exercise) => ({
          workout_plan_id: createdPlan.id,
          name: exercise.name,
          sets: Number(exercise.sets) || 0,
          reps: Number(exercise.reps) || 0,
        }));

        const { error: exercisesError } = await supabase
          .from("exercises")
          .insert(exerciseRows);

        if (exercisesError) {
          return false;
        }

        const savedTemplate: WorkoutTemplate = {
          id: createdPlan.id,
          title: createdPlan.title,
          category: createdPlan.category ?? workoutContent.defaultCategory,
          description: createdPlan.description ?? "",
          durationMinutes: String(createdPlan.duration_minutes ?? durationMinutes),
          exercises: draft.exercises,
          createdAt: createdPlan.created_at,
        };

        setTemplates((current) => [savedTemplate, ...current]);
        setActiveTemplateId(savedTemplate.id);
        setCompletedExerciseIds([]);
        setDraft(null);
        return true;
      },
      startWorkout: (templateId) => {
        setActiveTemplateId(templateId);
        setCompletedExerciseIds([]);
      },
      toggleWorkoutExercise: (exerciseId) => {
        setCompletedExerciseIds((current) =>
          current.includes(exerciseId)
            ? current.filter((value) => value !== exerciseId)
            : [...current, exerciseId],
        );
      },
      completeWorkout: async () => {
        if (!user || !activeTemplateId || !hasSupabaseConfig) {
          return false;
        }

        const { error } = await supabase.from("workout_logs").insert({
          user_id: user.id,
          workout_plan_id: activeTemplateId,
          completed_at: new Date().toISOString(),
          notes: `Completed ${completedExerciseIds.length} exercises`,
        });

        if (error) {
          return false;
        }

        setCompletedExerciseIds([]);
        return true;
      },
    }),
    [activeTemplateId, completedExerciseIds, draft, loading, templates, user],
  );

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
}

export function useWorkout() {
  const context = useContext(WorkoutContext);

  if (!context) {
    throw new Error("useWorkout must be used inside a WorkoutProvider");
  }

  return context;
}
