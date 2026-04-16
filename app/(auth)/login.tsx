import { router } from "expo-router";

import { AuthScreen } from "@/components/AuthScreen";
import { authContent } from "@/data/authContent";

export default function LoginScreen() {
  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Sign in to continue your workout and supplement tracking."
      buttonLabel="Log In"
      onPrimaryAction={() => router.replace("/home")}
      footerText="No account yet?"
      footerActionLabel="Create one"
      onFooterAction={() => router.push("/signup")}
      bullets={authContent.loginBullets}
    />
  );
}
