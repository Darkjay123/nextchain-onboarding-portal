import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogoFull, LogoMark } from "@/components/nc/Logo";
import { Btn } from "@/components/nc/Btn";
import { Chip } from "@/components/nc/Chip";
import { ScrollReveal } from "@/components/nc/ScrollReveal";
import { ParticleField } from "@/components/nc/ParticleField";

const PILLARS = [
  { icon: "📚", title: "Onboard & Learn", desc: "Guided Web3 learning modules, wallet setup, and foundational knowledge — built for Africa." },
  { icon: "⚒️", title: "Build", desc: "Complete onchain actions, submit proof, and demonstrate real competence on Base." },
  { icon: "🏅", title: "Earn", desc: "Unlock soulbound credentials — non-transferable proof of participation and skill." },
  { icon: "🌍", title: "Network", desc: "Connect with builders across campuses. Your reputation travels with you onchain." },
];

const TIMELINE = [
  { label: "DELSU Pilot", status: "active", detail: "First campus onboarding event — live now" },
  { label: "Nigeria Expansion", status: "next", detail: "Scaling to campuses across Nigeria" },
  { label: "Africa Network", status: "future", detail: "Building Africa's onchain identity layer" },
];

const MOVEMENT_LINES = [
  "We are not just users.",
  "We are builders.",
  "We are contributors.",
  "",
  "We are the generation",
  "that defines identity onchain.",
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <ParticleField />
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent 70%)", filter: "blur(80px)" }} />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)", filter: "blur(60px)" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6 flex justify-center">
            <LogoMark size={56} />
          </motion.div>

          <h1 className="mb-6 text-[clamp(32px,6vw,72px)] font-extrabold leading-[1.05] tracking-tight">
            {"Building Africa's".split(" ").map((word, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="mr-[0.3em] inline-block">
                {word}
              </motion.span>
            ))}
            <br />
            {"Onchain Identity Layer.".split(" ").map((word, i) => (
              <motion.span
                key={`b-${i}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`mr-[0.3em] inline-block ${word.includes("Onchain") || word.includes("Identity") ? "text-primary" : ""}`}
                style={word.includes("Onchain") || word.includes("Identity") ? { textShadow: "0 0 40px rgba(34,197,94,0.3)" } : {}}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Not just onboarding users.<br />
            We turn participation into reputation.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }} className="flex flex-wrap justify-center gap-3">
            <Btn onClick={() => navigate("/app")} className="px-8 py-3 text-sm">⬡ Enter Portal</Btn>
            <Btn variant="outline" onClick={() => window.open("https://chat.whatsapp.com/GH3TV1TmQdt7UtCR1fQeTs", "_blank")} className="px-8 py-3 text-sm">Join NextChain</Btn>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40">Scroll</span>
            <div className="h-6 w-[1px] bg-gradient-to-b from-primary/40 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ PROBLEM ═══ */}
      <section className="relative py-28 px-6">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="mb-4 text-[clamp(22px,3.5vw,36px)] font-bold leading-snug text-foreground">
              Web3 in Africa is growing fast…
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mb-10 text-[clamp(22px,3.5vw,36px)] font-bold leading-snug text-muted-foreground">
              …but growth without structure creates noise.
            </p>
          </ScrollReveal>
          <div className="flex flex-col gap-3">
            {[
              "No portable proof of participation",
              "No way to verify who actually showed up",
              "No onchain identity for campus builders",
              "Communities grow, but contributors stay invisible",
            ].map((line, i) => (
              <ScrollReveal key={i} delay={0.3 + i * 0.1}>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <span className="text-destructive">✕</span>
                  <span className="text-sm text-muted-foreground">{line}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOLUTION ═══ */}
      <section className="relative py-28 px-6">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(34,197,94,0.06), transparent 70%)" }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <ScrollReveal>
            <Chip variant="green">The Solution</Chip>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <h2 className="mt-6 text-[clamp(26px,4vw,44px)] font-extrabold leading-tight">
              NextChain turns <span className="text-primary" style={{ textShadow: "0 0 30px rgba(34,197,94,0.2)" }}>real participation</span> into <span className="text-primary" style={{ textShadow: "0 0 30px rgba(34,197,94,0.2)" }}>onchain identity</span>.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              A quest-based onboarding system that rewards action with soulbound credentials on Base.
              Your reputation is permanent, portable, and verifiable.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <Chip variant="dim">How It Works</Chip>
              <h2 className="mt-4 text-3xl font-extrabold">Five steps to your onchain identity</h2>
            </div>
          </ScrollReveal>
          <div className="relative flex flex-col gap-0">
            {[
              { n: "01", title: "Connect Wallet", desc: "Set up your Web3 wallet and join the portal" },
              { n: "02", title: "Complete Quests", desc: "Follow socials, attend events, learn Web3 basics, act onchain" },
              { n: "03", title: "Get Verified", desc: "Admin reviews your submissions and verifies completion" },
              { n: "04", title: "Unlock Credentials", desc: "Meet all requirements to become eligible for soulbound badges" },
              { n: "05", title: "Build Reputation", desc: "Your credentials live onchain — portable, permanent proof" },
            ].map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 0.1}>
                <div className="group flex gap-6 py-6">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border-bright text-sm font-black text-primary"
                      style={{ background: "linear-gradient(135deg, hsl(150 25% 8%), hsl(150 35% 14%))" }}
                      whileHover={{ scale: 1.1, boxShadow: "0 0 24px var(--green-glow-strong)" }}
                    >
                      {s.n}
                    </motion.div>
                    {i < 4 && <div className="mt-2 h-full w-[1px] bg-border" />}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-200">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PILLARS ═══ */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <Chip variant="green">Community Pillars</Chip>
              <h2 className="mt-4 text-3xl font-extrabold">A system for the next generation</h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.1}>
                <motion.div
                  className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-bright"
                  whileHover={{ y: -4, boxShadow: "0 0 24px var(--green-glow)" }}
                >
                  <motion.span className="text-3xl" whileHover={{ scale: 1.15 }} transition={{ type: "spring", stiffness: 300 }}>
                    {p.icon}
                  </motion.span>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE ═══ */}
      <section className="py-28 px-6">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <div className="mb-12 text-center">
              <Chip variant="dim">Roadmap</Chip>
              <h2 className="mt-4 text-3xl font-extrabold">Starting from DELSU → Nigeria → Africa</h2>
            </div>
          </ScrollReveal>
          <div className="relative flex flex-col gap-6">
            <div className="absolute left-5 top-0 h-full w-[2px] bg-border" />
            {TIMELINE.map((t, i) => (
              <ScrollReveal key={t.label} delay={i * 0.15}>
                <div className="relative flex items-start gap-6 pl-2">
                  <div
                    className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border"
                    style={{
                      background: t.status === "active" ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                      borderColor: t.status === "active" ? "hsl(var(--primary))" : "hsl(var(--border))",
                      boxShadow: t.status === "active" ? "0 0 20px var(--green-glow-strong)" : "none",
                    }}
                  >
                    {t.status === "active" ? (
                      <span className="text-xs font-black text-primary-foreground">●</span>
                    ) : (
                      <span className="text-xs text-muted-foreground">○</span>
                    )}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-base font-bold text-foreground">{t.label}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.detail}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOVEMENT ═══ */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-3xl text-center">
          {MOVEMENT_LINES.map((line, i) => (
            <ScrollReveal key={i} delay={i * 0.15}>
              {line === "" ? (
                <div className="h-8" />
              ) : (
                <p
                  className="mb-3 text-[clamp(20px,4vw,38px)] font-extrabold leading-snug"
                  style={{
                    color: line.includes("defines") ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                    textShadow: line.includes("defines") ? "0 0 40px rgba(34,197,94,0.25)" : "none",
                  }}
                >
                  {line}
                </p>
              )}
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative overflow-hidden py-32 px-6">
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.1), transparent 70%)" }} />
        <div className="relative mx-auto max-w-2xl text-center">
          <ScrollReveal>
            <h2 className="mb-3 text-[clamp(28px,5vw,48px)] font-extrabold leading-tight">
              Start your journey.<br />
              <span className="text-primary">Build your identity.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="mb-10 text-base text-muted-foreground">
              Your onchain reputation starts here.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.35}>
            <div className="flex flex-wrap justify-center gap-3">
              <Btn onClick={() => navigate("/app")} className="px-8 py-3 text-sm">⬡ Enter Portal</Btn>
              <Btn variant="outline" onClick={() => window.open("https://chat.whatsapp.com/GH3TV1TmQdt7UtCR1fQeTs", "_blank")} className="px-8 py-3 text-sm">Join Community</Btn>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <LogoFull size={20} />
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground/40">
            Building the next generation of Web3 leaders · Base Network
          </div>
          <Chip variant="dim">Nigeria → Africa</Chip>
        </div>
      </footer>
    </div>
  );
}
