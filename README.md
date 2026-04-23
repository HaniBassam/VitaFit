# VitaFit

VitaFit is a mobile fitness tracking app built with Expo, React Native, TypeScript, and Supabase.

The app lets users sign up, log in, manage their profile, create workout templates, choose exercises from an exercise library, and log completed workouts. The database is also prepared for supplement tracking, which is the next feature area to finish in the app.

## Tech Stack

- Expo
- React Native
- TypeScript
- Expo Router
- Supabase Auth
- Supabase Database
- AsyncStorage for persisted auth sessions

## Main Features

- User signup and login with Supabase Auth
- Protected app routes based on auth state
- Profile page connected to the `profiles` table
- Workout template creation
- Exercise library loaded from Supabase
- Workout completion logging
- Bottom tab navigation
- Database structure prepared for supplements

## Project Structure

```txt
app/
  _layout.tsx              Root layout, auth guard, providers, navigation shell
  index.tsx                Redirect entry route
  home.tsx                 Home route
  workout.tsx              Workout route
  workout-template.tsx     Workout template editor route
  exercise-library.tsx     Exercise library route
  supplements.tsx          Supplements route
  profile.tsx              Profile route
  (auth)/
    login.tsx              Login route
    signup.tsx             Signup route

components/
  BrandLogo.tsx
  navigation/
    BottomNav.tsx          Main bottom navigation

features/
  auth/                    Auth UI and text content
  home/                    Home dashboard UI
  profile/                 Profile screen and profile components
  workout/                 Workout screens, context, components, and types

lib/
  supabase.ts              Supabase client setup

providers/
  AuthProvider.tsx         Global auth state and auth actions

scripts/
  seedExercises.js         Imports exercises into Supabase

utils/
  exerciseImagesFallback.ts
```

## How The App Works

The app is organized around Expo Router routes and React context providers.

`app/_layout.tsx` wraps the whole app with:

```tsx
<AuthProvider>
  <WorkoutProvider>
    <AppNavigator />
  </WorkoutProvider>
</AuthProvider>
```

This means all screens can access the logged-in user through `AuthProvider`, and workout screens can access workout data through `WorkoutProvider`.

## Supabase Setup

The Supabase client is created in `lib/supabase.ts`.

The app expects these environment variables:

```txt
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The exercise seed script also requires a service role key:

```txt
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Do not commit real Supabase keys to GitHub.

## Database Tables

The project uses these Supabase tables:

### `profiles`

Stores extra user information that is not stored directly in Supabase Auth.

```txt
id
name
email
age
weight
height
activity_level
created_at
```

The `profiles.id` value matches the logged-in Supabase Auth user id.

### `exercise_library`

Stores reusable exercises that users can choose from when creating workout templates.

```txt
id
name
description
category
muscle_group
equipment
image_url
```

### `workout_plans`

Stores the user's workout templates.

```txt
id
title
category
description
duration_minutes
created_at
user_id
```

### `exercises`

Stores the exercises inside a workout plan.

```txt
id
workout_plan_id
name
sets
reps
```

### `workout_logs`

Stores workout history when a user completes a workout.

```txt
id
user_id
workout_plan_id
completed_at
notes
```

### `supplements`

Stores available supplement definitions.

```txt
id
name
description
category
default_dosage
unit
created_at
```

### `profiles_supplements`

Connects users to the supplements they take.

```txt
id
user_id
supplement_id
dosage
time_of_day
is_active
```

### `supplement_logs`

Stores supplement tracking history.

```txt
id
profiles_id
supplement_id
taken_at
status
```

## Data Flow

### Authentication

1. The user signs up or logs in from the auth screens.
2. `AuthProvider` calls Supabase Auth.
3. Supabase returns a session and user.
4. The app stores the session using AsyncStorage.
5. Protected screens redirect unauthenticated users back to login.

### Profile

1. The profile screen gets the current user from `AuthProvider`.
2. It fetches the matching row from the `profiles` table.
3. The user can edit their details.
4. Saving the profile uses an upsert, so the row is created or updated.

### Workout Templates

1. The workout screen loads workout plans for the current user.
2. `WorkoutProvider` fetches rows from `workout_plans`.
3. It also fetches connected exercises from the `exercises` table.
4. The app combines those rows into workout templates for the UI.

### Creating A Workout

1. The user creates a new template.
2. The app opens the template editor.
3. The user adds exercises from `exercise_library`.
4. The draft template is stored in local React state while editing.
5. When the user saves, the app inserts a row into `workout_plans`.
6. Then it inserts the selected exercises into `exercises`.

### Completing A Workout

1. The user selects a workout template.
2. The user marks exercises as completed.
3. Pressing complete inserts a row into `workout_logs`.
4. This creates a workout history record for that user.

## Current Feature Status

| Area | Status |
| --- | --- |
| Auth | Connected to Supabase |
| Profile | Connected to Supabase |
| Workout templates | Connected to Supabase |
| Exercise library | Connected to Supabase |
| Workout logs | Connected to Supabase |
| Home dashboard | UI built with static demo content |
| Supplements | Database planned, UI not fully connected yet |

## Running The App

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npm start
```

You can also run:

```bash
npm run ios
npm run android
npm run web
```

## Seeding Exercises

The project includes a script that imports exercise data from the WGER exercise API into Supabase.

```bash
node scripts/seedExercises.js
```

The script fetches exercises, formats the data, and upserts rows into the `exercise_library` table.

## Useful Scripts

```bash
npm start
npm run android
npm run ios
npm run web
npm run lint
```

## Presentation Summary

VitaFit uses Supabase as the backend. Supabase Auth handles users, while custom database tables store profiles, workout plans, exercises, workout logs, and supplement data.

The React Native app connects to Supabase through a single client in `lib/supabase.ts`. Authentication state is managed globally in `AuthProvider`, and workout data is managed in `WorkoutProvider`.

When a user creates a workout, the app saves the main workout template in `workout_plans` and saves its exercises in the `exercises` table. When a workout is completed, the app writes a history record into `workout_logs`.

This separates reusable workout templates from completed workout history, making the app easier to expand with progress tracking later.
