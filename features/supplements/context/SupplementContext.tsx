import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { supplementContent } from "@/features/supplements/data/supplementContent";
import type {
  DailySupplement,
  ProfileSupplementRow,
  SupplementLibraryRow,
  SupplementLogRow,
} from "@/features/supplements/types";

type SupplementContextValue = {
  supplements: DailySupplement[];
  loading: boolean;
  error: string | null;
  completedCount: number;
  totalCount: number;
  progress: number;
  nextTime: string;
  refreshSupplements: () => Promise<void>;
  toggleSupplement: (supplement: DailySupplement) => Promise<boolean>;
  markAllTaken: () => Promise<boolean>;
};

const SupplementContext = createContext<SupplementContextValue | undefined>(undefined);

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

function formatTime(value: string | null | undefined) {
  if (!value) {
    return supplementContent.defaultNextTime;
  }

  return value.slice(0, 5);
}

function formatDosage(value: number | null | undefined) {
  if (value == null) {
    return "";
  }

  return Number.isInteger(value) ? String(value) : String(value).replace(/\.0+$/, "");
}

function toDisplayTime(value: string) {
  const [hourValue, minuteValue] = value.split(":");
  const hour = Number(hourValue);
  const minute = Number(minuteValue ?? "0");

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return value;
  }

  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function sortByTime(items: DailySupplement[]) {
  return [...items].sort((first, second) => {
    const firstTime = first.timeOfDay || supplementContent.defaultNextTime;
    const secondTime = second.timeOfDay || supplementContent.defaultNextTime;
    return firstTime.localeCompare(secondTime);
  });
}

async function createDefaultStack(userId: string) {
  const { data: libraryRows, error: libraryError } = await supabase
    .from("supplements")
    .select("id, name, default_dosage")
    .in("name", ["Vitamin D", "Magnesium", "Omega-3", "Multivitamin"]);

  if (libraryError) {
    return libraryError.message;
  }

  const rows = (libraryRows ?? []) as Array<{
    id: string;
    name: string;
    default_dosage: number | null;
  }>;

  if (rows.length === 0) {
    return null;
  }

  const sortOrder = new Map([
    ["Vitamin D", 0],
    ["Magnesium", 1],
    ["Omega-3", 2],
    ["Multivitamin", 3],
  ]);

  const defaultRows = [...rows]
    .sort((first, second) => {
      const firstOrder = sortOrder.get(first.name) ?? 99;
      const secondOrder = sortOrder.get(second.name) ?? 99;
      return firstOrder - secondOrder;
    })
    .map((item) => ({
      user_id: userId,
      supplement_id: item.id,
      dosage: item.default_dosage ?? 1,
      time_of_day: supplementContent.defaultNextTime,
      is_active: true,
    }));

  const { error: insertError } = await supabase
    .from("profiles_supplements")
    .insert(defaultRows);

  return insertError?.message ?? null;
}

