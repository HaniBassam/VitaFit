import { useState } from "react";
import { router } from "expo-router";

import { AuthScreen } from "@/features/auth/components/AuthScreen";
import { authContent } from "@/features/auth/data/authContent";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setErrorMessage(null);
    setIsSubmitting(true);

    const error = await signIn(email.trim(), password);

    if (error) {
      setErrorMessage(error);
    } else {
      router.replace("/home");
    }

    setIsSubmitting(false);
  }

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue your workout and supplement tracking."
      buttonLabel="Log In"
      onPrimaryAction={handleLogin}
      primaryLoading={isSubmitting || loading}
      primaryDisabled={!email || !password}
      errorMessage={errorMessage}
      footerText="No account yet?"
      footerActionLabel="Create one"
      onFooterAction={() => router.push("/signup")}
      bullets={authContent.loginBullets}
      emailValue={email}
      passwordValue={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
    />
  );
}
