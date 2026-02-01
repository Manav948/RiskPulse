import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <SignedIn>
        {redirect("/dashboard")}
      </SignedIn>
      <SignedOut>
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold bg-black bg-clip-text text-transparent">
              Failure Radar
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl">
              Predict project failure risks with AI-powered insights from real-time behavioral signals.
              Stay ahead of potential issues with proactive alerts and recommendations.
            </p>
          </div>
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
