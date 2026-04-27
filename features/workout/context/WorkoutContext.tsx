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
  TemplateExerciseSet,
  WorkoutDraft,
  WorkoutTemplate,
} from "@/features/workout/types";
import { workoutContent } from "@/features/workout/data/workoutContent";

const DEFAULT_TEMPLATE_CATEGORY = "General";
const DEFAULT_TEMPLATE_DURATION_MINUTES = "45";

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
  addDraftExerciseSet: (exerciseId: string) => void;
  updateDraftExerciseSet: (
    exerciseId: string,
    setId: string,
    updates: Partial<TemplateExerciseSet>,
  ) => void;
  removeDraftExerciseSet: (exerciseId: string, setId: string) => void;
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

function toOptionalInt(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

function createTemplateSet(setNumber: number): TemplateExerciseSet {
  return {
    id: createId("set"),
    setNumber,
    reps: "10",
    weightKg: "",
    restSeconds: "120",
  };
}

function summarizeExercise(exercise: TemplateExercise) {
  const firstSet = exercise.exerciseSets[0];

  return {
    ...exercise,
    sets: String(exercise.exerciseSets.length),
    reps: firstSet?.reps ?? "",
    weight: firstSet?.weightKg ?? "",
  };
}

function buildLegacyExerciseSets(row: {
  id: string | number;
  sets?: number | null;
  reps?: number | null;
  weight_kg?: number | null;
}) {
  const totalSets = Math.max(1, Number(row.sets ?? 1) || 1);
  const reps = row.reps == null ? "" : String(row.reps);
  const weightKg = row.weight_kg == null ? "" : String(row.weight_kg);

  return Array.from({ length: totalSets }, (_, index) => ({
    ...createTemplateSet(index + 1),
    reps,
    weightKg,
    restSeconds: "",
  }));
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
    sets: "1",
    reps: "10",
    weight: "",
    exerciseSets: [createTemplateSet(1)],
  };
}

