import { supabase } from '@/lib/supabase/client';

export interface ReportPayload {
  /** Maps to `category` column */
  category: string;
  /** Maps to `description` column */
  description: string;
  /** Maps to `is_anonymous` column */
  isAnonymous: boolean;
  /** Maps to `incident_date` column — the datetime the incident occurred */
  dateTime: string;
  /** Maps to `latitude` + `longitude` columns */
  coords: [number, number];
  /** Maps to `location_label` column */
  locationLabel: string;
  /** If provided, uploaded to evidence_media storage → maps to `media_url` column */
  file: File | null;
}

/**
 * Submits an incident report to Supabase.
 * Uploads media to the evidence_media storage bucket if a file is provided.
 * Returns the inserted row id on success, or throws an error.
 */
export async function submitReport(payload: ReportPayload): Promise<{ id: string }> {
  const {
    category,
    description,
    isAnonymous,
    dateTime,
    coords,
    locationLabel,
    file,
  } = payload;

  // 1. Upload media file if provided
  let mediaUrl: string | null = null;

  if (file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('evidence_media')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Media upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('evidence_media')
      .getPublicUrl(fileName);

    mediaUrl = publicUrlData.publicUrl;
  }

  // 2. Get current user id (null when anonymous or not logged in)
  let userId: string | null = null;
  if (!isAnonymous) {
    const { data: { user } } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }

  // 3. Insert into incident_reports
  const { data, error: insertError } = await supabase
    .from('incident_reports')
    .insert([
      {
        category,
        description,
        is_anonymous: isAnonymous,
        incident_date: dateTime || null,
        latitude: coords[0],
        longitude: coords[1],
        location_label: locationLabel || null,
        media_url: mediaUrl,
        post_type: 'full_report',
        status: 'Pending Review',
        user_id: userId,
      },
    ])
    .select('id')
    .single();

  if (insertError) {
    throw new Error(`Failed to save report: ${insertError.message}`);
  }

  return { id: data.id };
}
