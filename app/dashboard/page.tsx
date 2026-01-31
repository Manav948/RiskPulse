"use client";

import { mockProject } from "@/lib/mock-project";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [risk, setRisk] = useState<any>(null);

useEffect(() => {
  fetch("/api/risk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mockProject),
  })
    .then(res => res.json())
    .then(setRisk);
}, []);

  if (!risk) return <p>Loading...</p>;

  return (
    <div>
      <h1>Failure Risk: {risk.failureRisk * 100}%</h1>
      <p>Confidence: {risk.confidence * 100}%</p>

      <h3>Top Reasons</h3>
      <ul>
        {risk.topReasons.map((r: string) => (
          <li key={r}>{r}</li>
        ))}
      </ul>

      <h3>Recommendations</h3>
      <ul>
        {risk.recommendations.map((r: string) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
