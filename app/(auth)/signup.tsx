import { useState } from "react";
import { router } from "expo-router";

import { AuthScreen } from "@/components/AuthScreen";
import { authContent } from "@/data/authContent";
import { useAuth } from "@/providers/AuthProvider";

export default function SignupScreen() {
  const { signUp, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignup() {
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const error = await signUp({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(error);
    } else {
      router.replace("/home");
    }

    setIsSubmitting(false);
  }

  return (
    <AuthScreen
      title="Create account"
      subtitle="Set up your profile so you can start tracking your routine."
      buttonLabel="Sign Up"
      onPrimaryAction={handleSignup}
      primaryLoading={isSubmitting || loading}
      primaryDisabled={!name || !email || !password || !confirmPassword}
      errorMessage={errorMessage}
      footerText="Already have an account?"
      footerActionLabel="Log in"
      onFooterAction={() => router.push("/login")}
      showNameField
      bullets={authContent.signupBullets}
      nameValue={name}
      emailValue={email}
      passwordValue={password}
      confirmPasswordValue={confirmPassword}
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onConfirmPasswordChange={setConfirmPassword}
    />
  );
}
