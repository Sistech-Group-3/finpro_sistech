import { NextRequest, NextResponse } from "next/server";

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL ?? "http://localhost:8000";

const ROUTE_TIMEOUT_MS = 120_000;

export const dynamic = "force-dynamic";

/**
 * BFF proxy for the ML service safe-route endpoints.
 *
 * The browser calls this route handler, which forwards to the FastAPI
 * service (`/route/v1` or `/route/v2`) so the ML base URL never leaks
 * into the client bundle and failures can be normalized here.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const lat1 = searchParams.get("lat1");
  const lon1 = searchParams.get("lon1");
  const lat2 = searchParams.get("lat2");
  const lon2 = searchParams.get("lon2");
  const datetime = searchParams.get("datetime");
  const version = searchParams.get("version") ?? "v1";

  if (!lat1 || !lon1 || !lat2 || !lon2 || !datetime) {
    return NextResponse.json(
      {
        error:
          "Missing required query parameters: lat1, lon1, lat2, lon2, datetime",
      },
      { status: 400 }
    );
  }

  if (version !== "v1" && version !== "v2") {
    return NextResponse.json(
      { error: "version must be 'v1' or 'v2'" },
      { status: 400 }
    );
  }

  const endpoint = version === "v2" ? "/route/v2" : "/route/v1";

  const params = new URLSearchParams({
    lat1,
    lon1,
    lat2,
    lon2,
    datetime,
  });

  const k = searchParams.get("k");
  if (version === "v1" && k) params.set("k", k);

  const nRoutes = searchParams.get("n_routes");
  const penaltyFactor = searchParams.get("penalty_factor");
  if (version === "v2") {
    if (nRoutes) params.set("n_routes", nRoutes);
    if (penaltyFactor) params.set("penalty_factor", penaltyFactor);
  }

  try {
    const res = await fetch(`${ML_SERVICE_URL}${endpoint}?${params}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(ROUTE_TIMEOUT_MS),
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        {
          error: `ML service returned ${res.status}`,
          detail,
        },
        { status: res.status >= 500 ? 502 : res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to reach the ML route service", detail: message },
      { status: 503 }
    );
  }
}
