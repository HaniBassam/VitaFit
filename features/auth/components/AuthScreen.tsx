import { Feather } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BrandLogo } from "@/components/BrandLogo";
import { authContent } from "@/features/auth/data/authContent";

type AuthFieldProps = {
  icon: keyof typeof Feather.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address";
};

function AuthField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize = "none",
  keyboardType = "default",
}: AuthFieldProps) {
  return (
    <View style={styles.field}>
      <Feather name={icon} size={18} color="#6B7280" />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
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
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  errorMessage?: string | null;
  footerText: string;
  footerActionLabel: string;
  onFooterAction: () => void;
  showNameField?: boolean;
  bullets: readonly string[];
  nameValue?: string;
  emailValue: string;
  passwordValue: string;
  confirmPasswordValue?: string;
  onNameChange?: (text: string) => void;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onConfirmPasswordChange?: (text: string) => void;
};

export function AuthScreen({
  title,
  subtitle,
  buttonLabel,
  onPrimaryAction,
  primaryDisabled = false,
  primaryLoading = false,
  errorMessage,
  footerText,
  footerActionLabel,
  onFooterAction,
  showNameField = false,
  bullets,
  nameValue = "",
  emailValue,
  passwordValue,
  confirmPasswordValue = "",
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
}: AuthScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topGlow} />
      <View style={styles.card}>
        <BrandLogo width={174} height={140} scale={2} />
        <Text style={styles.brandName}>{authContent.brandName}</Text>
        <Text style={styles.tagline}>{authContent.tagline}</Text>
      </View>

      <View style={styles.headerBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.formCard}>
        {showNameField ? (
          <AuthField
            icon="user"
            placeholder="Full name"
            autoCapitalize="words"
            value={nameValue}
            onChangeText={onNameChange ?? (() => {})}
          />
        ) : null}
        <AuthField
          icon="mail"
          placeholder="Email address"
          keyboardType="email-address"
          value={emailValue}
          onChangeText={onEmailChange}
        />
        <AuthField
          icon="lock"
          placeholder="Password"
          secureTextEntry
          value={passwordValue}
          onChangeText={onPasswordChange}
        />
        {showNameField ? (
          <AuthField
            icon="lock"
            placeholder="Confirm password"
            secureTextEntry
            value={confirmPasswordValue}
            onChangeText={onConfirmPasswordChange ?? (() => {})}
          />
        ) : null}

        <Pressable
          disabled={primaryDisabled || primaryLoading}
          onPress={onPrimaryAction}
          style={[
            styles.primaryButton,
            (primaryDisabled || primaryLoading) && styles.primaryButtonDisabled,
          ]}
        >
          {primaryLoading ? (
            <ActivityIndicator color="#07110D" />
          ) : (
            <Text style={styles.primaryButtonText}>{buttonLabel}</Text>
          )}
        </Pressable>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

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
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    color: "#F8FAFC",
    fontSize: 15,
    paddingVertical: 14,
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: "#36D280",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#07110D",
    fontSize: 16,
    fontWeight: "800",
  },
  errorText: {
    color: "#FCA5A5",
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#1A2428",
  },
  bulletList: {
    gap: 10,
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
    backgroundColor: "#36D280",
    marginTop: 6,
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
  },
  footerText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  footerAction: {
    color: "#36D280",
    fontSize: 14,
    fontWeight: "700",
  },
});
