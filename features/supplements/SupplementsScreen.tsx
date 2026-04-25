import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SupplementEmptyState } from "@/features/supplements/components/SupplementEmptyState";
import { SupplementProgressCard } from "@/features/supplements/components/SupplementProgressCard";
import { SupplementRow } from "@/features/supplements/components/SupplementRow";
import { SupplementSectionHeader } from "@/features/supplements/components/SupplementSectionHeader";
import { supplementContent } from "@/features/supplements/data/supplementContent";
import { useSupplements } from "@/features/supplements/context/SupplementContext";
import type { DailySupplement } from "@/features/supplements/types";

export default function SupplementsScreen() {
  const {
    supplements,
    loading,
    error,
    completedCount,
    totalCount,
    progress,
    nextTime,
    toggleSupplement,
    markAllTaken,
  } = useSupplements();

  const allTaken = totalCount > 0 && completedCount === totalCount;

  async function handleToggle(supplement: DailySupplement) {
    await toggleSupplement(supplement);
  }

  async function handleMarkAllTaken() {
    await markAllTaken();
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{supplementContent.title}</Text>
          <Pressable style={styles.addButton}>
            <Feather name="plus" size={26} color="#D8CCFF" />
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#9B8CFF" />
            <Text style={styles.loadingText}>{supplementContent.loadingText}</Text>
          </View>
        ) : error ? (
          <View style={styles.loadingCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : supplements.length === 0 ? (
          <SupplementEmptyState />
        ) : (
          <>
            <SupplementProgressCard
              completed={completedCount}
              total={totalCount}
              progress={progress}
            />

            <View style={styles.stackBlock}>
              <SupplementSectionHeader nextTime={nextTime} />

              <View style={styles.list}>
                {supplements.map((supplement) => (
                  <SupplementRow
                    key={supplement.profileSupplementId}
                    supplement={supplement}
                    onToggle={handleToggle}
                  />
                ))}
              </View>
            </View>

            <Pressable
              onPress={handleMarkAllTaken}
              disabled={allTaken}
              style={[styles.markAllButton, allTaken && styles.markAllButtonDisabled]}
            >
              <Feather
                name="check-circle"
                size={24}
                color={allTaken ? "#2FE0AF" : "#C6CBD5"}
              />
              <Text style={[styles.markAllText, allTaken && styles.markAllTextDone]}>
                {allTaken ? supplementContent.allTaken : supplementContent.markAllTaken}
              </Text>
            </Pressable>
          </>
        )}

        <Text style={styles.footerWarning}>{supplementContent.footerWarning}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#12141E",
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#12141E",
    paddingHorizontal: 6,
    paddingTop: 24,
    paddingBottom: 12,
    gap: 28,
  },
  header: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#252038",
    paddingBottom: 22,
  },
  pageTitle: {
    color: "#F4F5F8",
    fontSize: 28,
    fontWeight: "800",
  },
  addButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#181426",
    borderWidth: 1,
    borderColor: "#7C6FB7",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingCard: {
    minHeight: 180,
    borderRadius: 24,
    backgroundColor: "#12181D",
    borderWidth: 1,
    borderColor: "#3B3550",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 18,
  },
  loadingText: {
    color: "#A8A0C8",
    fontSize: 14,
    fontWeight: "700",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  stackBlock: {
    gap: 17,
  },
  list: {
    gap: 16,
  },
  markAllButton: {
    alignSelf: "center",
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#7C6FB7",
    backgroundColor: "#181426",
  },
  markAllButtonDisabled: {
    opacity: 0.85,
  },
  markAllText: {
    color: "#D8CCFF",
    fontSize: 18,
    fontWeight: "800",
  },
  markAllTextDone: {
    color: "#A7F3D0",
  },
  footerWarning: {
    marginTop: "auto",
    color: "#A7B1C2",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
});
