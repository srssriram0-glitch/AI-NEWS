import type { Metadata } from "next";
import { Mail, CheckCircle2 } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to the AI World Hub daily digest.",
};

export default function NewsletterPage() {
  const benefits = [
    "Daily curated AI news and model releases",
    "New tool launches and updates",
    "Top research papers summarized",
    "Exclusive prompt templates",
    "AI job opportunities",
    "No spam — unsubscribe anytime",
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">
          <Mail className="h-7 w-7 text-white" />
        </div>
      </div>
      <h1 className="text-3xl font-bold sm:text-4xl">
        The AI Daily Digest
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">
        Everything happening in AI, delivered to your inbox every morning.
        Trusted by 50,000+ professionals.
      </p>

      <NewsletterForm />

      <div className="mt-10 mx-auto max-w-sm text-left space-y-3">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" />
            {benefit}
          </div>
        ))}
      </div>
    </div>
  );
}
