"use client";

import { useRouter } from "next/navigation";
import {
  Newspaper,
  Wrench,
  BookOpen,
  MessageSquareText,
  GitCompare,
  FileText,
  Briefcase,
  Calendar,
  Building2,
  TrendingUp,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickLinks = [
  { label: "AI News", href: "/news", icon: Newspaper },
  { label: "AI Tools", href: "/tools", icon: Wrench },
  { label: "How-to Guides", href: "/guides", icon: BookOpen },
  { label: "Prompt Library", href: "/prompts", icon: MessageSquareText },
  { label: "Compare Models", href: "/compare", icon: GitCompare },
  { label: "Research Papers", href: "/papers", icon: FileText },
  { label: "AI Jobs", href: "/jobs", icon: Briefcase },
  { label: "AI Events", href: "/events", icon: Calendar },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Trending", href: "/trending", icon: TrendingUp },
];

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const router = useRouter();

  const navigate = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search AI tools, news, guides, prompts..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Links">
          {quickLinks.map((link) => (
            <CommandItem
              key={link.href}
              onSelect={() => navigate(link.href)}
              className="cursor-pointer"
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Popular Searches">
          <CommandItem
            onSelect={() => navigate("/tools/chatgpt")}
            className="cursor-pointer"
          >
            ChatGPT
          </CommandItem>
          <CommandItem
            onSelect={() => navigate("/tools/claude")}
            className="cursor-pointer"
          >
            Claude
          </CommandItem>
          <CommandItem
            onSelect={() => navigate("/tools/midjourney")}
            className="cursor-pointer"
          >
            Midjourney
          </CommandItem>
          <CommandItem
            onSelect={() => navigate("/tools/cursor")}
            className="cursor-pointer"
          >
            Cursor
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
