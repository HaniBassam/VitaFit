import { router } from "expo-router";

import { AuthScreen } from "@/components/AuthScreen";
import { authContent } from "@/data/authContent";

export default function SignupScreen() {
  return (
    <AuthScreen
      title="Create account"
      subtitle="Set up your profile so you can start tracking your routine."
      buttonLabel="Sign Up"
      footerText="Already have an account?"
      footerActionLabel="Log in"
      onFooterAction={() => router.push("/login")}
      showNameField
      bullets={authContent.signupBullets}
    />
  );
}
