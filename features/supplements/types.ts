export type SupplementLibraryRow = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  default_dosage: number | null;
  unit: string | null;
  created_at: string | null;
};

export type ProfileSupplementRow = {
  id: string;
  user_id: string;
  supplement_id: string;
  dosage: number | null;
  time_of_day: string | null;
  is_active: boolean | null;
};

export type SupplementLogRow = {
  id: string;
  profiles_id: string;
  supplement_id: string;
  taken_at: string;
  status: string | null;
};

export type DailySupplement = {
  id: string;
  profileSupplementId: string;
  supplementId: string;
  name: string;
  description: string;
  category: string;
  dosage: string;
  unit: string;
  timeOfDay: string;
  isTaken: boolean;
  logId: string | null;
};
