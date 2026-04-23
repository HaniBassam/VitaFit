import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { supabase } from "@/lib/supabase";
import { useWorkout } from "@/features/workout/context/WorkoutContext";
import type { ExerciseLibraryRow } from "@/features/workout/types";
import { workoutContent } from "@/features/workout/data/workoutContent";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function ExerciseLibraryScreen() {
  const router = useRouter();
  const { addExercisesToDraft } = useWorkout();
  const [items, setItems] = useState<ExerciseLibraryRow[]>([]);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadExercises() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("exercise_library")
        .select("id, name, description, category, muscle_group, equipment, image_url")
        .order("name", { ascending: true });

      if (!isActive) {
        return;
      }

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setItems((data ?? []) as ExerciseLibraryRow[]);
      }

      setLoading(false);
    }

    void loadExercises();

    return () => {
      isActive = false;
    };
  }, []);

  const groups = useMemo(() => {
    const values = new Set<string>(["All"]);

    items.forEach((item) => {
      const group = item.muscle_group ?? item.category;

      if (group) {
        values.add(group);
      }
    });

    return Array.from(values);
  }, [items]);

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();

    return items.filter((item) => {
      const group = item.muscle_group ?? item.category ?? "General";
      const matchesGroup = activeGroup === "All" || group === activeGroup;

      if (!matchesGroup) {
        return false;
      }

      if (!search) {
        return true;
      }

      return [item.name, item.description, item.category, item.muscle_group, item.equipment]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    });
  }, [activeGroup, items, query]);

  function toggleSelected(id: number) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  function handleAddSelected() {
    const selected = items.filter((item) => selectedIds.includes(item.id));
    addExercisesToDraft(selected);
    router.back();
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
          <Text style={styles.pageTitle}>{workoutContent.exerciseLibraryTitle}</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.searchCard}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={workoutContent.searchPlaceholder}
            placeholderTextColor="#6B7280"
            style={styles.searchInput}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroller}
          contentContainerStyle={styles.chipRow}
        >
          {groups.map((group) => (
            <Pressable
              key={group}
              onPress={() => setActiveGroup(group)}
              style={[
                styles.chip,
                activeGroup === group && styles.chipActive,
              ]}
            >
              <Text style={[styles.chipText, activeGroup === group && styles.chipTextActive]}>
                {group}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {loading ? (
          <View style={styles.loadingCard}>
            <Text style={styles.loadingText}>Loading exercises...</Text>
          </View>
        ) : error ? (
          <View style={styles.loadingCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const group = item.muscle_group ?? item.category ?? "General";

              return (
                <Pressable
                  key={item.id}
                  onPress={() => toggleSelected(item.id)}
                  style={[styles.row, isSelected && styles.rowSelected]}
                >
                  {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.image} />
                  ) : (
                    <View style={styles.imageFallback}>
                      <Text style={styles.imageFallbackText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.rowText}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.meta}>{group}</Text>
                    {item.equipment ? (
                      <Text style={styles.equipment}>{item.equipment}</Text>
                    ) : null}
                  </View>

                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    <Text style={styles.checkboxText}>{isSelected ? "✓" : ""}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          onPress={handleAddSelected}
          disabled={selectedIds.length === 0}
          style={[
            styles.addButton,
            selectedIds.length === 0 && styles.addButtonDisabled,
          ]}
        >
          <Text style={styles.addButtonText}>
            + {workoutContent.addSelected} ({selectedIds.length})
          </Text>
        </Pressable>
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
    gap: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#151A22",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
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
  spacer: {
    width: 38,
  },
  searchCard: {
    backgroundColor: "#10161D",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#24303A",
    paddingHorizontal: 14,
  },
  searchInput: {
    minHeight: 50,
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "600",
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 2,
    paddingRight: 4,
  },
  chipScroller: {
    alignSelf: "flex-start",
    maxHeight: 48,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#151A22",
    borderWidth: 1,
    borderColor: "#24303A",
    alignSelf: "center",
  },
  chipActive: {
    backgroundColor: "#36D280",
    borderColor: "#36D280",
  },
  chipText: {
    color: "#B0B8C7",
    fontSize: 13,
    fontWeight: "700",
  },
  chipTextActive: {
    color: "#07110D",
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
  errorText: {
    color: "#FCA5A5",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#151A22",
    borderWidth: 1,
    borderColor: "#24303A",
  },
  rowSelected: {
    borderColor: "#36D280",
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0F171B",
  },
  imageFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#0F171B",
    alignItems: "center",
    justifyContent: "center",
  },
  imageFallbackText: {
    color: "#59D8A3",
    fontSize: 18,
    fontWeight: "800",
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "800",
  },
  meta: {
    color: "#A7B1C2",
    fontSize: 12,
    fontWeight: "600",
  },
  equipment: {
    color: "#6B7280",
    fontSize: 11,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#364154",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#36D280",
    borderColor: "#36D280",
  },
  checkboxText: {
    color: "#07110D",
    fontSize: 14,
    fontWeight: "900",
  },
  addButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#36D280",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  addButtonDisabled: {
    opacity: 0.45,
  },
  addButtonText: {
    color: "#07110D",
    fontSize: 15,
    fontWeight: "800",
  },
});
