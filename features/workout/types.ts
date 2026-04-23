export type ExerciseLibraryRow = {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  muscle_group: string | null;
  equipment: string | null;
  image_url: string | null;
};

export type TemplateExercise = {
  id: string;
  exerciseLibraryId: number | string;
  name: string;
  description: string;
  muscleGroup: string;
  equipment: string;
  imageUrl: string | null;
  sets: string;
  reps: string;
  weight: string;
};

export type WorkoutTemplate = {
  id: string;
  title: string;
  category: string;
  description: string;
  durationMinutes: string;
  exercises: TemplateExercise[];
  createdAt: string;
};

export type WorkoutDraft = WorkoutTemplate;
