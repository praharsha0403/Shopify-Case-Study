import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  RiCalendarCloseLine,
  RiCheckLine,
  RiCloseLine,
  RiCompassDiscoverLine,
  RiFileSearchLine,
  RiQuestionLine,
  RiRouteLine,
  RiShieldCheckLine,
  RiStackLine,
  RiTimerLine,
  RiUserVoiceLine,
} from "@remixicon/react";
import { RiArrowRightLine, RiGlobalLine, RiLinkedinFill } from "@remixicon/react";
import { Chip } from "@/components/base/badges/chip";
import { HeroScene } from "@/scenes/shopify";
import { Bands, Rv, ScrollText, SecHead, Tag } from "@/ui/fp";
import { cx } from "@/utils/cx";
import { track as trackEvent } from "@/analytics/tracker";

export const SECTIONS = [
  ["today", "What's true"],
  ["finding", "The finding"],
  ["workaround", "What broke it"],
  ["who", "Evidence"],
  ["why", "Why"],
  ["build", "Outcomes"],
  ["prove", "Next"],
  ["appendix", "Appendix"],
] as const;

export function Nav() {
  const [on, setOn] = useState("");
  const [p, setP] = useState(0);
  const [sc, setSc] = useState(false);
  useEffect(() => {
    const f = () => {
      const h = document.documentElement;
      setP(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
      setSc(h.scrollTop > 8);
      let cur = "";
      for (const [id] of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) cur = id;
      }
      setOn(cur);
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className="nav" data-scrolled={sc || undefined}>
      <div className="wrap nav-in">
        <a className="brand" href="#top">
          {/* Shopify bag (Simple Icons, CC0), recoloured to the site's blue + ink */}
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="#0073ff"
              d="M11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z"
            />
            <path fill="#0d0d0d" d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023z" />
          </svg>
          Shopify Case Study
        </a>
        <nav className="nav-links" aria-label="Sections">
          {SECTIONS.map(([id, l]) => (
            <a key={id} href={`#${id}`} data-on={on === id || undefined}>
              {l}
            </a>
          ))}
        </nav>
        <a className="btn btn-dark btn-sm" href="#sources">
          Sources
        </a>
      </div>
      <span className="nav-prog" style={{ width: "100%", transform: `scaleX(${p})` }} />
    </header>
  );
}


export function Hero() {
  return (
    <section className="hero" id="top">
      <Bands className="bands--hero" />
      <div className="wrap hero-c">
        <Rv>
          <Tag n="B2B">Product case study · Shopify catalogs · Nov 2026</Tag>
          <h1 className="d1">
            Shopify built two ways to <br className="hero-br" />
            price a B2B customer.
          </h1>
          <p className="sub">
            I wanted to understand why before proposing a third. A B2B market can target a specific company location and be scheduled through Rollouts. A directly assigned catalog takes precedence over a matching market catalog for overlapping products, but cannot itself be scheduled.
          </p>
          <div className="hero-cta">
            <a className="btn btn-dark" href="#short">
              Read the case study
            </a>
            <a className="btn btn-ghost" href="#workaround">
              The finding that broke my thesis
            </a>
          </div>
        </Rv>
        <Rv className="hero-shot" delay={150}>
          <HeroScene />
        </Rv>
        <p className="hero-note">
          <b>Illustrative recreation</b> of the Shopify admin, not a screenshot of a live account. LEGO appears as a hypothetical merchant (it isn't a Shopify customer); Brickyard Toys and its contract prices are fictional.
        </p>
      </div>
    </section>
  );
}

export function Proof() {
  const items: [ReactNode, string][] = [
    [<RiShieldCheckLine size={15} key="a" />, "Confirmed on 3 Shopify Help Center pages"],
    [<RiFileSearchLine size={15} key="b" />, "Admin GraphQL schema 2026-10 read"],
    [<RiUserVoiceLine size={15} key="c" />, "6 public signals · merchant interviews not yet done"],
    [<RiCalendarCloseLine size={15} key="d" />, "Catalog Rollouts shipped 23 Oct 2026"],
  ];
  return (
    <div className="wrap" style={{ marginTop: 28 }}>
      <Rv className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3" style={{ fontSize: 13, color: "var(--mute)" }}>
        {items.map(([i, t]) => (
          <span key={t} className="inline-flex items-center gap-2">
            {i}
            {t}
          </span>
        ))}
      </Rv>
    </div>
  );
}

/** Click it, or drag the knob to the end. Either opens the link in a new tab. */
function SwipeCta({ href, label }: { href: string; label: string }) {
  const track = useRef<HTMLAnchorElement>(null);
  const drag = useRef<{ x0: number; max: number; moved: boolean } | null>(null);
  const [x, setX] = useState(0);
  const [state, setState] = useState<"idle" | "drag" | "done">("idle");

  const open = () => {
    const w = window.open(href, "_blank");
    if (w) w.opener = null;
    return !!w;
  };
  const pending = useRef(false);

  const onDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    const t = track.current;
    if (!t) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const knob = e.currentTarget.getBoundingClientRect().width;
    drag.current = { x0: e.clientX, max: t.getBoundingClientRect().width - knob - 14, moved: false };
    setState("drag");
  };
  // every open goes through code; the native click that follows a press is swallowed
  const suppress = useRef(false);
  const blockClick = () => {
    suppress.current = true;
    window.setTimeout(() => (suppress.current = false), 600);
  };
  const onClick = (e: React.MouseEvent) => {
    if (suppress.current) e.preventDefault();
  };
  // the moment the knob crosses the line: snap to the end and open; if the browser
  // blocks a tab mid-drag, open the instant the pointer is released instead
  const finish = (max: number) => {
    setX(max);
    setState("done");
    trackEvent("contact", { c: "call", via: "swipe", at: "thesis" });
    pending.current = !open();
    blockClick();
    window.setTimeout(() => {
      setState("idle");
      setX(0);
    }, 380);
  };
  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = Math.max(0, Math.min(d.max, e.clientX - d.x0));
    if (dx > 4) d.moved = true;
    if (d.moved && dx >= d.max * 0.72) {
      drag.current = null;
      finish(d.max);
      return;
    }
    setX(dx);
  };
  const onUp = () => {
    if (pending.current) {
      pending.current = false;
      // still blocked after release: go there in this tab rather than do nothing
      if (!open()) window.location.href = href;
      return;
    }
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    setState("idle");
    setX(0);
    // a plain tap on the knob opens the link too
    if (!d.moved) {
      open();
      blockClick();
      return;
    }
    // a drag shouldn't also count as a click
    if (d.moved) blockClick();
  };

  const max = drag.current?.max ?? 1;
  return (
    <a ref={track} className="pc2-cta" data-state={state} draggable={false} onDragStart={(e) => e.preventDefault()} onClick={onClick} href={href} target="_blank" rel="noreferrer" aria-label={`${label} Opens a booking page in a new tab.`} style={{ ["--x" as string]: `${x}px`, ["--p" as string]: String(Math.min(1, x / max)) }}>
      <span className="pc2-cta__fill" aria-hidden />
      <span className="pc2-cta__ic" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {state === "done" ? <RiCheckLine size={18} /> : <RiArrowRightLine size={18} />}
      </span>
      <span className="pc2-cta__t">{state === "done" ? "Opening…" : label}</span>
    </a>
  );
}

export function Manifesto() {
  return (
    <section className="sec" id="thesis" data-sec="thesis" style={{ paddingTop: 120 }}>
      <div className="wrap thesis-wrap">
        <div className="thesis-side">
          <Tag>The thesis</Tag>
          {/* profile card */}
          <div className="pc2">
            <div className="pc2-cover">
              <div className="pc2-icons">
                <a href="https://www.linkedin.com/in/praharsha-nelaturi/" target="_blank" rel="noreferrer" aria-label="Praharsha Nelaturi on LinkedIn">
                  <RiLinkedinFill size={16} />
                </a>
                <a href="https://praharsha.framer.website/" target="_blank" rel="noreferrer" aria-label="Praharsha Nelaturi's portfolio">
                  <RiGlobalLine size={16} />
                </a>
              </div>
            </div>
            <img className="pc2-dp" src="/ref/praharsha.webp" alt="Praharsha Nelaturi" width={76} height={76} />
            <div className="pc2-row">
              <div className="min-w-0">
                <div className="pc2-name">Praharsha Nelaturi</div>
                <div className="pc2-sub">M.S. Software Engineering, UC Irvine</div>
              </div>
            </div>
            <p className="pc2-bio">A Product Manager with 3+ years of experience across 0 to 1 product building, data-driven growth, and GTM strategy.</p>
            <SwipeCta href="https://cal.com/praharsha.n/quick-call" label="Quick Connect?" />
          </div>
        </div>
        <div className="min-w-0">
          <ScrollText
            accent={["B2B market", "Rollouts", "takes precedence", "can't itself be scheduled", "Here's how I'd find out."]}
            text="Shopify gives Plus merchants two ways to assign a B2B catalog to a company location. A B2B market can target specific locations and be scheduled through Rollouts. A directly assigned catalog takes precedence over a matching market catalog for overlapping products, but can't itself be scheduled. Both deliver location-specific pricing. I don't yet know when the override is worth its limitation. Here's how I'd find out."
          />
          <Rv className="prose" style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
            <p>
              The difference between the two is how each expresses the customer relationship, how pricing precedence resolves, and whether catalog changes can be scheduled. I want to understand when the higher-priority direct assignment is valuable enough to justify its operational limitation, and whether a single-location market is a practical alternative at scale.
            </p>
            <p>
              I started out trying to prove that Shopify's premium B2B pricing mechanism had a scheduling gap. It does, but a workaround exists, and finding it late nearly killed this document. What survived is narrower and more useful. Whether the split is deliberate design or an artifact of how the product grew, I can't tell from outside. This is the investigation that would settle it, including the parts where I was wrong.
            </p>
          </Rv>
        </div>
      </div>
    </section>
  );
}

const SUMMARY: [string, ReactNode, "done" | "todo" | "rec" | null][] = [
  ["Product area", "B2B commerce and catalog management", null],
  ["Problem type", "Configuration and precedence asymmetry", null],
  ["Work completed", "Public documentation research, API-schema analysis, product-rule mapping, public-signal analysis, hypotheses and decision plan", "done"],
  ["Not completed", "Merchant interviews, internal usage analysis, engineering feasibility validation, implementation", "todo"],
  ["Recommendation", "Do not build yet", "rec"],
];

export const READING_PATH: [string, string, string][] = [
  ["wrong", "The problem", "and my first assumption"],
  ["workaround", "What changed", "the finding that broke the thesis"],
  ["precedence", "Two models", "and how precedence resolves"],
  ["who", "The evidence", "what it supports, and what it doesn't"],
  ["build", "Four outcomes", "and why not to build yet"],
  ["prove", "Five investigations", "and their decision gates"],
  ["ship", "If it's a build", "the concept, risks and measures"],
];

export function Overview() {
  return (
    <section className="sec ov" id="overview">
      <div className="wrap">
        <div className="grid g2 eq-row">
          <Rv className="card pad card-dark ov-lens">
            <span className="kicker kd-label">PM lens</span>
            <p className="ov-lens__p">
              This is a platform-product discovery exercise. I tested an apparent feature gap against documented product behavior, traced targeting, precedence and activation across two configuration models, separated public signals from customer proof, and built a decision-gated validation plan before recommending engineering investment.
            </p>
            <p className="ov-lens__p2">The method applies beyond commerce: it is relevant to any product where multiple configuration paths serve a similar customer outcome but behave differently.</p>
          </Rv>
          <Rv delay={80} className="card ov-sum">
            <div className="ov-sum__h">
              <span className="d3">Project summary</span>
            </div>
            <dl>
              {SUMMARY.map(([k, v, s]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    {s === "done" ? <span className="chip g">Completed</span> : s === "todo" ? <span className="chip a">Proposed next steps</span> : null}
                    <span className={s === "rec" ? "ov-rec" : undefined}>{v}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Rv>
        </div>
        <Rv className="rp" style={{ marginTop: 12 }}>
          <div className="rp-h">
            <span className="d3">The main reading path</span>
            <a className="rp-apx" href="#appendix">
              Q&amp;A and discovery log <span>· Appendix</span>
              <RiArrowRightLine size={15} />
            </a>
          </div>
          <ol className="rp-l">
            {READING_PATH.map(([id, t, d], i) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span className="rp-n">{String(i + 1).padStart(2, "0")}</span>
                  <b>{t}</b>
                  <span className="rp-d">{d}</span>
                </a>
              </li>
            ))}
          </ol>
        </Rv>
      </div>
    </section>
  );
}

const SHORT: { ic: ReactNode; k: string; v: ReactNode }[] = [
  {
    ic: <RiQuestionLine size={18} />,
    k: "The question",
    v: (
      <>
        <b>Why does Shopify offer two ways to assign a B2B catalog to a company location, and when is each one right?</b>
      </>
    ),
  },
  {
    ic: <RiCompassDiscoverLine size={18} />,
    k: "What's true",
    v: (
      <>
        A B2B market can target one named company location <em>and</em> be scheduled through Rollouts. A direct assignment outranks it for overlapping products but <b>can't be scheduled at all.</b> Both deliver location-specific pricing.
      </>
    ),
  },
  {
    ic: <RiRouteLine size={18} />,
    k: "So what",
    v: (
      <>
        The higher-precedence mechanism is the one with no scheduling. Shopify documents the distinction and explains when each assignment route is appropriate. However, the plan comparison does not surface the Rollouts limitation alongside the Plus-only direct-assignment capability. Whether merchants connect these details before choosing a route, particularly in the actual setup flow, remains unvalidated.
      </>
    ),
  },
  {
    ic: <RiStackLine size={18} />,
    k: "Test regardless",
    v: <>Test whether merchants connect the details before choosing. If they don't, putting the Rollouts limitation next to the Plus-only capability is a content change, with no engineering.</>,
  },
];

export function ShortVersion() {
  return (
    <section className="sec" id="short">
      <div className="wrap">
        <SecHead
          tag="The short version"
          title={
            <>
              My answer: <span style={{ color: "var(--blue)" }}>don't build yet.</span>
            </>
          }
          sub="Four outcomes are live and do nothing is one of them. Five proposed investigations could settle it in about three weeks, given access to Shopify's teams, a test store, usage data and merchants. One of them could stop the work in a day. Everything below is the working."
          link={{ href: "#prove", label: "Jump to the plan" }}
        />
        <div className="grid g4">
          {[
            ["4", "Outcomes still live", "Including doing nothing"],
            ["5", "Investigations", "Proposed, in dependency order"],
            ["3 Weeks", "To a decision", "An estimate that depends on access"],
            ["1", "Could stop it in a day", "Shopify's original rationale"],
          ].map(([v, l, s], i) => (
            <Rv key={l} delay={i * 60} className="card pad">
              <div className="big">{v}</div>
              <div style={{ fontWeight: 600, marginTop: 14, letterSpacing: "-0.015em" }}>{l}</div>
              <div style={{ fontSize: 14, color: "var(--mute)", marginTop: 2 }}>{s}</div>
            </Rv>
          ))}
        </div>
        <div className="grid g2" style={{ marginTop: 12 }}>
          {SHORT.map((x, i) => (
            <Rv key={x.k} delay={i * 60} className="card pad">
              <div className="flex items-center gap-3">
                <span className="ico">{x.ic}</span>
                <span className="d3">{x.k}</span>
              </div>
              <p style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.65, color: "var(--ink-2)" }}>{x.v}</p>
            </Rv>
          ))}
        </div>
        <Rv className="card" style={{ marginTop: 12, padding: "18px 22px", display: "flex", gap: 16, alignItems: "flex-start", background: "var(--amber-soft)", borderColor: "#fde2bd" }}>
          <span className="ico" style={{ background: "#fde7c4", border: 0, color: "#9a5300", borderRadius: 12, flex: "none" }}>
            <RiUserVoiceLine size={18} />
          </span>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "#5a3b00" }}>
            <b style={{ color: "#3d2800" }}>The gap I'd flag before you find it: I have not spoken to a single Shopify merchant.</b> Everything here is documentation, schema and public posts. That is the weakest part of this document, I know exactly which ten people I'd call, and I'd rather state it plainly here than have you discover it later.
          </p>
        </Rv>
      </div>
    </section>
  );
}

