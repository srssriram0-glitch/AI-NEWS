"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Menu,
  X,
  Zap,
  Bookmark,
  Bell,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { NAV_ITEMS } from "@/lib/constants";
import { SearchCommand } from "@/components/search-command";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight">
                AI World Hub
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Discover Everything AI
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="group relative">
              <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                More
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="pointer-events-none absolute right-0 top-full z-50 mt-1 w-48 rounded-lg border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:pointer-events-auto group-hover:opacity-100">
                <Link
                  href="/tutorials"
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Tutorials
                </Link>
                <Link
                  href="/categories"
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Categories
                </Link>
                <Link
                  href="/companies"
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Companies
                </Link>
                <Link
                  href="/digest"
                  className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Daily Digest
                </Link>
              </div>
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Link href="/bookmarks" className="hidden sm:flex">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Bookmark className="h-4 w-4" />
                <span className="sr-only">Bookmarks</span>
              </Button>
            </Link>
            <ThemeToggle />
            <div className="hidden sm:block">
              <Link href="/newsletter">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700"
                >
                  Subscribe
                </Button>
              </Link>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border/40 bg-background lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/tutorials"
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tutorials
              </Link>
              <Link
                href="/categories"
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/companies"
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Companies
              </Link>
              <div className="mt-2 border-t border-border/40 pt-3">
                <Link href="/newsletter" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                    Subscribe to Newsletter
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
