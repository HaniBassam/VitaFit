import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  profileContent,
  type ProfileFormValues,
} from "@/features/profile/data/profileContent";

type ProfileDetailsCardProps = {
  values: ProfileFormValues;
  onChangeField: <K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K],
  ) => void;
  onToggleEditing: () => void;
  onSave: () => void;
  isSaving: boolean;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  statusMessage?: string | null;
};

function DetailField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  isEditing,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "numeric";
  isEditing: boolean;
}) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <View style={styles.detailIcon}>
          <Text style={styles.detailIconText}>•</Text>
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        keyboardType={keyboardType}
        editable={isEditing}
        style={[styles.detailInput, !isEditing && styles.detailInputLocked]}
      />
    </View>
  );
}

export function ProfileDetailsCard({
  values,
  onChangeField,
  onToggleEditing,
  onSave,
  isSaving,
  isEditing,
  hasUnsavedChanges,
  statusMessage,
}: ProfileDetailsCardProps) {
  return (
    <View style={styles.detailsCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.sectionTitle}>
          {profileContent.personalDetailsTitle}
        </Text>
        {!isEditing ? (
          <Pressable onPress={onToggleEditing} style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </Pressable>
        ) : null}
      </View>

      <Text style={styles.sectionHint}>
        Tap Change to edit your details. They are saved to your own profile in
        Supabase.
      </Text>

      <DetailField
        label={profileContent.fields.name}
        value={values.name}
        onChangeText={(text) => onChangeField("name", text)}
        placeholder="Your full name"
        isEditing={isEditing}
      />
      <DetailField
        label={profileContent.fields.email}
        value={values.email}
        onChangeText={(text) => onChangeField("email", text)}
        placeholder="Your email"
        keyboardType="email-address"
        isEditing={isEditing}
      />
      <DetailField
        label={profileContent.fields.age}
        value={values.age}
        onChangeText={(text) => onChangeField("age", text)}
        placeholder="Age"
        keyboardType="numeric"
        isEditing={isEditing}
      />
      <DetailField
        label={profileContent.fields.weight}
        value={values.weight}
        onChangeText={(text) => onChangeField("weight", text)}
        placeholder="kg"
        keyboardType="numeric"
        isEditing={isEditing}
      />
      <DetailField
        label={profileContent.fields.height}
        value={values.height}
        onChangeText={(text) => onChangeField("height", text)}
        placeholder="cm"
        keyboardType="numeric"
        isEditing={isEditing}
      />
      <DetailField
        label={profileContent.fields.activityLevel}
        value={values.activityLevel}
        onChangeText={(text) => onChangeField("activityLevel", text)}
        placeholder="Moderate"
        isEditing={isEditing}
      />

      <Pressable
        style={[
          styles.saveButton,
          (!isEditing || isSaving || !hasUnsavedChanges) &&
            styles.saveButtonDisabled,
        ]}
        onPress={onSave}
        disabled={isSaving || !hasUnsavedChanges || !isEditing}
      >
        {isSaving ? (
          <ActivityIndicator color="#141022" />
        ) : (
          <Text style={styles.saveButtonText}>Save profile</Text>
        )}
      </Pressable>

      {statusMessage ? (
        <Text
          style={[
            styles.statusText,
            statusMessage.toLowerCase().includes("saved")
              ? styles.statusSuccess
              : styles.statusError,
          ]}
        >
          {statusMessage}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  detailsCard: {
    backgroundColor: "#151A22",
    borderRadius: 22,
    padding: 16,
    gap: 14,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: "#3B3550",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  changeButton: {
    minHeight: 30,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#181426",
    borderWidth: 1,
    borderColor: "#7C6FB7",
    alignItems: "center",
    justifyContent: "center",
  },
  changeButtonText: {
    color: "#D8CCFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  sectionTitle: {
    color: "#B0B8C7",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  sectionHint: {
    color: "#8A94A6",
    fontSize: 12,
    lineHeight: 18,
  },
  detailRow: {
    minHeight: 58,
    flexDirection: "column",
    width: "100%",
    gap: 12,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#231D33",
    alignItems: "center",
    justifyContent: "center",
  },
  detailIconText: {
    color: "#D8CCFF",
    fontSize: 18,
    fontWeight: "900",
  },
  detailLabel: {
    color: "#D8DDE6",
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },
  detailInput: {
    flex: 1,
    minWidth: 120,
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "right",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "#10161D",
    borderWidth: 1,
    borderColor: "#4D4566",
  },
  detailInputLocked: {
    opacity: 0.6,
  },
  saveButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#9B8CFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  saveButtonDisabled: {
    opacity: 0.55,
  },
  saveButtonText: {
    color: "#141022",
    fontSize: 15,
    fontWeight: "800",
  },
  statusText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  statusSuccess: {
    color: "#D8CCFF",
  },
  statusError: {
    color: "#FCA5A5",
  },
});
