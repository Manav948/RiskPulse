import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.json();
  // TODO: Process GitHub webhook payload
  // Extract commit data, update project signals
  console.log("GitHub webhook:", payload);
  return NextResponse.json({ status: "ok" });
}