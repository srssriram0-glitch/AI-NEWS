"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Newspaper,
  Wrench,
  BookOpen,
  MessageSquare,
  Rss,
  Search,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Tools", href: "/admin/tools", icon: Wrench },
  { label: "Guides", href: "/admin/guides", icon: BookOpen },
  { label: "Prompts", href: "/admin/prompts", icon: MessageSquare },
  { label: "RSS Feeds", href: "/admin/feeds", icon: Rss },
  { label: "Search Test", href: "/admin/search-test", icon: Search },
];

function LoginGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_authed");
    if (stored === "true") setAuthed(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem("admin_authed", "true");
      sessionStorage.setItem("admin_key", password);
      setAuthed(true);
    } else {
      setError("Invalid admin password");
    }
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-8"
        >
          <div className="flex items-center gap-2 text-xl font-bold">
            <Shield className="h-6 w-6 text-blue-500" />
            Admin Login
          </div>
          <p className="text-sm text-muted-foreground">
            Enter the admin password to access the CMS dashboard.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authed");
    sessionStorage.removeItem("admin_key");
    router.push("/");
  };

  return (
    <LoginGate>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold">Admin CMS</span>
            <button
              className="ml-auto lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {ADMIN_NAV.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-500/10 text-blue-500"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
            <Link
              href="/"
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Back to Site
            </Link>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-xl">
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold">AI World Hub CMS</h1>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </LoginGate>
  );
}
