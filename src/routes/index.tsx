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
    title: "Sit with an elder",
    desc: "An AI that answers the way our fathers would — grounded in our own words, citing them back to you.",
    tint: "primary",
  },
  {
    to: "/tutor",
    icon: BookOpen,
    title: "Learn to speak Idoma",
    desc: "Ije oyi, abo, nom̀ — one phrase at a time, the way our mothers taught us.",
    tint: "terracotta",
  },
  {
    to: "/translate",
    icon: Languages,
    title: "English ↔ Idoma",
    desc: "For when you know what you want to say but the tongue has forgotten.",
    tint: "gold",
  },
  {
    to: "/stories",
    icon: Sparkles,
    title: "Folktales by the fire",
    desc: "Stories in the shape of the ones our grandfathers told after the yam was eaten.",
    tint: "primary",
  },
  {
    to: "/places",
    icon: MapPin,
    title: "Where we come from",
    desc: "Otukpo, Ojira, Ogbadibo — the ground that carries our names.",
    tint: "terracotta",
  },
  {
    to: "/festivals",
    icon: Calendar,
    title: "The year in Ai wa",
    desc: "Aje-Alekwu, Eje-Alago, Ito Ogwu — the days we come together.",
    tint: "gold",
  },
  {
    to: "/businesses",
    icon: Store,
    title: "Hands holding it up",
    desc: "The tailors, cooks, and traders keeping Ai wa alive today.",
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
            alt="Sunset over the savanna hills of Ai wa — our home"
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
              Ai wa · from Apa to today
            </div>
            <h1 className="mt-5 font-display text-4xl sm:text-6xl font-semibold leading-[1.05] tracking-tight">
              Ije oyi.{" "}
              <span className="text-primary">Ai wa</span> — our home, our
              tongue, our people.
            </h1>
            <p className="mt-5 text-lg text-foreground/80 max-w-xl">
              Built by sons and daughters of Ai wa, for anyone who wants to
              learn Idoma the way it is actually spoken, hear our stories the
              way they are actually told, and walk our land the way we walk
              it. No outsider summaries. Just us.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
              >
                Sit with an elder <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tutor"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-secondary transition"
              >
                Start speaking Idoma
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION strip */}
      <section className="border-y bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid gap-6 sm:grid-cols-3 text-sm">
          <div>
            <div className="font-display text-2xl text-primary">wa lù Apa</div>
            <div className="text-muted-foreground">"We come from Apa" — the sentence every Idoma child hears growing up</div>
          </div>
          <div>
            <div className="font-display text-2xl text-terracotta">9 LGAs</div>
            <div className="text-muted-foreground">Otukpo, Ohimini, Okpokwu, Ogbadibo, Ado, Apa, Agatu, Obi, Oju</div>
          </div>
          <div>
            <div className="font-display text-2xl text-gold-foreground">Ai wa</div>
            <div className="text-muted-foreground">"Our home" — the word we use for the whole of Idomaland</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-xs font-medium tracking-widest uppercase text-terracotta">Wa gwu — come in</div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">Everything of Ai wa, in one place.</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Seven doors — every one of them opening onto something an elder of
            ours would recognise. The AI here reads from a corpus written from
            inside the culture, not scraped from outside it.
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
              Ije oyi — you have arrived well.
            </h2>
            <p className="mt-4 text-primary-foreground/85">
              Whether Idoma is the first tongue you cried in, or a language
              you are meeting for the first time — wa gwu, come in. This is
              our house. Sit. Eat. Ask.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/translate"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-gold-foreground hover:bg-gold/90 transition"
              >
                Say it in Idoma
              </Link>
              <Link
                to="/places"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-3 text-sm font-medium hover:bg-primary-foreground/10 transition"
              >
                Walk our land
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
