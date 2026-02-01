"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GitHubConnectDialogProps {
  children: React.ReactNode;
}

export function GitHubConnectDialog({ children }: GitHubConnectDialogProps) {
  const [open, setOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");

  const handleConnect = () => {
    // TODO: Set up webhook
    console.log("Connecting to GitHub repo:", repoUrl);
    setOpen(false);
    setRepoUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Connect GitHub Repository</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-slate-300">
            Grant access to track commit activity and detect potential project risks in real-time.
          </p>
          <div>
            <Label htmlFor="repo">Repository URL</Label>
            <Input
              id="repo"
              placeholder="https://github.com/username/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-white/10 border-white/20"
            />
          </div>
          <div className="text-sm text-slate-400">
            <p>• Read access to commits and issues</p>
            <p>• Webhook setup for real-time monitoring</p>
            <p>• No write access to your code</p>
          </div>
          <Button
            onClick={handleConnect}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            Connect Repository
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}