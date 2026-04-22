import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "status required" }, { status: 400 });
    }

    const { error } = await getClient()
      .from("leads")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true, id, status });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
