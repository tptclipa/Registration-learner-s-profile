import { NextRequest, NextResponse } from "next/server";

const PSGC = "https://psgc.cloud/api";

type PsgcCodeName = { code: string; name: string };

function extractArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const knownKeys = ["provinces", "data", "items", "results"];
    for (const k of knownKeys) {
      const v = obj[k];
      if (Array.isArray(v)) return v;
    }
    // Fallback: find the first array value in the object
    for (const v of Object.values(obj)) {
      if (Array.isArray(v)) return v;
    }
  }
  return [];
}

function normalizeProvince(item: unknown): PsgcCodeName | null {
  if (!item || typeof item !== "object") return null;
  const it = item as Record<string, unknown>;

  const code =
    (it.code as unknown as string | undefined) ??
    (it.codeValue as unknown as string | undefined) ??
    (it.psgcCode as unknown as string | undefined) ??
    (it.id as unknown as string | number | undefined) ??
    (it.provinceCode as unknown as string | number | undefined) ??
    (it.province_code as unknown as string | number | undefined) ??
    "";

  const name =
    (it.name as unknown as string | undefined) ??
    (it.province as unknown as string | undefined) ??
    (it.provinceName as unknown as string | undefined) ??
    (it.province_name as unknown as string | undefined) ??
    "";

  if (!code || !name) return null;
  return { code: String(code), name: String(name) };
}

export async function GET(req: NextRequest) {
  const regionCode = req.nextUrl.searchParams.get("regionCode");
  if (!regionCode) {
    return NextResponse.json({ error: "regionCode is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${PSGC}/regions/${regionCode}/provinces`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) throw new Error(`PSGC responded ${res.status}`);
    const data = await res.json();
    const provincesRaw = extractArray(data);
    const normalized = provincesRaw
      .map((x) => normalizeProvince(x))
      .filter((x): x is PsgcCodeName => Boolean(x));

    return NextResponse.json(normalized);
  } catch (err) {
    console.error("[psgc/provinces]", err);
    return NextResponse.json({ error: "Failed to fetch provinces" }, { status: 502 });
  }
}
