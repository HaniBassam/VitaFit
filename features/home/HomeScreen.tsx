import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";

import { HomeHeroCard } from "@/features/home/components/HomeHeroCard";
import { HomeTopBar } from "@/features/home/components/HomeTopBar";
import { TodayStatusCard } from "@/features/home/components/TodayStatusCard";
import { WeeklyProgressSection } from "@/features/home/components/WeeklyProgressSection";
import { useSupplements } from "@/features/supplements/context/SupplementContext";
import { useWorkout } from "@/features/workout/context/WorkoutContext";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

type ProfileRow = {
  name: string | null;
  email: string | null;
  age: number | null;
  weight: number | null;
  height: number | null;
  activity_level: string | null;
};

type WeeklyDay = {
  label: string;
  completed: boolean;
};

function dateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getWeekRange() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  const end = new Date(today);
  end.setDate(end.getDate() + 1);
  end.setHours(0, 0, 0, 0);

  const days = Array.from({ length: 7 }, (_, index) => {
    const current = new Date(start);
    current.setDate(start.getDate() + index);

    return current;
  });

  return { start, end, days };
}

function buildNote({
  activeDayCount,
  workoutDoneToday,
  supplementsDoneToday,
  remainingSupplements,
}: {
  activeDayCount: number;
  workoutDoneToday: boolean;
  supplementsDoneToday: boolean;
  remainingSupplements: number;
}) {
  if (workoutDoneToday && supplementsDoneToday) {
    return {
      title: "Great work today",
      body: "Your workout and supplement stack are both complete. Keep the streak alive tomorrow.",
    };
  }

  if (workoutDoneToday) {
    return {
      title: "Workout done",
      body:
        remainingSupplements > 0
          ? `${remainingSupplements} supplements left for today.`
          : "Your supplements are complete for today.",
    };
  }

  if (supplementsDoneToday) {
    return {
      title: "Supplements done",
      body: "Your supplement stack is complete. Time to log a workout.",
    };
  }

  if (activeDayCount > 0) {
    return {
      title: "Keep it up!",
      body: `You've been active on ${activeDayCount} of the last 7 days. Stay consistent.`,
    };
  }

  return {
    title: "Ready when you are",
    body: "Log a workout or take your supplements to start the week.",
  };
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { templates, activeTemplateId, completedExerciseIds, completedTodayPlanIds } =
    useWorkout();
  const { completedCount, totalCount, nextTime } = useSupplements();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [weeklyDays, setWeeklyDays] = useState<WeeklyDay[]>([]);

  useEffect(() => {
    let isActive = true;

    async function loadHomeData() {
      if (!user) {
        setProfile(null);
        setWeeklyDays([]);
        return;
      }

      const { start, end, days } = getWeekRange();
      const startIso = start.toISOString();
      const endIso = end.toISOString();

      const [profileResult, workoutResult, supplementResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("name, email, age, weight, height, activity_level")
          .eq("id", user.id)
          .maybeSingle<ProfileRow>(),
        supabase
          .from("workout_logs")
          .select("completed_at")
          .eq("user_id", user.id)
          .gte("completed_at", startIso)
          .lt("completed_at", endIso),
        supabase
          .from("supplement_logs")
          .select("taken_at, status")
          .eq("profiles_id", user.id)
          .gte("taken_at", startIso)
          .lt("taken_at", endIso),
      ]);

      if (!isActive) {
        return;
      }

      const profileData = profileResult.data ?? null;
      const workoutDates = new Set(
        (workoutResult.data ?? []).map((row) => dateKey(new Date(row.completed_at))),
      );
      const supplementDates = new Set(
        (supplementResult.data ?? [])
          .filter((row) => row.status !== "skipped")
          .map((row) => dateKey(new Date(row.taken_at))),
      );

      setProfile(profileData);
      setWeeklyDays(
        days.map((day) => {
          const key = dateKey(day);

          return {
            label: new Intl.DateTimeFormat("en-US", {
              weekday: "short",
            })
              .format(day)
              .slice(0, 1)
              .toUpperCase(),
            completed: workoutDates.has(key) || supplementDates.has(key),
          };
        }),
      );
    }

    void loadHomeData();

    return () => {
      isActive = false;
    };
  }, [user]);

  const email = user?.user_metadata?.email as string | undefined;
  const displayName =
    profile?.name?.trim() ||
    (user?.user_metadata?.name as string | undefined) ||
    email?.split("@")[0] ||
    user?.email?.split("@")[0] ||
    "there";
  const firstName = displayName.split(" ")[0] || displayName;
  const dateText = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date());

  const filledProfileFields = [
    profile?.name,
    profile?.email ?? user?.email ?? null,
    profile?.age,
    profile?.weight,
    profile?.height,
    profile?.activity_level,
  ].filter((value) => value != null && `${value}`.trim().length > 0).length;
  const totalProfileFields = 6;
  const weight = profile?.weight ?? null;
  const height = profile?.height ?? null;
  const bmi =
    weight && height && height > 0
      ? (weight / Math.pow(height / 100, 2)).toFixed(1)
      : null;
  const activeTemplate = templates.find((template) => template.id === activeTemplateId) ?? null;
  const workoutDoneToday = activeTemplate
    ? completedTodayPlanIds.includes(activeTemplate.id)
    : false;
  const supplementsDoneToday = totalCount > 0 && completedCount === totalCount;
  const remainingSupplements = Math.max(totalCount - completedCount, 0);
  const completionLabel = `${Math.round(
    ((Number(workoutDoneToday) + Number(supplementsDoneToday)) / 2) * 100,
  )}% Complete`;
  const workoutValue = activeTemplate?.title ?? `${templates.length} templates`;
  const workoutMeta =
    activeTemplate && activeTemplate.exercises.length > 0
      ? `${completedExerciseIds.length} of ${activeTemplate.exercises.length} done`
      : "Ready to train";
  const profileValue = `${filledProfileFields}/${totalProfileFields}`;
  const profileMeta = bmi ? `BMI ${bmi}` : "Fill profile details";
  const supplementValue = `${completedCount}/${totalCount}`;
  const supplementMeta = `Next ${nextTime}`;
  const note = buildNote({
    activeDayCount: weeklyDays.filter((day) => day.completed).length,
    workoutDoneToday,
    supplementsDoneToday,
    remainingSupplements,
  });

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeTopBar />
        <HomeHeroCard
          displayName={firstName}
          dateText={dateText}
          profileValue={profileValue}
          profileMeta={profileMeta}
          workoutValue={workoutValue}
          workoutMeta={workoutMeta}
          supplementsValue={supplementValue}
          supplementsMeta={supplementMeta}
        />

        <TodayStatusCard
          completionLabel={completionLabel}
          workoutTitle="Workout Status"
          workoutSubtitle={
            workoutDoneToday
              ? `${activeTemplate?.title ?? "Workout"} • done today`
              : `${activeTemplate?.title ?? "Workout"} • ${completedExerciseIds.length} done`
          }
          workoutDone={workoutDoneToday}
          supplementsTitle="Supplements Status"
          supplementsSubtitle={
            totalCount > 0
              ? `VITAMINS & MINERALS • ${completedCount} OF ${totalCount} TAKEN`
              : "No supplements yet"
          }
          supplementsDone={supplementsDoneToday}
          workoutActionLabel="Log Workout"
          supplementsActionLabel="Log Supplements"
        />

        <WeeklyProgressSection days={weeklyDays} noteTitle={note.title} noteBody={note.body} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
    gap: 14,
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 8,
  },
});
