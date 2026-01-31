import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // later ML will use this
  const {
    commitsLast7Days,
    deadlineDays,
    taskCompletionRate,
    openBugs,
  } = body;

  return NextResponse.json({
    failureRisk: 0.72,
    confidence: 0.86,
    topReasons: [
      commitsLast7Days < 3 && "Low commit activity",
      deadlineDays < 7 && "Deadline approaching",
      taskCompletionRate < 0.6 && "Low task completion",
      openBugs > 3 && "High bug count",
    ].filter(Boolean),
    recommendations: [
      "Increase daily commits",
      "Start testing immediately",
      "Fix high-priority bugs",
    ],
  });
}
