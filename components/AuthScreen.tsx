import { Feather, Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { authContent } from "@/data/authContent";

type AuthFieldProps = {
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  secureTextEntry?: boolean;
};

function AuthField({ icon, placeholder, secureTextEntry }: AuthFieldProps) {
  return (
    <View style={styles.field}>
      <Feather name={icon} size={18} color="#6B7280" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

type BulletProps = {
  text: string;
};

function Bullet({ text }: BulletProps) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

type AuthScreenProps = {
  title: string;
  subtitle: string;
  buttonLabel: string;
  onPrimaryAction: () => void;
  footerText: string;
  footerActionLabel: string;
  onFooterAction: () => void;
  showNameField?: boolean;
  bullets: readonly string[];
};

export function AuthScreen({
  title,
  subtitle,
  buttonLabel,
  onPrimaryAction,
  footerText,
  footerActionLabel,
  onFooterAction,
  showNameField = false,
  bullets,
}: AuthScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topGlow} />
      <View style={styles.card}>
        <View style={styles.brandMark}>
          <Ionicons name="flash" size={24} color="#0F172A" />
        </View>
        <Text style={styles.brandName}>{authContent.brandName}</Text>
        <Text style={styles.tagline}>{authContent.tagline}</Text>
      </View>

      <View style={styles.headerBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.formCard}>
        {showNameField ? (
          <AuthField icon="user" placeholder="Full name" />
        ) : null}
        <AuthField icon="mail" placeholder="Email address" />
        <AuthField icon="lock" placeholder="Password" secureTextEntry />
        {showNameField ? (
          <AuthField
            icon="lock"
            placeholder="Confirm password"
            secureTextEntry
          />
        ) : null}

        <Pressable onPress={onPrimaryAction} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
        </Pressable>

        <View style={styles.divider} />

        <View style={styles.bulletList}>
          {bullets.map((item) => (
            <Bullet key={item} text={item} />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{footerText}</Text>
        <Pressable onPress={onFooterAction}>
          <Text style={styles.footerAction}>{footerActionLabel}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#050B0D",
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 36,
    gap: 20,
  },
  topGlow: {
    position: "absolute",
    top: -120,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(45, 212, 122, 0.12)",
  },
  card: {
    alignSelf: "center",
    alignItems: "center",
    gap: 8,
  },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#2DD47A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2DD47A",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
  brandName: {
    color: "#F8FAFC",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  tagline: {
    color: "#8A94A6",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  headerBlock: {
    gap: 10,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: "#0C1317",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1C262B",
    gap: 14,
  },
  field: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#10181D",
    borderWidth: 1,
    borderColor: "#202C33",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 15,
    paddingVertical: 0,
  },
  primaryButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#2DD47A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#07110D",
    fontSize: 16,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: "#1C262B",
    marginVertical: 2,
  },
  bulletList: {
    gap: 12,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bulletDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2DD47A",
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    color: "#A7B1C2",
    fontSize: 13,
    lineHeight: 19,
  },
  footer: {
    alignItems: "center",
    gap: 6,
    paddingBottom: 8,
  },
  footerText: {
    color: "#8A94A6",
    fontSize: 13,
  },
  footerAction: {
    color: "#2DD47A",
    fontSize: 13,
    fontWeight: "700",
  },
});
