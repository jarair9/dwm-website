import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("lots").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: "degraded",
          timestamp: new Date().toISOString(),
          service: "distinct-mineral-world",
          db: "error",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "distinct-mineral-world",
      db: "ok",
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        service: "distinct-mineral-world",
        db: "unreachable",
      },
      { status: 503 }
    );
  }
}
