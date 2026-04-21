export type ProfileFormValues = {
  name: string;
  email: string;
  age: string;
  weight: string;
  height: string;
  activityLevel: string;
};

export const profileContent = {
  title: "Profile",
  personalDetailsTitle: "PERSONAL DETAILS",
  fields: {
    name: "Full Name",
    email: "Email",
    age: "Age",
    weight: "Weight",
    height: "Height",
    activityLevel: "Activity Level",
  },
  stats: {
    bmiLabel: "BMI",
    bmiHelper: "Calculated from your weight and height",
    completionLabel: "PROFILE",
    completionHelper: "Fields filled in your profile",
  },
  actions: {
    privacy: "Privacy & Security",
    help: "Help Center",
    signOut: "Sign Out",
  },
  buildText: "VITAFIT V2.4.0 (BUILD 892)",
} as const;