export function SupplementProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [supplements, setSupplements] = useState<DailySupplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSupplements = useCallback(async () => {
    if (!hasSupabaseConfig || !user) {
      setSupplements([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data: profileRows, error: profileError } = await supabase
      .from("profiles_supplements")
      .select("id, user_id, supplement_id, dosage, time_of_day, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("time_of_day", { ascending: true });

    if (profileError) {
      setSupplements([]);
      setError(profileError.message);
      setLoading(false);
      return;
    }

    const activeRows = (profileRows ?? []) as ProfileSupplementRow[];
    const supplementIds = activeRows.map((item) => item.supplement_id);

    if (supplementIds.length === 0) {
      const defaultStackError = await createDefaultStack(user.id);

      if (defaultStackError) {
        setSupplements([]);
        setError(defaultStackError);
        setLoading(false);
        return;
      }

      const { data: createdRows, error: createdError } = await supabase
        .from("profiles_supplements")
        .select("id, user_id, supplement_id, dosage, time_of_day, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("time_of_day", { ascending: true });

      if (createdError) {
        setSupplements([]);
        setError(createdError.message);
        setLoading(false);
        return;
      }

      activeRows.splice(0, activeRows.length, ...((createdRows ?? []) as ProfileSupplementRow[]));
      supplementIds.splice(0, supplementIds.length, ...activeRows.map((item) => item.supplement_id));
    }

    if (supplementIds.length === 0) {
      setSupplements([]);
      setLoading(false);
      return;
    }

    const { data: libraryRows, error: libraryError } = await supabase
      .from("supplements")
      .select("id, name, description, category, default_dosage, unit, created_at")
      .in("id", supplementIds);

    if (libraryError) {
      setSupplements([]);
      setError(libraryError.message);
      setLoading(false);
      return;
    }

    const { startIso, endIso } = getTodayRange();
    const { data: logRows, error: logError } = await supabase
      .from("supplement_logs")
      .select("id, profiles_id, supplement_id, taken_at, status")
      .eq("profiles_id", user.id)
      .gte("taken_at", startIso)
      .lt("taken_at", endIso);

    if (logError) {
      setSupplements([]);
      setError(logError.message);
      setLoading(false);
      return;
    }

    const libraryById = new Map(
      ((libraryRows ?? []) as SupplementLibraryRow[]).map((item) => [item.id, item]),
    );
    const takenLogsBySupplement = new Map<string, SupplementLogRow>();

    ((logRows ?? []) as SupplementLogRow[]).forEach((log) => {
      if (log.status !== "skipped") {
        takenLogsBySupplement.set(log.supplement_id, log);
      }
    });

    const nextSupplements = activeRows
      .map((profileSupplement) => {
        const libraryItem = libraryById.get(profileSupplement.supplement_id);

        if (!libraryItem) {
          return null;
        }

        const log = takenLogsBySupplement.get(profileSupplement.supplement_id);
        const dosage =
          formatDosage(profileSupplement.dosage) ||
          formatDosage(libraryItem.default_dosage) ||
          "1";

        return {
          id: profileSupplement.id,
          profileSupplementId: profileSupplement.id,
          supplementId: libraryItem.id,
          name: libraryItem.name,
          description: libraryItem.description ?? "",
          category: libraryItem.category ?? "Supplement",
          dosage,
          unit: libraryItem.unit ?? "",
          timeOfDay: formatTime(profileSupplement.time_of_day),
          isTaken: Boolean(log),
          logId: log?.id ?? null,
        };
      })
      .filter((item): item is DailySupplement => Boolean(item));

    setSupplements(sortByTime(nextSupplements));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadSupplements();
  }, [loadSupplements]);

  const completedCount = useMemo(
    () => supplements.filter((item) => item.isTaken).length,
    [supplements],
  );
  const totalCount = supplements.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;
  const nextTime =
    sortByTime(supplements.filter((item) => !item.isTaken))[0]?.timeOfDay ??
    sortByTime(supplements)[0]?.timeOfDay ??
    supplementContent.defaultNextTime;

  const value = useMemo<SupplementContextValue>(
    () => ({
      supplements,
      loading,
      error,
      completedCount,
      totalCount,
      progress,
      nextTime: toDisplayTime(nextTime),
      refreshSupplements: loadSupplements,
      toggleSupplement: async (supplement) => {
        if (!user || !hasSupabaseConfig) {
          return false;
        }

        if (supplement.logId) {
          const { error: deleteError } = await supabase
            .from("supplement_logs")
            .delete()
            .eq("id", supplement.logId);

          if (deleteError) {
            setError(deleteError.message);
            return false;
          }
        } else {
          const { error: insertError } = await supabase.from("supplement_logs").insert({
            profiles_id: user.id,
            supplement_id: supplement.supplementId,
            taken_at: new Date().toISOString(),
            status: "taken",
          });

          if (insertError) {
            setError(insertError.message);
            return false;
          }
        }

        await loadSupplements();
        return true;
      },
      markAllTaken: async () => {
        if (!user || !hasSupabaseConfig) {
          return false;
        }

        const missing = supplements.filter((item) => !item.isTaken);

        if (missing.length === 0) {
          return true;
        }

        const now = new Date().toISOString();
        const { error: insertError } = await supabase.from("supplement_logs").insert(
          missing.map((item) => ({
            profiles_id: user.id,
            supplement_id: item.supplementId,
            taken_at: now,
            status: "taken",
          })),
        );

        if (insertError) {
          setError(insertError.message);
          return false;
        }

        await loadSupplements();
        return true;
      },
    }),
    [
      completedCount,
      error,
      loadSupplements,
      loading,
      nextTime,
      progress,
      supplements,
      totalCount,
      user,
    ],
  );

  return <SupplementContext.Provider value={value}>{children}</SupplementContext.Provider>;
}

export function useSupplements() {
  const context = useContext(SupplementContext);

  if (!context) {
    throw new Error("useSupplements must be used inside a SupplementProvider");
  }

  return context;
}
