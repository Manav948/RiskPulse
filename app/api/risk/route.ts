import { NextResponse } from "next/server";
import { predictRisk } from "@/lib/ml-client";

export async function POST(req: Request) {
  const input = await req.json();
  const result = await predictRisk(input);
  return NextResponse.json(result);
}
