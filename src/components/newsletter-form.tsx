"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  if (submitted) {
    return (
      <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-5 w-5" />
        <span className="font-medium">
          You&apos;re subscribed! Check your inbox for confirmation.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex gap-2 sm:mx-auto sm:max-w-md">
      <Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-11"
      />
      <Button
        type="submit"
        size="lg"
        className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700"
      >
        <Send className="mr-2 h-4 w-4" />
        Subscribe
      </Button>
    </form>
  );
}
