"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { gsap } from "gsap";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { GitHubConnectDialog } from "@/components/GitHubConnectDialog";
import { RiskGauge } from "@/components/RiskGauge";

const mockTrendData = [
  { day: "Mon", risk: 20 },
  { day: "Tue", risk: 25 },
  { day: "Wed", risk: 30 },
  { day: "Thu", risk: 45 },
  { day: "Fri", risk: 60 },
  { day: "Sat", risk: 74 },
  { day: "Sun", risk: 70 },
];

export default function DashboardPage() {
  const [risk, setRisk] = useState<any>(null);

  useEffect(() => {
    fetch("/api/risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commitsLast7Days: 5,
        deadlineDays: 14,
        taskCompletionRate: 0.6,
        openBugs: 12,
      }),
    })
      .then(res => res.json())
      .then(setRisk);
  }, []);

  const handleCardHover = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 });
  };

  const handleCardLeave = (e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
  };

  if (!risk) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-cyan-400 text-xl"
      >
        Loading risk assessment...
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-black text-white bg-clip-text">
              Project Risk Dashboard
            </h1>
            <p className="text-slate-300">AI-powered insights to keep your projects on track</p>
          </div>
          <div className="flex gap-4">
            <CreateProjectDialog>
              <Button className="bg-black text-white border-white border-2 rounded-2xl px-6 py-3">
                Create New Project
              </Button>
            </CreateProjectDialog>
            <GitHubConnectDialog>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-6 py-3">
                Connect GitHub
              </Button>
            </GitHubConnectDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl hover:shadow-lg transition-shadow"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardHeader>
                <CardTitle className="text-cyan-400">Failure Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskGauge risk={risk.failureRisk} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              className="bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl hover:shadow-lg transition-shadow"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardHeader>
                <CardTitle className="text-purple-400">Confidence Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">
                  {(risk.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-slate-400 mt-2">
                  AI prediction accuracy
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card
              className="bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl hover:shadow-lg transition-shadow"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardHeader>
                <CardTitle className="text-red-400">Risk Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={mockTrendData}>
                    <Line
                      type="monotone"
                      dataKey="risk"
                      stroke="#f87171"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-cyan-400">Top Risk Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {risk.topReasons.map((reason: string, i: number) => (
                  <li key={i} className="text-slate-300 flex items-center">
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-purple-400">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {risk.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="text-slate-300 flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
