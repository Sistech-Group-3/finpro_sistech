// Geocoding helpers backed by Photon (komoot.io) — keyless, CORS-enabled,
// and not rate-limited like Nominatim (which returns HTTP 429 on this IP).

const PHOTON_BASE = "https://photon.komoot.io";

export interface GeocodeResult {
  display_name: string;
  lat: string;
  lon: string;
}

function formatName(properties: Record<string, unknown>): string {
  const parts = [
    properties.name,
    properties.housenumber,
    properties.street,
    properties.district,
    properties.city,
    properties.county,
    properties.state,
    properties.country,
  ];
  const joined = parts
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .join(", ");
  return joined || "Unknown location";
}

function toGeocodeResult(feature: {
  properties?: Record<string, unknown>;
  geometry?: { coordinates?: [number, number] };
}): GeocodeResult {
  const [lon, lat] = feature.geometry?.coordinates ?? [0, 0];
  return {
    display_name: formatName(feature.properties ?? {}),
    lat: String(lat),
    lon: String(lon),
  };
}

export async function searchLocations(
  query: string,
  limit = 5
): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
    lang: "id",
  });
  const res = await fetch(`${PHOTON_BASE}/api/?${params.toString()}`);
  if (!res.ok) throw new Error(`Location search failed: ${res.status}`);
  const data = await res.json();
  return (data.features ?? []).map(toGeocodeResult);
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string | null> {
  try {
    const res = await fetch(
      `${PHOTON_BASE}/reverse?lat=${lat}&lon=${lon}&lang=id`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const feature = data.features?.[0];
    return feature ? formatName(feature.properties ?? {}) : null;
  } catch {
    return null;
  }
}

export interface ReverseGeocodeDetails {
  city: string;
  country: string;
}

export async function reverseGeocodeDetails(
  lat: number,
  lon: number
): Promise<ReverseGeocodeDetails | null> {
  try {
    const res = await fetch(
      `${PHOTON_BASE}/reverse?lat=${lat}&lon=${lon}&lang=id`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const props = data.features?.[0]?.properties ?? {};
    const city =
      props.city ||
      props.town ||
      props.village ||
      props.district ||
      props.county ||
      "";
    const country = props.country || "";
    return { city, country };
  } catch {
    return null;
  }
}
