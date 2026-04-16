import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";

import { HomeGreeting, HomeTopBar } from "@/components/home/HomeTopBar";
import { TodayStatusCard } from "@/components/home/TodayStatusCard";
import { WeeklyProgressSection } from "@/components/home/WeeklyProgressSection";

export default function HomeScreen() {
  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HomeTopBar />
        <HomeGreeting />

        <View style={styles.sectionGap}>
          <TodayStatusCard />
        </View>

        <View style={styles.sectionGap}>
          <WeeklyProgressSection />
        </View>

        <View style={styles.bottomSpacer} />
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
    gap: 18,
  },
  sectionGap: {
    gap: 14,
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 8,
  },
});
