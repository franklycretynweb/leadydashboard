import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function GET() {
  try {
    const { data, error } = await getClient()
      .from("leads")
      .select("*")
      .order("score", { ascending: false })
      .limit(5000);

    if (error) throw error;
    return NextResponse.json({ leads: data ?? [] });
  } catch (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ leads: [], error: String(error) });
  }
}
