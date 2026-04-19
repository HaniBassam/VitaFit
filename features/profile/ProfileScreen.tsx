import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ProfileActions } from "@/features/profile/components/ProfileActions";
import { ProfileDetailsCard } from "@/features/profile/components/ProfileDetailsCard";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { profileContent } from "@/features/profile/data/profileContent";

export default function ProfileScreen() {
  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader />
        <ProfileStats />
        <ProfileDetailsCard />
        <ProfileActions />
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
