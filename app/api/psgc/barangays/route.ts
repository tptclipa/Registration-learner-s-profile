import { NextRequest, NextResponse } from "next/server";

const PSGC = "https://psgc.cloud/api";

type PsgcCodeName = { code: string; name: string };

function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const knownKeys = ["barangays", "data", "items", "results"];
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

function normalizeBarangay(item: unknown): PsgcCodeName | null {
  if (!item || typeof item !== "object") return null;
  const it = item as Record<string, unknown>;

  const code =
    (it.code as unknown as string | undefined) ??
    (it.codeValue as unknown as string | undefined) ??
    (it.psgcCode as unknown as string | undefined) ??
    (it.id as unknown as string | number | undefined) ??
    (it.barangayCode as unknown as string | number | undefined) ??
    (it.barangay_code as unknown as string | number | undefined) ??
    "";

  const name =
    (it.name as unknown as string | undefined) ??
    (it.barangay as unknown as string | undefined) ??
    (it.barangayName as unknown as string | undefined) ??
    (it.barangay_name as unknown as string | undefined) ??
    "";

  if (!code || !name) return null;
  return { code: String(code), name: String(name) };
}

export async function GET(req: NextRequest) {
  const cityCode = req.nextUrl.searchParams.get("cityCode");
  if (!cityCode) {
    return NextResponse.json({ error: "cityCode is required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${PSGC}/cities-municipalities/${cityCode}/barangays`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) throw new Error(`PSGC responded ${res.status}`);
    const data = await res.json();
    const barangaysRaw = extractArray(data);
    const normalized = barangaysRaw
      .map((x) => normalizeBarangay(x))
      .filter((x): x is PsgcCodeName => Boolean(x));
    return NextResponse.json(normalized);
  } catch (err) {
    console.error("[psgc/barangays]", err);
    return NextResponse.json({ error: "Failed to fetch barangays" }, { status: 502 });
  }
}
