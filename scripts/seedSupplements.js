import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const userId = process.env.SEED_SUPPLEMENTS_USER_ID;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const supplements = [
  {
    id: "0b8d6d35-1eb1-4d71-9c77-11c3fb0d1001",
    name: "Vitamin D",
    description: "Supports bone health, immunity, and general wellness.",
    category: "Vitamins",
    default_dosage: 2000,
    unit: "IU",
  },
  {
    id: "0b8d6d35-1eb1-4d71-9c77-11c3fb0d1002",
    name: "Magnesium",
    description: "Supports muscle function, recovery, and sleep quality.",
    category: "Minerals",
    default_dosage: 200,
    unit: "mg",
  },
  {
    id: "0b8d6d35-1eb1-4d71-9c77-11c3fb0d1003",
    name: "Omega-3",
    description: "Supports heart, brain, and joint health.",
    category: "Fatty Acids",
    default_dosage: 1000,
    unit: "mg",
  },
  {
    id: "0b8d6d35-1eb1-4d71-9c77-11c3fb0d1004",
    name: "Multivitamin",
    description: "Daily micronutrient support.",
    category: "Vitamins",
    default_dosage: 1,
    unit: "tablet",
  },
  {
    id: "0b8d6d35-1eb1-4d71-9c77-11c3fb0d1005",
    name: "Creatine",
    description: "Supports strength, power, and high-intensity performance.",
    category: "Performance",
    default_dosage: 5,
    unit: "g",
  },
  {
    id: "0b8d6d35-1eb1-4d71-9c77-11c3fb0d1006",
    name: "Protein",
    description: "Supports muscle repair and daily protein intake.",
    category: "Nutrition",
    default_dosage: 30,
    unit: "g",
  },
  {
    id: "0b8d6d35-1eb1-4d71-9c77-11c3fb0d1007",
    name: "Zinc",
    description: "Supports immune health and normal metabolism.",
    category: "Minerals",
    default_dosage: 15,
    unit: "mg",
  },
  {
    id: "0b8d6d35-1eb1-4d71-9c77-11c3fb0d1008",
    name: "Vitamin B12",
    description: "Supports energy metabolism and nervous system health.",
    category: "Vitamins",
    default_dosage: 1000,
    unit: "mcg",
  },
];

const defaultStack = supplements.slice(0, 4).map((supplement) => ({
  supplement_id: supplement.id,
  dosage: supplement.default_dosage,
  time_of_day: "08:00",
  is_active: true,
}));

async function seedSupplementLibrary() {
  const { error } = await supabase.from("supplements").upsert(supplements, {
    onConflict: "id",
  });

  if (error) {
    throw error;
  }
}

async function seedUserStack() {
  if (!userId) {
    return;
  }

  const { data: existingRows, error: fetchError } = await supabase
    .from("profiles_supplements")
    .select("supplement_id")
    .eq("user_id", userId);

  if (fetchError) {
    throw fetchError;
  }

  const existingIds = new Set((existingRows ?? []).map((row) => row.supplement_id));
  const missingRows = defaultStack
    .filter((item) => !existingIds.has(item.supplement_id))
    .map((item) => ({
      user_id: userId,
      ...item,
    }));

  if (missingRows.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("profiles_supplements")
    .insert(missingRows);

  if (insertError) {
    throw insertError;
  }
}

async function seed() {
  try {
    await seedSupplementLibrary();
    await seedUserStack();

    console.log("Seeded supplement library successfully.");

    if (userId) {
      console.log("Seeded default supplement stack for user:", userId);
    } else {
      console.log("Set SEED_SUPPLEMENTS_USER_ID to also create a default user stack.");
    }
  } catch (error) {
    console.error("Supplement seed failed:", error);
    process.exit(1);
  }
}

seed();
