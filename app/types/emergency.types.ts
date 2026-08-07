export type SafePointCategory =
  | "police"
  | "hospital"
  | "fire_station"
  | "shelter"
  | "pharmacy";

export type EmergencyStatus = "active" | "resolved" | "cancelled";

export type NotificationStatus = "pending" | "sent" | "failed";

export type NotifyChannel = "sms" | "call" | "email" | "push";

export interface TrustedContact {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  relationship: string | null;
  priority: number;
  notify_via: NotifyChannel[];
  created_at: string;
}
export type TrustedContactInsert = Omit<TrustedContact, "id" | "user_id" | "created_at"> & {
  user_id?: string; 
};
export type TrustedContactUpdate = Partial<TrustedContactInsert>;

export interface EmergencyEvent {
  id: string;
  user_id: string;
  status: EmergencyStatus;
  alarm_active: boolean;
  latitude: number;
  longitude: number;
  triggered_at: string;
  resolved_at: string | null;
  cancelled_at: string | null;
  note: string | null;
}
export type EmergencyEventInsert = Pick<EmergencyEvent, "latitude" | "longitude"> &
  Partial<Pick<EmergencyEvent, "note">>;

export interface SafePoint {
  id: string;
  name: string;
  category: SafePointCategory;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  is_24h: boolean;
  created_at: string;
}

/** Extra field computed client-side (haversine) from the safe_points table. */
export interface SafePointWithDistance extends SafePoint {
  distance_km: number;
}