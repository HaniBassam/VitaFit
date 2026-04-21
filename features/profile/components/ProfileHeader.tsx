import { Pressable, StyleSheet, Text, View } from "react-native";

import { profileContent } from "@/features/profile/data/profileContent";

export function ProfileHeader({
  displayName,
  subtitle,
  tagLabel,
}: {
  displayName: string;
  subtitle: string;
  tagLabel: string;
}) {
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <View style={styles.wrapper}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>{profileContent.title}</Text>

        <Pressable style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </Pressable>
      </View>

      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitials}>{initials || "U"}</Text>
        </View>
        <View style={styles.editBadge}>
          <Text style={styles.editBadgeIcon}>✎</Text>
        </View>
      </View>

      <Text style={styles.name}>{displayName}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <View style={styles.tag}>
        <Text style={styles.tagText}>{tagLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingHorizontal: 18,
  },
  pageTitle: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "800",
  },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151B23",
  },
  settingsIcon: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  avatarWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 999,
    backgroundColor: "#FFF5D6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    color: "#1F2937",
    fontSize: 28,
    fontWeight: "800",
  },
  editBadge: {
    position: "absolute",
    right: "32%",
    bottom: -2,
    width: 36,
    height: 36,
    borderRadius: 999,
    backgroundColor: "#31D9A6",
    borderWidth: 3,
    borderColor: "#0B1014",
    alignItems: "center",
    justifyContent: "center",
  },
  editBadgeIcon: {
    color: "#0B1014",
    fontSize: 16,
    fontWeight: "800",
  },
  name: {
    color: "#F8FAFC",
    fontSize: 25,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#A7B1C2",
    fontSize: 14,
    textAlign: "center",
  },
  tag: {
    alignSelf: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#1E7C66",
    backgroundColor: "#10241F",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: {
    color: "#31D9A6",
    fontSize: 13,
    fontWeight: "700",
  },
});
