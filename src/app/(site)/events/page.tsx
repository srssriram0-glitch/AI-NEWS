import type { Metadata } from "next";
import { Calendar, MapPin, Globe, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockEvents } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "AI Events",
  description: "Upcoming AI conferences, summits, and workshops.",
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-6 w-6 text-violet-500" />
          <h1 className="text-3xl font-bold">AI Events</h1>
        </div>
        <p className="text-muted-foreground">
          Upcoming AI conferences, summits, workshops, and meetups worldwide.
        </p>
      </div>

      <div className="space-y-4">
        {mockEvents.map((event) => (
          <Card key={event.id} className="transition-all hover:shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-blue-500/10">
                  <span className="text-xs font-medium text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold">{new Date(event.date).getDate()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {event.isVirtual && <Badge variant="secondary" className="text-xs">Virtual</Badge>}
                    {event.tags.map((tag) => <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>)}
                  </div>
                  <h2 className="text-lg font-semibold">{event.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {event.isVirtual ? <Globe className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                      {event.location}
                    </span>
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                      {event.endDate && ` – ${new Date(event.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
                    </span>
                  </div>
                </div>
                <a href={event.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    Details <ExternalLink className="ml-1 h-3 w-3" />
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
