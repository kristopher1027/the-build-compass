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

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

const NAV = [
  { to: "/assistant", label: "Assistant" },
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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

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
      { title: "IdomaConnect AI — Preserving Idoma culture, language & heritage" },
      {
        name: "description",
        content:
          "An AI-powered platform to learn the Idoma language, explore culture and history, translate, and discover Idomaland's places, festivals, and local businesses.",
      },
      { property: "og:title", content: "IdomaConnect AI" },
      {
        property: "og:description",
        content:
          "Preserving and promoting Idoma culture with AI — language, translation, history, tourism, and local business.",
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
          <Link
            to="/assistant"
            className="hidden sm:inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Ask the AI
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
              Preserving Idoma language, culture, and heritage — for students,
              tourists, researchers, and the diaspora.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Learn</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/assistant" className="hover:text-foreground">Cultural Assistant</Link></li>
              <li><Link to="/tutor" className="hover:text-foreground">Language Tutor</Link></li>
              <li><Link to="/translate" className="hover:text-foreground">Translator</Link></li>
              <li><Link to="/stories" className="hover:text-foreground">Storyteller</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2">Discover</div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><Link to="/places" className="hover:text-foreground">Historical Places</Link></li>
              <li><Link to="/festivals" className="hover:text-foreground">Festivals</Link></li>
              <li><Link to="/businesses" className="hover:text-foreground">Local Businesses</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
            <span>© {new Date().getFullYear()} IdomaConnect AI. Built with cultural care.</span>
            <span>Ije oyi — welcome home.</span>
          </div>
        </div>
      </footer>
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
