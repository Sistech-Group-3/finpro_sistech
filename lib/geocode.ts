/**
 * Geocoding helpers backed by Photon (komoot) — free, keyless, CORS-enabled.
 *
 * Nominatim (openstreetmap.org) aggressively rate-limits (HTTP 429) and
 * returns HTML on failure, so the app talks to Photon instead.
 *
 * Photon search:  GET https://photon.komoot.io/api/?q=<query>&limit=<n>
 * Photon reverse: GET https://photon.komoot.io/reverse?lat=<lat>&lon=<lon>
 * Both return GeoJSON FeatureCollections; coordinates are [lon, lat].
 */

export interface GeocodeResult {
  display_name: string;
  lat: number;
  lon: number;
}

interface PhotonFeature {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

function photonLabel(p: PhotonFeature["properties"]): string {
  return (
    [p.name, p.housenumber, p.street, p.district, p.city, p.state, p.country]
      .filter(Boolean)
      .join(", ")
  );
}

export async function searchLocations(
  query: string,
  limit = 5
): Promise<GeocodeResult[]> {
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (!res.ok) return [];

    const data = await res.json();
    const features: PhotonFeature[] = Array.isArray(data?.features)
      ? data.features
      : [];

    return features
      .map((f) => {
        const [lon, lat] = f.geometry.coordinates;
        return {
          display_name: photonLabel(f.properties),
          lat,
          lon,
        };
      })
      .filter((r) => r.display_name.length > 0);
  } catch {
    return [];
  }
}

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string | null> {
  const details = await reverseGeocodeDetails(lat, lon);
  return details?.display_name ?? null;
}

export interface ReverseGeocodeDetails {
  display_name: string | null;
  city: string | null;
  country: string | null;
}

export async function reverseGeocodeDetails(
  lat: number,
  lon: number
): Promise<ReverseGeocodeDetails | null> {
  try {
    const res = await fetch(
      `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`
    );
    if (!res.ok) return null;

    const data = await res.json();
    const f: PhotonFeature | undefined = data?.features?.[0];
    if (!f) return null;

    const p = f.properties;
    return {
      display_name: photonLabel(p) || null,
      city: p.city || p.district || p.state || null,
      country: p.country || null,
    };
  } catch {
    return null;
  }
}
