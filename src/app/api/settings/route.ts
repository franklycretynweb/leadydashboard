import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SETTINGS_FILE = path.join(process.cwd(), "..", "data", "settings.json");

export async function GET() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const content = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return NextResponse.json({ settings: JSON.parse(content) });
    }
    return NextResponse.json({ settings: null });
  } catch (error) {
    return NextResponse.json({ settings: null, error: String(error) });
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json();
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