function toDraftTemplate(template: WorkoutTemplate): WorkoutDraft {
  return {
    ...template,
    exercises: template.exercises.map((exercise) => ({
      ...exercise,
      exerciseSets: exercise.exerciseSets.map((set) => ({ ...set })),
    })),
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
      const exerciseSetsByExercise = new Map<string, TemplateExerciseSet[]>();

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

            const legacySets = buildLegacyExerciseSets(row);

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
              exerciseSets: legacySets,
            });

            exercisesByPlan.set(planId, existing);
          });

          const exerciseIds = (exerciseRows ?? []).map((row) => String(row.id));

          if (exerciseIds.length > 0) {
            const { data: setRows, error: setError } = await supabase
              .from("exercise_sets")
              .select("id, exercise_id, set_number, reps, weight_kg, rest_seconds, is_completed")
              .in("exercise_id", exerciseIds)
              .order("exercise_id", { ascending: true })
              .order("set_number", { ascending: true })
              .order("id", { ascending: true });

            if (!isMounted) {
              return;
            }

            if (!setError) {
              (setRows ?? []).forEach((row) => {
                const exerciseId = String(row.exercise_id);
                const existing = exerciseSetsByExercise.get(exerciseId) ?? [];

                existing.push({
                  id: String(row.id),
                  setNumber: Number(row.set_number) || existing.length + 1,
                  reps: row.reps == null ? "" : String(row.reps),
                  weightKg: row.weight_kg == null ? "" : String(row.weight_kg),
                  restSeconds: row.rest_seconds == null ? "" : String(row.rest_seconds),
                });

                exerciseSetsByExercise.set(exerciseId, existing);
              });
            }
          }
        }
      }

      const nextTemplates = (planRows ?? []).map((plan) => ({
        id: plan.id,
        title: plan.title,
        category: plan.category ?? DEFAULT_TEMPLATE_CATEGORY,
        description: plan.description ?? "",
        durationMinutes: String(plan.duration_minutes ?? DEFAULT_TEMPLATE_DURATION_MINUTES),
        exercises: (exercisesByPlan.get(plan.id) ?? []).map((exercise) => {
          const exerciseSets = exerciseSetsByExercise.get(exercise.id);

          if (exerciseSets && exerciseSets.length > 0) {
            return summarizeExercise({
              ...exercise,
              exerciseSets,
            });
          }

          return summarizeExercise({
            ...exercise,
            exerciseSets: [createTemplateSet(1)],
          });
        }),
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
            category: DEFAULT_TEMPLATE_CATEGORY,
            description: "",
            durationMinutes: DEFAULT_TEMPLATE_DURATION_MINUTES,
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
      addDraftExerciseSet: (exerciseId) => {
        setDraft((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            exercises: current.exercises.map((exercise) => {
              if (exercise.id !== exerciseId) {
                return exercise;
              }

              return {
                ...exercise,
                exerciseSets: [
                  ...exercise.exerciseSets,
                  createTemplateSet(exercise.exerciseSets.length + 1),
                ],
              };
            }),
          };
        });
      },
      updateDraftExerciseSet: (exerciseId, setId, updates) => {
        setDraft((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            exercises: current.exercises.map((exercise) => {
              if (exercise.id !== exerciseId) {
                return exercise;
              }

              return {
                ...exercise,
                exerciseSets: exercise.exerciseSets.map((set) =>
                  set.id === setId ? { ...set, ...updates } : set,
                ),
              };
            }),
          };
        });
      },
      removeDraftExerciseSet: (exerciseId, setId) => {
        setDraft((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            exercises: current.exercises.map((exercise) => {
              if (exercise.id !== exerciseId) {
                return exercise;
              }

              const nextSets = exercise.exerciseSets
                .filter((set) => set.id !== setId)
                .map((set, index) => ({
                  ...set,
                  setNumber: index + 1,
                }));

              return {
                ...exercise,
                exerciseSets: nextSets.length > 0 ? nextSets : [createTemplateSet(1)],
              };
            }),
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
        const category = draft.category.trim() || DEFAULT_TEMPLATE_CATEGORY;
        const durationMinutes = draft.durationMinutes.trim() || DEFAULT_TEMPLATE_DURATION_MINUTES;

        if (!hasSupabaseConfig) {
          return false;
        }

        const baseTemplate = {
          title,
          category,
          description: category,
          duration_minutes: Number(durationMinutes),
        };

        async function persistExerciseSets(
          planId: string,
          exercisesToPersist: TemplateExercise[],
        ): Promise<{ ok: boolean; insertedExerciseIds: string[] }> {
          const { data: createdExercises, error: exercisesError } = await supabase
            .from("exercises")
            .insert(
              exercisesToPersist.map((exercise, index) => {
                const firstSet = exercise.exerciseSets[0];

                return {
                  workout_plan_id: planId,
                  name: exercise.name,
                  sets: exercise.exerciseSets.length,
                  reps: toOptionalInt(firstSet?.reps ?? exercise.reps) ?? 0,
                  weight_kg: toWeightValue(firstSet?.weightKg ?? exercise.weight),
                  sort_order: index,
                };
              }),
            )
            .select("id, sort_order");

          if (exercisesError || !createdExercises) {
            return { ok: false, insertedExerciseIds: [] };
          }

          const orderedExercises = [...createdExercises].sort(
            (left, right) => Number(left.sort_order ?? 0) - Number(right.sort_order ?? 0),
          );
          const insertedExerciseIds = orderedExercises.map((exercise) => String(exercise.id));

          const setPayload = exercisesToPersist.flatMap((exercise, exerciseIndex) => {
            const insertedExercise = orderedExercises[exerciseIndex];

            if (!insertedExercise) {
              return [];
            }

            return exercise.exerciseSets.map((set) => ({
              exercise_id: insertedExercise.id,
              set_number: set.setNumber,
              reps: toOptionalInt(set.reps),
              weight_kg: toWeightValue(set.weightKg),
              rest_seconds: toOptionalInt(set.restSeconds),
              is_completed: false,
            }));
          });

          if (setPayload.length === 0) {
            return { ok: true, insertedExerciseIds };
          }

          const { error: setError } = await supabase.from("exercise_sets").insert(setPayload);

          if (setError) {
            await supabase.from("exercises").delete().in("id", insertedExerciseIds);
            return { ok: false, insertedExerciseIds: [] };
          }

          return { ok: true, insertedExerciseIds };
        }

        if (editingTemplateId) {
          const { data: existingExerciseRows, error: existingExerciseError } = await supabase
            .from("exercises")
            .select("id")
            .eq("workout_plan_id", editingTemplateId);

          if (existingExerciseError) {
            return false;
          }

          const existingExerciseIds = (existingExerciseRows ?? []).map((row) => String(row.id));

          const { error: planError } = await supabase
            .from("workout_plans")
            .update(baseTemplate)
            .eq("id", editingTemplateId)
            .eq("user_id", user.id);

          if (planError) {
            return false;
          }

          const persisted = await persistExerciseSets(editingTemplateId, draft.exercises);

          if (!persisted.ok) {
            return false;
          }

          const { error: deleteError } = existingExerciseIds.length
            ? await supabase.from("exercises").delete().in("id", existingExerciseIds)
            : { error: null };

          if (deleteError) {
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
            exercises: draft.exercises.map((exercise) =>
              summarizeExercise({
                ...exercise,
                exerciseSets: exercise.exerciseSets.map((set) => ({ ...set })),
              }),
            ),
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

        const persisted = await persistExerciseSets(createdPlan.id, draft.exercises);

        if (!persisted.ok) {
          await supabase.from("workout_plans").delete().eq("id", createdPlan.id);
          return false;
        }

        const savedTemplate: WorkoutTemplate = {
          id: createdPlan.id,
          title: createdPlan.title,
          category: createdPlan.category ?? DEFAULT_TEMPLATE_CATEGORY,
          description: createdPlan.description ?? "",
          durationMinutes: String(createdPlan.duration_minutes ?? durationMinutes),
          exercises: draft.exercises.map((exercise) =>
            summarizeExercise({
              ...exercise,
              exerciseSets: exercise.exerciseSets.map((set) => ({ ...set })),
            }),
          ),
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
