import type { Metadata } from "next";
import { Briefcase, MapPin, DollarSign, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockJobs } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "AI Jobs",
  description: "Find the latest AI and machine learning job opportunities.",
};

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Briefcase className="h-6 w-6 text-teal-500" />
          <h1 className="text-3xl font-bold">AI Jobs</h1>
        </div>
        <p className="text-muted-foreground">
          Find your next role in AI — research, engineering, product, and more.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Research", "Engineering", "Product", "Remote"].map((filter) => (
          <Badge key={filter} variant={filter === "All" ? "default" : "outline"} className="cursor-pointer px-3 py-1">
            {filter}
          </Badge>
        ))}
      </div>

      <div className="space-y-4">
        {mockJobs.map((job) => (
          <Card key={job.id} className="transition-all hover:shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">{job.type}</Badge>
                    {job.remote && <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 dark:text-green-400">Remote</Badge>}
                  </div>
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    {job.salary && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(job.postedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}
                  </div>
                </div>
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                    Apply <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
