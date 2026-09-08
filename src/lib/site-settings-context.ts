import { supabase } from "@/lib/supabase";
import type { Doctor } from "@/lib/types";

// Fallback branding used until an admin picks a doctor to feature.
export const DEFAULT_HOSPITAL_NAME = "MediCare General Hospital";

/**
 * Loads the doctor currently marked as "featured" in site_settings (id = 1).
 * Returns null if no featured doctor has been set yet (or the doctor was
 * deleted), in which case callers should fall back to DEFAULT_HOSPITAL_NAME.
 */
export async function getFeaturedDoctor(): Promise<Doctor | null> {
  const { data: settings, error: settingsError } = await supabase
    .from("site_settings")
    .select("active_doctor_id")
    .eq("id", 1)
    .maybeSingle();

  if (settingsError || !settings?.active_doctor_id) return null;

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", settings.active_doctor_id)
    .maybeSingle();

  if (doctorError) return null;
  return doctor ?? null;
}

/**
 * Marks a doctor as "featured" — this is what the admin dashboard's
 * "Set Featured Doctor" dropdown + Save button calls. Pass null to clear it
 * and revert the site to the default branding.
 */
export async function setFeaturedDoctor(doctorId: string | null) {
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: 1,
        active_doctor_id: doctorId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  return { error };
}
