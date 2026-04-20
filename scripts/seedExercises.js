import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase env variables");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchExercises() {
  const res = await fetch(
    "https://wger.de/api/v2/exerciseinfo/?language=2&limit=20",
  );
  const data = await res.json();
  return data.results;
}

async function seed() {
  const exercises = await fetchExercises();

  const formatted = exercises.map((ex) => {
    const translation = ex.translations?.[0];

    return {
      id: ex.id,
      name: translation?.name ?? "Unknown",
      description: translation?.description ?? "",
      category: String(ex.category?.id ?? ""),
      muscle_group: ex.muscles?.[0]?.id?.toString() ?? null,
    };
  });

  const { error } = await supabase.from("exercise_library").upsert(formatted);

  if (error) {
    console.error("❌ Error:", error);
  } else {
    console.log("✅ Seeded successfully!");
  }
}

seed();
