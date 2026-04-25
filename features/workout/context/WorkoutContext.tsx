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
  completedTodayPlanIds: string[];
  editingTemplateId: string | null;
  loading: boolean;
  startNewDraft: () => void;
  startEditingTemplate: (templateId: string) => void;
  cancelDraft: () => void;
  updateDraftField: (field: "title" | "category" | "durationMinutes", value: string) => void;
  addExercisesToDraft: (items: ExerciseLibraryRow[]) => void;
  updateDraftExercise: (id: string, updates: Partial<TemplateExercise>) => void;
  removeDraftExercise: (id: string) => void;
  saveDraft: () => Promise<boolean>;
  deleteDraft: () => Promise<boolean>;
  startWorkout: (templateId: string) => void;
  completeWorkout: () => Promise<boolean>;
  toggleWorkoutExercise: (exerciseId: string) => void;
};

const WorkoutContext = createContext<WorkoutContextValue | undefined>(undefined);

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function getLocalDayRange(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

function toWeightValue(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? parsed : null;
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

function toDraftTemplate(template: WorkoutTemplate): WorkoutDraft {
  return {
    ...template,
    exercises: template.exercises.map((exercise) => ({ ...exercise })),
  };
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [draft, setDraft] = useState<WorkoutDraft | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [completedTodayPlanIds, setCompletedTodayPlanIds] = useState<string[]>([]);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTemplates() {
      if (!hasSupabaseConfig || !user) {
        if (isMounted) {
          setTemplates([]);
          setActiveTemplateId(null);
          setCompletedExerciseIds([]);
          setCompletedTodayPlanIds([]);
          setEditingTemplateId(null);
          setLoading(false);
        }

        return;
      }

      setLoading(true);

      const { startIso, endIso } = getLocalDayRange();

      const { data: logRows, error: logError } = await supabase
        .from("workout_logs")
        .select("workout_plan_id")
        .eq("user_id", user.id)
        .gte("completed_at", startIso)
        .lte("completed_at", endIso);

      const { data: planRows, error: planError } = await supabase
        .from("workout_plans")
        .select("id, title, category, description, duration_minutes, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (planError || logError) {
        setTemplates([]);
        setActiveTemplateId(null);
        setCompletedExerciseIds([]);
        setCompletedTodayPlanIds([]);
        setEditingTemplateId(null);
        setLoading(false);
        return;
      }

      const completedPlanIds = Array.from(
        new Set((logRows ?? []).map((row) => String(row.workout_plan_id))),
      );

      const planIds = (planRows ?? []).map((plan) => plan.id);

      const exercisesByPlan = new Map<string, TemplateExercise[]>();

      if (planIds.length > 0) {
        const { data: exerciseRows, error: exerciseError } = await supabase
          .from("exercises")
          .select("id, workout_plan_id, name, sets, reps, weight_kg, sort_order")
          .in("workout_plan_id", planIds)
          .order("sort_order", { ascending: true, nullsFirst: true })
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
              weight: row.weight_kg == null ? "" : String(row.weight_kg),
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
      setCompletedTodayPlanIds(completedPlanIds);
      setActiveTemplateId((current) =>
        current && nextTemplates.some((template) => template.id === current)
          ? current
          : nextTemplates.find((template) => !completedPlanIds.includes(template.id))?.id ?? null,
      );
      setCompletedExerciseIds([]);
      setEditingTemplateId(null);
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
      completedTodayPlanIds,
      editingTemplateId,
      loading,
      startNewDraft: () => {
        setEditingTemplateId(null);
        setDraft({
          id: createId("template"),
          title: "",
          category: "",
          description: "",
          durationMinutes: "",
          exercises: [],
          createdAt: new Date().toISOString(),
        });
      },
      startEditingTemplate: (templateId) => {
        const template = templates.find((item) => item.id === templateId);

        if (!template) {
          return;
        }

        setEditingTemplateId(templateId);
        setDraft(toDraftTemplate(template));
      },
      cancelDraft: () => {
        setDraft(null);
        setEditingTemplateId(null);
      },
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

        const baseTemplate = {
          title,
          category,
          description: category,
          duration_minutes: Number(durationMinutes),
        };

        const exerciseRows = draft.exercises.map((exercise, index) => ({
          name: exercise.name,
          sets: Number(exercise.sets) || 0,
          reps: Number(exercise.reps) || 0,
          weight_kg: toWeightValue(exercise.weight),
          sort_order: index,
        }));

        if (editingTemplateId) {
          const { error: planError } = await supabase
            .from("workout_plans")
            .update(baseTemplate)
            .eq("id", editingTemplateId)
            .eq("user_id", user.id);

          if (planError) {
            return false;
          }

          const { error: deleteError } = await supabase
            .from("exercises")
            .delete()
            .eq("workout_plan_id", editingTemplateId);

          if (deleteError) {
            return false;
          }

          const { error: exercisesError } = await supabase.from("exercises").insert(
            exerciseRows.map((exercise) => ({
              workout_plan_id: editingTemplateId,
              ...exercise,
            })),
          );

          if (exercisesError) {
            return false;
          }

          const { startIso, endIso } = getLocalDayRange();
          const { error: logError } = await supabase
            .from("workout_logs")
            .delete()
            .eq("user_id", user.id)
            .eq("workout_plan_id", editingTemplateId)
            .gte("completed_at", startIso)
            .lte("completed_at", endIso);

          if (logError) {
            return false;
          }

          const updatedTemplate: WorkoutTemplate = {
            ...draft,
            id: editingTemplateId,
            title,
            category,
            description: category,
            durationMinutes: String(durationMinutes),
          };

          setTemplates((current) =>
            current.map((template) =>
              template.id === editingTemplateId ? updatedTemplate : template,
            ),
          );
          setActiveTemplateId(editingTemplateId);
          setCompletedExerciseIds([]);
          setCompletedTodayPlanIds((current) =>
            current.filter((templateId) => templateId !== editingTemplateId),
          );
          setDraft(null);
          setEditingTemplateId(null);
          return true;
        }

        const { data: createdPlan, error: planError } = await supabase
          .from("workout_plans")
          .insert({
            user_id: user.id,
            ...baseTemplate,
          })
          .select("id, title, category, description, duration_minutes, created_at")
          .single();

        if (planError || !createdPlan) {
          return false;
        }

        const { error: exercisesError } = await supabase.from("exercises").insert(
          exerciseRows.map((exercise) => ({
            workout_plan_id: createdPlan.id,
            ...exercise,
          })),
        );

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
        setEditingTemplateId(null);
        return true;
      },
      deleteDraft: async () => {
        if (!editingTemplateId || !user || !hasSupabaseConfig) {
          return false;
        }

        const templateId = editingTemplateId;

        const { error: exercisesError } = await supabase
          .from("exercises")
          .delete()
          .eq("workout_plan_id", templateId);

        if (exercisesError) {
          return false;
        }

        const { error: planError } = await supabase
          .from("workout_plans")
          .delete()
          .eq("id", templateId)
          .eq("user_id", user.id);

        if (planError) {
          return false;
        }

        setTemplates((current) => current.filter((template) => template.id !== templateId));
        setCompletedTodayPlanIds((current) => current.filter((id) => id !== templateId));
        setCompletedExerciseIds([]);
        setActiveTemplateId((current) => {
          if (current !== templateId) {
            return current;
          }

          return templates.find((template) => template.id !== templateId)?.id ?? null;
        });
        setDraft(null);
        setEditingTemplateId(null);
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

        const currentTemplate = templates.find((template) => template.id === activeTemplateId);

        if (!currentTemplate) {
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

        const completedPlanIds = new Set([...completedTodayPlanIds, activeTemplateId]);
        const nextTemplateId =
          templates.find(
            (template) =>
              template.id !== activeTemplateId && !completedPlanIds.has(template.id),
          )?.id ?? null;

        setCompletedTodayPlanIds((current) =>
          current.includes(activeTemplateId) ? current : [...current, activeTemplateId],
        );
        setActiveTemplateId(nextTemplateId);
        setCompletedExerciseIds([]);
        return true;
      },
    }),
    [
      activeTemplateId,
      completedExerciseIds,
      completedTodayPlanIds,
      draft,
      editingTemplateId,
      loading,
      templates,
      user,
    ],
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
