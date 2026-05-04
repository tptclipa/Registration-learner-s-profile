import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const TEMPLATE_NAMES = ["Learners-Profile.docx", "Learners-Profile..docx"];

/** Docxtemplater wraps template issues in `properties.errors`; top-level message is only "Multi error". */
function formatDocxtemplaterError(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "properties" in error &&
    Array.isArray(
      (error as { properties?: { errors?: unknown[] } }).properties?.errors
    )
  ) {
    const subs = (error as { properties: { errors: unknown[] } }).properties
      .errors;
    return subs
      .map((sub, i) => {
        if (sub && typeof sub === "object") {
          const o = sub as {
            message?: string;
            properties?: { explanation?: string };
          };
          const line = o.properties?.explanation ?? o.message ?? String(sub);
          return `${i + 1}. ${line}`;
        }
        return `${i + 1}. ${String(sub)}`;
      })
      .join("\n");
  }
  if (error instanceof Error) return error.message;
  return String(error);
}

function resolveTemplatePath(): string | null {
  const base = path.join(process.cwd(), "Template");
  for (const name of TEMPLATE_NAMES) {
    const full = path.join(base, name);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

function formatDateNowMMDDYYYY(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

function safeFilenamePart(input: unknown, fallback: string): string {
  if (typeof input !== "string") return fallback;
  const cleaned = input
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ");
  return cleaned.length > 0 ? cleaned : fallback;
}

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as Record<string, unknown>;

    // Ensure {date_now} always has a value in the generated docx.
    // (Docxtemplater nullGetter turns missing keys into "", which appears as blank output.)
    if (
      typeof data.date_now !== "string" ||
      data.date_now.trim().length === 0
    ) {
      data.date_now = formatDateNowMMDDYYYY(new Date());
    }

    const templatePath = resolveTemplatePath();
    if (!templatePath) {
      return NextResponse.json(
        {
          error:
            "Word template not found. Add Learners-Profile.docx under the Template folder at the project root.",
        },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(templatePath);

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      // Missing JSON keys become empty strings instead of template errors
      nullGetter() {
        return "";
      },
    });

    doc.render(data);

    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    const last = safeFilenamePart(data.last_name, "LastName");
    const first = safeFilenamePart(data.first_name, "FirstName");
    const downloadName = `${last}, ${first} - Learners_Profile.docx`;

    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition":
          `attachment; filename="${downloadName}"`,
      },
    });
  } catch (error) {
    console.error("Document generation error:", error);
    const details = formatDocxtemplaterError(error);
    return NextResponse.json(
      {
        error: "Failed to generate document",
        details,
      },
      { status: 500 }
    );
  }
}
