import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-idoma.jpg";
import {
  MessageCircle,
  BookOpen,
  Languages,
  Sparkles,
  MapPin,
  Calendar,
  Store,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const FEATURES = [
  {
    to: "/assistant",
    icon: MessageCircle,
    title: "AI Cultural Assistant",
    desc: "Ask anything about Idoma history, customs, rulers, and traditions.",
    tint: "primary",
  },
  {
    to: "/tutor",
    icon: BookOpen,
    title: "Language Tutor",
    desc: "Learn Idoma phrases, greetings and vocabulary with interactive lessons.",
    tint: "terracotta",
  },
  {
    to: "/translate",
    icon: Languages,
    title: "AI Translator",
    desc: "Translate between English and Idoma in a single tap.",
    tint: "gold",
  },
  {
    to: "/stories",
    icon: Sparkles,
    title: "Storyteller",
    desc: "Folktales and legends of the Idoma people, retold by AI.",
    tint: "primary",
  },
  {
    to: "/places",
    icon: MapPin,
    title: "Historical Places",
    desc: "Explore sacred sites, hills, and cultural landmarks of Idomaland.",
    tint: "terracotta",
  },
  {
    to: "/festivals",
    icon: Calendar,
    title: "Festivals",
    desc: "Learn about Aje-Alekwu, Eje-Alago, and other Idoma celebrations.",
    tint: "gold",
  },
  {
    to: "/businesses",
    icon: Store,
    title: "Local Directory",
    desc: "Discover hotels, restaurants, and artisans across Idomaland.",
    tint: "primary",
  },
] as const;

const tintClass = (t: string) =>
  t === "gold"
    ? "bg-gold/15 text-gold-foreground ring-gold/30"
    : t === "terracotta"
    ? "bg-terracotta/15 text-terracotta ring-terracotta/30"
    : "bg-primary/10 text-primary ring-primary/20";

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImg}
            alt="Sunset over the savanna hills of Idomaland"
            width={1600}
            height={1000}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 sm:pt-24 pb-20 sm:pb-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-terracotta">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
              Idoma heritage · AI-powered
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight">
              The living archive of{" "}
              <span className="text-primary">Idoma culture</span>,{" "}
              language and heritage.
            </h1>
            <p className="mt-5 text-lg text-foreground/80 max-w-xl">
              Learn the Idoma language. Chat with an AI grounded in Idoma history.
              Explore sacred places, festivals, and the businesses that keep the
              culture alive today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                Chat with the assistant <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tutor"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-secondary transition"
              >
                Start learning Idoma
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION strip */}
      <section className="border-y bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-6 sm:grid-cols-3 text-sm">
          <div>
            <div className="font-display text-2xl text-primary">1M+</div>
            <div className="text-muted-foreground">Idoma speakers across Nigeria and the diaspora</div>
          </div>
          <div>
            <div className="font-display text-2xl text-terracotta">22+</div>
            <div className="text-muted-foreground">Clans, each with distinct traditions and customs</div>
          </div>
          <div>
            <div className="font-display text-2xl text-gold-foreground">1 goal</div>
            <div className="text-muted-foreground">Ensure the next generation inherits its heritage</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs font-medium tracking-widest uppercase text-terracotta">Explore</div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Everything Idoma, in one place.</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Seven working modules — powered by an AI trained to answer with cultural
            care and grounded curated knowledge.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group relative rounded-2xl border bg-card p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div
                className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ring-1 ${tintClass(f.tint)}`}
              >
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition">
                Open <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-10 sm:p-14 pattern-idoma">
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              Ije oyi — welcome home.
            </h2>
            <p className="mt-4 text-primary-foreground/85">
              Whether you speak Idoma fluently or are just beginning, IdomaConnect
              AI is your companion — a curated cultural archive that answers with
              respect for the people, the land, and the ancestors.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/translate"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-gold-foreground hover:bg-gold/90 transition"
              >
                Try the translator
              </Link>
              <Link
                to="/places"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-3 text-sm font-medium hover:bg-primary-foreground/10 transition"
              >
                Explore historical places
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
