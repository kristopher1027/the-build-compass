import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useState } from "react";
import { LogIn, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const NAV = [
  { to: "/assistant", label: "Assistant" },
  { to: "/knowledge", label: "Knowledge" },
  { to: "/tutor", label: "Language" },
  { to: "/translate", label: "Translate" },
  { to: "/stories", label: "Stories" },
  { to: "/places", label: "Places" },
  { to: "/festivals", label: "Festivals" },
  { to: "/businesses", label: "Businesses" },
] as const;

function NotFoundComponent() {
  return (
    <SiteChrome>
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-7xl font-display text-primary">404</h1>
          <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            That page doesn't exist. Explore Idoma culture from the home page.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </SiteChrome>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const safeError = error instanceof Error ? error : new Error("Unknown application error");
  const router = useRouter();
  useEffect(() => {
    reportLovableError(safeError, { boundary: "tanstack_root_error_component" });
  }, [safeError]);

  return (
    <SiteChrome>
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">This page didn't load</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong. Try again or head back home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
            <a
              href="/"
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IdomaConnect AI — Ai wa, in our own voice" },
      {
        name: "description",
        content:
          "Built by sons and daughters of Ai wa. Learn Idoma, hear our stories, walk our land, and ask an AI that speaks the way we speak at home — not the way strangers summarise us.",
      },
      { property: "og:title", content: "IdomaConnect AI — Ai wa" },
      {
        property: "og:description",
        content:
          "Idoma culture, language, and heritage — told from inside the culture, cited from our own words.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteChrome({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => { if (active) setSignedIn(Boolean(data.user)); });
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") setSignedIn(true);
      if (event === "SIGNED_OUT") setSignedIn(false);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") void router.invalidate();
    });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [router]);
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-display text-sm">
              I
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              IdomaConnect<span className="text-terracotta"> AI</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-1.5 rounded-md text-sm text-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                activeProps={{ className: "text-primary bg-secondary font-medium" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link to={signedIn ? "/admin" : "/auth"} className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            {signedIn ? <Settings className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}{signedIn ? "Manage library" : "Admin sign in"}
          </Link>
        </div>
        {/* Mobile nav */}
        <nav className="md:hidden border-t bg-background overflow-x-auto">
          <div className="flex gap-1 px-3 py-2 whitespace-nowrap">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-1.5 rounded-md text-xs text-foreground/80 hover:bg-secondary"
                activeProps={{ className: "text-primary bg-secondary font-medium" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-secondary/40 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
          <div>
            <div className="font-display text-lg font-semibold">IdomaConnect AI</div>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Ai wa — our home, our tongue, our people. Built from inside the
              culture, for anyone who wants to know us the way we know ourselves.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Learn</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/assistant" className="hover:text-foreground">Sit with an elder</Link></li>
              <li><Link to="/tutor" className="hover:text-foreground">Speak Idoma</Link></li>
              <li><Link to="/translate" className="hover:text-foreground">English ↔ Idoma</Link></li>
              <li><Link to="/stories" className="hover:text-foreground">Folktales</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Ai wa</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/places" className="hover:text-foreground">Where we come from</Link></li>
              <li><Link to="/festivals" className="hover:text-foreground">The year in Ai wa</Link></li>
              <li><Link to="/businesses" className="hover:text-foreground">Hands holding it up</Link></li>
              <li><Link to="/knowledge" className="hover:text-foreground">What we ourselves say</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} IdomaConnect AI · Ai wa, in our own voice.</span>
            <span>Ije oyi — you have arrived well.</span>
          </div>
        </div>
      </footer>
      <Toaster richColors position="top-right" />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SiteChrome>
        <Outlet />
      </SiteChrome>
    </QueryClientProvider>
  );
}
