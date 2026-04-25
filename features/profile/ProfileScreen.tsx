import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { ProfileActions } from "@/features/profile/components/ProfileActions";
import { ProfileDetailsCard } from "@/features/profile/components/ProfileDetailsCard";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { profileContent, type ProfileFormValues } from "@/features/profile/data/profileContent";
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

const initialFormValues: ProfileFormValues = {
  name: "",
  email: "",
  age: "",
  weight: "",
  height: "",
  activityLevel: "",
};

function parseNumber(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number.parseFloat(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [formValues, setFormValues] =
    useState<ProfileFormValues>(initialFormValues);
  const [savedSnapshot, setSavedSnapshot] =
    useState<ProfileFormValues>(initialFormValues);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      if (!user) {
        setFormValues(initialFormValues);
        setSavedSnapshot(initialFormValues);
        setIsEditing(false);
        setIsLoadingProfile(false);
        return;
      }

      setIsLoadingProfile(true);
      setIsEditing(false);
      setStatusMessage(null);

      const { data, error } = await supabase
        .from("profiles")
        .select("name, email, age, weight, height, activity_level")
        .eq("id", user.id)
        .maybeSingle<ProfileRow>();

      if (!isActive) {
        return;
      }

      if (error) {
        setStatusMessage(error.message);
      }

      const nextValues = {
        name: data?.name ?? (user.user_metadata?.name as string | undefined) ?? "",
        email: data?.email ?? user.email ?? "",
        age: data?.age != null ? String(data.age) : "",
        weight: data?.weight != null ? String(data.weight) : "",
        height: data?.height != null ? String(data.height) : "",
        activityLevel: data?.activity_level ?? "",
      };

      setFormValues(nextValues);
      setSavedSnapshot(nextValues);
      setIsLoadingProfile(false);
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [user]);

  const weight = Number.parseFloat(formValues.weight);
  const height = Number.parseFloat(formValues.height);
  const bmiValue =
    weight > 0 && height > 0 && !Number.isNaN(weight) && !Number.isNaN(height)
      ? (weight / Math.pow(height / 100, 2)).toFixed(1)
      : "--";
  const filledFields = Object.values(formValues).filter((value) => value.trim().length > 0)
    .length;
  const hasUnsavedChanges = Object.entries(formValues).some(
    ([key, value]) => value !== savedSnapshot[key as keyof ProfileFormValues],
  );

  function handleChangeField<K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K],
  ) {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
    setStatusMessage(null);
  }

  function toggleEditing() {
    setIsEditing((current) => !current);
    setStatusMessage(null);
  }

  async function handleSaveProfile() {
    if (!user) {
      setStatusMessage("No active user found.");
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    const payload = {
      id: user.id,
      name: formValues.name.trim() || null,
      email: formValues.email.trim() || user.email || null,
      age: parseNumber(formValues.age),
      weight: parseNumber(formValues.weight),
      height: parseNumber(formValues.height),
      activity_level: formValues.activityLevel.trim() || null,
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      setStatusMessage(error.message);
    } else {
      setSavedSnapshot(formValues);
      setIsEditing(false);
    }

    setIsSaving(false);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    const error = await signOut();

    if (error) {
      setStatusMessage(error);
    }

    setIsSigningOut(false);
  }

  const displayName =
    formValues.name.trim() ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Alex Johnson";

  const subtitle = formValues.email.trim() || user?.email || "Add your email";
  const tagLabel = formValues.activityLevel.trim() || "Set activity level";

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          displayName={displayName}
          subtitle={subtitle}
          tagLabel={tagLabel}
        />

        {isLoadingProfile ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#9B8CFF" />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            <ProfileStats
              bmi={bmiValue}
              filledFields={filledFields}
              totalFields={Object.keys(formValues).length}
            />
            <ProfileDetailsCard
              values={formValues}
              onChangeField={handleChangeField}
              onToggleEditing={toggleEditing}
              onSave={handleSaveProfile}
              isSaving={isSaving}
              isEditing={isEditing}
              hasUnsavedChanges={hasUnsavedChanges}
              statusMessage={statusMessage}
            />
            <ProfileActions
              onSignOut={handleSignOut}
              isSigningOut={isSigningOut}
            />
          </>
        )}

        <Text style={styles.buildText}>{profileContent.buildText}</Text>
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
    paddingHorizontal: 0,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 18,
  },
  loadingCard: {
    marginHorizontal: 18,
    minHeight: 120,
    borderRadius: 22,
    backgroundColor: "#151A22",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  loadingText: {
    color: "#A7B1C2",
    fontSize: 13,
    fontWeight: "600",
  },
  buildText: {
    color: "#5C6474",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
    textAlign: "center",
    marginTop: 2,
    paddingHorizontal: 18,
  },
});
