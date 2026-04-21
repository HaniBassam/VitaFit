import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function cleanHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

async function fetchExercises() {
  const res = await fetch("https://wger.de/api/v2/exerciseinfo/?limit=50");
  const data = await res.json();
  return data.results;
}

async function seed() {
  try {
    const exercises = await fetchExercises();

    const formatted = exercises.map((ex) => {
      const translation = ex.translations?.find((t) => t.language === 2);

      return {
        id: ex.id,
        name: translation?.name ?? "Unknown",
        description: cleanHtml(translation?.description),
        category: ex.category?.name ?? null,
        muscle_group: ex.muscles?.[0]?.name_en || ex.muscles?.[0]?.name || null,
        equipment: ex.equipment?.[0]?.name ?? null,

        image_url:
          ex.images?.find((img) => img.is_main)?.image ??
          ex.images?.[0]?.image ??
          null,
      };
    });

    const { error } = await supabase.from("exercise_library").upsert(formatted);

    if (error) {
      console.error("❌ Error:", error);
    } else {
      console.log("✅ Seeded successfully!");
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

seed();
