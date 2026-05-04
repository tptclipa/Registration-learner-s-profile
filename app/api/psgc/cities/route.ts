import { NextRequest, NextResponse } from "next/server";

const PSGC = "https://psgc.cloud/api";

type PsgcCity = { code: string; name: string; district?: string };

function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const knownKeys = ["citiesMunicipalities", "cities-municipalities", "data", "items", "results", "cities"];
    for (const k of knownKeys) {
      const v = obj[k];
      if (Array.isArray(v)) return v;
    }
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function normalizeCity(item: unknown): PsgcCity | null {
  if (!item || typeof item !== "object") return null;
  const it = item as Record<string, unknown>;

  const code =
    (it.code as unknown as string | undefined) ??
    (it.codeValue as unknown as string | undefined) ??
    (it.psgcCode as unknown as string | undefined) ??
    (it.id as unknown as string | number | undefined) ??
    "";

  const name =
    (it.name as unknown as string | undefined) ??
    (it.city as unknown as string | undefined) ??
    (it.cityMunicipality as unknown as string | undefined) ??
    (it.city_name as unknown as string | undefined) ??
    (it.municipality as unknown as string | undefined) ??
    "";

  if (!code || !name) return null;

  const district =
    (it.district as unknown as string | undefined) ??
    (it.psgcDistrict as unknown as string | undefined) ??
    (it.legislativeDistrict as unknown as string | undefined) ??
    undefined;

  return {
    code: String(code),
    name: String(name),
    district: district ? String(district) : undefined,
  };
}

/**
 * Fetches cities/municipalities.
 * - provinceCode provided  → /provinces/:code/cities-municipalities
 * - regionCode only        → /regions/:code/cities-municipalities  (NCR / no-province regions)
 */
export async function GET(req: NextRequest) {
  const provinceCode = req.nextUrl.searchParams.get("provinceCode");
  const regionCode = req.nextUrl.searchParams.get("regionCode");

  if (!provinceCode && !regionCode) {
    return NextResponse.json(
      { error: "provinceCode or regionCode is required" },
      { status: 400 }
    );
  }

  const segment = provinceCode
    ? `provinces/${provinceCode}`
    : `regions/${regionCode}`;

  try {
    const res = await fetch(`${PSGC}/${segment}/cities-municipalities`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`PSGC responded ${res.status}`);
    const data = await res.json();
    const citiesRaw = extractArray(data);
    const normalized = citiesRaw
      .map((x) => normalizeCity(x))
      .filter((x): x is PsgcCity => Boolean(x));

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("[psgc/cities]", err);
    return NextResponse.json({ error: "Failed to fetch cities/municipalities" }, { status: 502 });
  }
}