export function StartedLanded() {
  const before: [string, string][] = [
    ["Plus merchants can't schedule per-customer prices", "The case I first built, and the feature I designed to fix it."],
    ["Direct assignment is the only route", "I assumed per-location pricing needed it. A market can target one location."],
    ["Rollouts edit prices on a date", "They don't: they flip which prepared catalog is active."],
    ["$180–270M at stake", "Every input underneath that number was invented."],
  ];
  const after: [string, string][] = [
    ["A market can serve one company location", "Shopify documents it with a worked example: “Company Location A.”"],
    ["Market catalogs can be scheduled", "The capability exists, for the market route."],
    ["The override can't be", "A direct catalog outranks markets for overlapping products, yet can't be a Rollout target."],
    ["Whether anyone needs both is unknown", "That's an empirical question, and it's what the rest of this is for."],
  ];
  const col = (title: ReactNode, tag: ReactNode, list: [string, string][], ok: boolean) => (
    <div>
      <div className="split-h">
        <span className="d3">{title}</span>
        {tag}
      </div>
      {list.map(([h, p]) => (
        <div key={h} className="pitem">
          <span className="ico" style={{ color: ok ? "var(--green)" : "var(--faint)", background: ok ? "var(--green-soft)" : "#fff", borderColor: ok ? "#c9ebe1" : "var(--line)" }}>
            {ok ? <RiCheckLine size={17} /> : <RiCloseLine size={17} />}
          </span>
          <div>
            <h5 style={!ok ? { textDecoration: "line-through", textDecorationColor: "#d0d0d0" } : undefined}>{h}</h5>
            <p>{p}</p>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <section className="sec" id="wrong">
      <div className="wrap">
        <SecHead
          tag="Where I went wrong"
          title="Late in the work, I found out my claim was wrong."
          sub="In Shopify's own documentation, on a page I'd walked past three times. Here is where the investigation started, and where it landed."
        />
        <Rv className="split">
          {col("Where it started: the thesis", <Chip variant="caption" color="rose">Wrong</Chip>, before, false)}
          {col("Where it landed: what survived", <Chip variant="caption" color="lime">Holds up</Chip>, after, true)}
        </Rv>
        <div className="grid g3" style={{ marginTop: 12 }}>
          {[
            ["1 question", "A reviewer asked whether a B2B market could target one company location"],
            ["3 pages", "Of Shopify's Help Center state the Rollouts restriction on direct catalogs"],
            ["23 Oct 2026", "When catalog Rollouts shipped, shortly before I wrote this"],
          ].map(([v, s], i) => (
            <Rv key={v} delay={i * 60} className="card pad">
              <div className="big">{v}</div>
              <div style={{ fontSize: 14, color: "var(--mute)", marginTop: 12, lineHeight: 1.5 }}>{s}</div>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- five steps, each with a small visual of its claim ---------- */

const PlanMini = () => (
  <div className="card pad dots-bg">
    <div className="kicker" style={{ marginBottom: 12 }}>Shopify plan availability · April 2026</div>
    <div className="card" style={{ overflow: "hidden" }}>
      {[
        ["", "Basic", "Grow", "Adv.", "Plus"],
        ["Companies, catalogs, net terms", "y", "y", "y", "y"],
        ["Direct catalog assignment", "n", "n", "n", "y"],
      ].map((r, i) => (
        <div key={i} className="grid items-center" style={{ gridTemplateColumns: "1.8fr repeat(4, 1fr)", padding: "10px 14px", borderTop: i ? "1px solid var(--line-2)" : 0, fontSize: 13, background: i === 0 ? "#fcfcfc" : undefined, color: i === 0 ? "var(--faint)" : "var(--ink-2)" }}>
          {r.map((c, j) => (
            <span key={j} style={{ textAlign: j ? "center" : "left", fontWeight: i === 2 && j === 0 ? 600 : undefined }}>
              {c === "y" ? <span style={{ color: "var(--green)" }}>✓</span> : c === "n" ? <span style={{ color: "#c4c4c4" }}>—</span> : c}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const RouteMini = () => (
  <div className="card pad dots-bg" style={{ display: "grid", gap: 10 }}>
    <div className="kicker">Can it be added to a rollout?</div>
    {[
      ["Market catalog", "Every B2B plan", true],
      ["Direct company-location catalog", "Plus only", false],
    ].map(([t, s, ok]) => (
      <div key={t as string} className="card flex items-center gap-3" style={{ padding: "12px 14px" }}>
        <span className="ico" style={{ color: ok ? "var(--green)" : "var(--red-ink)", background: ok ? "var(--green-soft)" : "var(--red-soft)", border: 0 }}>
          {ok ? <RiCheckLine size={17} /> : <RiCloseLine size={17} />}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{t as string}</div>
          <div style={{ fontSize: 12.5, color: "var(--faint)" }}>{s as string}</div>
        </div>
        <span className={cx("chip", ok ? "g" : "r")} style={{ marginLeft: "auto" }}>
          {ok ? "Schedulable" : "Not schedulable"}
        </span>
      </div>
    ))}
  </div>
);

const TargetMini = () => (
  <div className="card pad dots-bg">
    <div className="kicker" style={{ marginBottom: 12 }}>B2B market · company locations</div>
    <div className="card" style={{ padding: "6px 14px" }}>
      {["All company locations", "By shipping region", "Specific company locations"].map((t, i) => (
        <div key={t} className="flex items-start gap-3" style={{ padding: "10px 0", borderTop: i ? "1px solid var(--line-2)" : 0 }}>
          <span style={{ width: 16, height: 16, borderRadius: 99, flex: "none", marginTop: 2, boxShadow: i === 2 ? "inset 0 0 0 5px var(--ink)" : "inset 0 0 0 1.5px #b5b5b5" }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: i === 2 ? 600 : 400, color: i === 2 ? "var(--ink)" : "var(--mute)" }}>{t}</div>
            {i === 2 ? <span className="chip" style={{ marginTop: 8 }}>Company Location A</span> : null}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LadderMini = () => (
  <div className="card pad dots-bg pyr">
    <div className="kicker">Which catalog's price wins</div>
    {[
      ["1", "Direct to the location", "Wins, not schedulable", "r"],
      ["2", "Market · specific locations", "Schedulable", "g"],
      ["3", "Market · all locations", "Schedulable", "g"],
    ].map(([n, t, s, tone], i) => (
      <div key={n} className="card pyr-row" data-top={i === 0 || undefined} style={{ width: `${100 - i * 12}%`, zIndex: 3 - i }}>
        <span className="pyr-n">{n}</span>
        <span className="pyr-t">{t}</span>
        <span className={cx("chip", tone)}>{s}</span>
      </div>
    ))}
  </div>
);

const PlanListMini = () => (
  <div className="card pad dots-bg">
    <div className="kicker" style={{ marginBottom: 12 }}>Before anyone writes code</div>
    <div className="card" style={{ padding: "4px 14px" }}>
      {[
        ["Original rationale", "A day"],
        ["Reproduce behavior", "An afternoon"],
        ["Quantify usage", "A query"],
        ["Interview 8–10 merchants", "Two weeks"],
        ["Operational impact", "Same two weeks"],
      ].map(([t, c], i) => (
        <div key={t} className="flex items-center gap-3" style={{ padding: "9px 0", borderTop: i ? "1px solid var(--line-2)" : 0, fontSize: 14 }}>
          <span style={{ width: 18, height: 18, borderRadius: 5, boxShadow: "inset 0 0 0 1.5px #c4c4c4", flex: "none" }} />
          <span>{t}</span>
          <span className="chip" style={{ marginLeft: "auto" }}>
            <RiTimerLine size={12} style={{ marginRight: 4 }} />
            {c}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const STEPS: { n: string; t: ReactNode; d: ReactNode; chips: string[]; vis: ReactNode }[] = [
  {
    n: "Step 1 of 5 · The context",
    t: "In April 2026 Shopify brought B2B to every B2B-eligible plan.",
    d: (
      <>
        Companies, catalogs, net terms and volume pricing are now on Basic, Grow and Advanced, not only Plus. Shopify kept a few capabilities for Plus, and one is <code>direct catalog assignment</code>: attaching a price list straight to one company location.
      </>
    ),
    chips: ["2 April 2026", "Plus-only by design"],
    vis: <PlanMini />,
  },
  {
    n: "Step 2 of 5 · The asymmetry",
    t: "Direct catalogs can't be scheduled. Market catalogs can.",
    d: (
      <>
        Shopify's Help Center, stated three separate times: <em>"Direct company-location catalogs can't be added to a rollout."</em> Rollouts are how you schedule a catalog going live, time-box it, or test it. The Plus-only mechanism has none of that. This part holds up.
      </>
    ),
    chips: ["Verified on 3 pages"],
    vis: <RouteMini />,
  },
  {
    n: "Step 3 of 5 · What broke my thesis",
    t: "A market can be made for one single company location.",
    d: (
      <>
        Shopify's own words: <em>"Specific company locations: includes only the company locations you specify."</em> Their own example market is called <em>"Company Location A, a market specifically for a single company location."</em> So a Plus merchant who wants scheduled per-customer pricing can already have it, through markets, not direct assignment.
      </>
    ),
    chips: ["Found late"],
    vis: <TargetMini />,
  },
  {
    n: "Step 4 of 5 · The sharper finding",
    t: "Direct assignment is the override layer, and overrides can't be scheduled.",
    d: (
      <>
        <em>"A catalog assigned directly to the customer's company location takes precedence over market catalogs."</em> Market catalogs can target groups or a specific location and can be scheduled. The direct-assigned catalog itself cannot be a Rollout target. The unresolved question is whether merchants need both properties for the same contract workflow.
      </>
    ),
    chips: ["Documented hierarchy"],
    vis: <LadderMini />,
  },
  {
    n: "Step 5 of 5 · What I'd actually do",
    t: "Not build anything yet. Five investigations first.",
    d: (
      <>
        The workaround exists and its precedence is documented. A specific-location market is below direct assignment but above broader company-location and region markets. Whether merchants need the direct override and scheduled activation in the same workflow is an empirical question, section 07 has the five proposed investigations, in dependency order.
      </>
    ),
    chips: ["3 Weeks, given access", "1 day-one stop check"],
    vis: <PlanListMini />,
  },
];

export function HowItEnded() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, (window.innerHeight * 0.55 - r.top) / r.height));
      setP(prog);
      // a dot turns blue only once the filled line has reached its centre
      el.querySelectorAll<HTMLElement>(".step-dot").forEach((d) => {
        const dr = d.getBoundingClientRect();
        d.classList.toggle("on", dr.top + dr.height / 2 - r.top <= prog * r.height + 1);
      });
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <section className="sec" id="steps" data-sec="how">
      <div className="wrap">
        <SecHead tag="How it works" title="Where this ended up, in five steps." sub="Each step is a claim, and the small screen beside it is what the claim looks like in the product." />
        <div className="steps" ref={ref}>
          <div className="steps-line" aria-hidden>
            <i style={{ height: "100%", transform: `scaleY(${p})` }} />
          </div>
          {STEPS.map((s, i) => (
            <Rv key={s.n} className={cx("step", i % 2 === 1 && "flip")}>
              <span className="step-dot" aria-hidden />
              <div className="step-txt">
                <div className="step-n">{s.n}</div>
                <h3 className="d3">{s.t}</h3>
                <p>{s.d}</p>
                <div className="step-chips">
                  {s.chips.map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div>{s.vis}</div>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}
