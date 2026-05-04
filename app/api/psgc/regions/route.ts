import { NextResponse } from "next/server";

const PSGC = "https://psgc.cloud/api";

export async function GET() {
  try {
    const res = await fetch(`${PSGC}/regions`, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`PSGC responded ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[psgc/regions]", err);
    return NextResponse.json({ error: "Failed to fetch regions" }, { status: 502 });
  }
}
