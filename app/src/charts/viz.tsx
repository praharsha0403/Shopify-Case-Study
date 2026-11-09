import { RiQuestionAnswerLine, RiInformationLine, RiCalendarCheckLine, RiStarFill, RiStarLine, RiContrastLine, RiCheckLine, RiCloseLine, RiFlagFill, RiSearchEyeLine, RiRocket2Line, RiCheckboxCircleLine, RiFlagLine, RiHourglassLine, RiBookOpenLine, RiCalendarScheduleLine, RiDatabase2Line, RiLockLine, RiPaletteLine, RiPlayFill, RiPriceTag3Line, RiShoppingBag3Line, RiStackLine, RiStore2Line, RiUserLocationLine } from "@remixicon/react";
import { useMemo, useState, type ReactNode } from "react";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";
import { Switch } from "@/components/base/switch/switch";
import { useCountUp } from "@/hooks/use-count-up";
import { SETS } from "@/scenes/shopify";
import { cx } from "@/utils/cx";
import "./viz.css";

/*
 * One visual language for every chart: white soft cards, one big number with
 * a quiet unit, and the page's brand blue as the only data colour (tints for
 * context, the full blue for the answer). Green and red appear only as
 * semantic success and error. Every number is one the case study states;
 * LEGO contract prices in the resolver are illustrative.
 */

export const B = {
  blue: "#0073ff",
  b2: "#4d9dff",
  b3: "#9cc6ff",
  b4: "#d6e8ff",
  b5: "#eef5ff",
  ink: "#0d0d0d",
  track: "#f1f2f4",
};

/* ------------------------------------------------------------------------ */
/* Card shell                                                                */
/* ------------------------------------------------------------------------ */

export function Card({
  label,
  value,
  unit,
  vkey,
  delta,
  deltaTone = "blue",
  sub,
  right,
  children,
  className,
}: {
  label: ReactNode;
  value?: ReactNode;
  unit?: ReactNode;
  vkey?: string | number;
  delta?: ReactNode;
  deltaTone?: "blue" | "ok" | "bad" | "mute";
  sub?: ReactNode;
  right?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("vz", className)}>
      <header className="vz-h">
        <div className="vz-h__l">
          <div className="vz-top">
            <p className="vz-label">{label}</p>
            {delta ? (
              <span className="vz-delta" data-tone={deltaTone}>
                {delta}
              </span>
            ) : null}
          </div>
          {value !== undefined ? (
            <div className="vz-val" key={vkey}>
              <span className="vz-num">{value}</span>
              {unit ? <span className="vz-unit">{unit}</span> : null}
            </div>
          ) : null}
          {sub ? <p className="vz-sub">{sub}</p> : null}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Evidence funnel, 6 public signals narrow to 0                            */
/* ------------------------------------------------------------------------ */

const FUNNEL = [
  { v: 6, k: "Public signals", d: "Forum posts, replies and a developer's validation thread." },
  { v: 4, k: "In their own thread", d: "Two of the six are replies inside Bryce_David's thread." },
  { v: 3, k: "About B2B pricing", d: "EVP, lu_judy and UndoB2B. Bryce_David's sample is D2C apps." },
  { v: 1, k: "Written by a merchant", d: "Only EVP identifies as a merchant (Shopify Plus)." },
  { v: 0, k: "Name direct assignment", d: "Nobody names direct catalogs, and nobody asks for scheduling." },
];

/** The six signals, step by step: one row of six slots per filter, same tick language as the limit meters. */
export function EvidenceFunnel() {
  const [a, setA] = useState<number | null>(null);
  const H = 200; // plot height in px
  const hOf = (v: number) => (v / 7) * H; // one step of headroom above the tallest bar
  return (
    <Card label="Six public signals, filtered step by step" sub="Nobody names direct catalogs, and nobody asks for scheduling.">
      <div className="fn" style={{ ["--h" as string]: `${H}px` }} onMouseLeave={() => setA(null)} role="img" aria-label="Six public signals narrow to zero that name direct assignment">
        <div className="fn-axis" aria-hidden>
          {[6, 4, 2, 0].map((t) => (
            <span key={t} style={{ bottom: hOf(t) }}>
              {t}
            </span>
          ))}
        </div>
        {FUNNEL.map((f, i) => {
          const next = FUNNEL[i + 1];
          const h = hOf(f.v);
          const prev = i ? FUNNEL[i - 1].v : null;
          return (
            <div key={f.k} className="fn-col" data-on={a === i || undefined} data-dim={a !== null && a !== i ? "" : undefined} data-zero={f.v === 0 || undefined} onMouseEnter={() => setA(i)}>
              <div className="fn-head">
                <span className="fn-k">{f.k}</span>
                <span className="fn-v">{f.v}</span>
              </div>
              <div className="fn-plot">
                <span className="fn-bar" style={{ height: Math.max(h, 6) }} />
                {f.v > 0 ? <span className="fn-cap" style={{ bottom: h + 12 }} /> : null}
                {next ? (
                  <svg className="fn-link" viewBox={`0 0 10 ${H}`} preserveAspectRatio="none" aria-hidden>
                    <polygon points={`0,${H - h} 10,${H - hOf(next.v)} 10,${H} 0,${H}`} />
                  </svg>
                ) : null}
                {a === i ? (
                  <span className="fn-tip" style={{ bottom: Math.min(Math.max(h, 6) + 22, H - 84) }} data-right={i >= 3 || undefined}>
                    <span className="fn-tip__m">
                      <b>{f.v}</b> {f.v === 1 ? "signal" : "signals"}
                      {prev !== null ? (
                        <>
                          <i />
                          Kept <b>{Math.round((f.v / prev) * 100)}%</b>
                          <i />
                          Dropped <b>{prev - f.v}</b>
                        </>
                      ) : (
                        <>
                          <i />
                          Starting set
                        </>
                      )}
                    </span>
                    <span className="fn-tip__d">{f.d}</span>
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* Kept for imports: the provenance view is now the funnel. */
export const ProvenanceMatrix = EvidenceFunnel;

/* ------------------------------------------------------------------------ */
/* Dot matrix, 109 negative reviews                                         */
/* ------------------------------------------------------------------------ */

function Stars({ n }: { n: number }) {
  return (
    <span className="rt-stars" role="img" aria-label={`${n} of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (i < n ? <RiStarFill key={i} size={13} /> : <RiStarLine key={i} size={13} />))}
    </span>
  );
}

export function ReviewWaffle() {
  const display = useCountUp(109);
  return (
    <section className="vz rt">
      <div className="rt-left">
        <span className="rt-tag">
          <RiInformationLine size={14} />
          Sample: D2C apps, not B2B
        </span>
        <span className="rt-big">{display}</span>
        <b>negative reviews read across 17 bulk-price apps</b>
        <span className="rt-src">
          As reported by one Shopify Community poster, 1 Aug 2026 ·{" "}
          <a href="https://community.shopify.com/t/i-read-109-negative-reviews-of-bulk-price-and-store-credit-apps/730617" target="_blank" rel="noreferrer">
            read the post
          </a>
        </span>
      </div>
      <div className="rt-right">
        <div className="rt-tiles">
          <div className="rt-tile" data-tone="b">
            <Stars n={2} />
            <span className="rt-n">97</span>
            <span className="rt-l">rated 1 or 2 stars</span>
            <span className="rt-s">89% of the reviews</span>
          </div>
          <div className="rt-tile">
            <Stars n={3} />
            <span className="rt-n">12</span>
            <span className="rt-l">rated 3 stars</span>
            <span className="rt-s">11% of the reviews</span>
          </div>
          <div className="rt-tile" data-tone="ink">
            <span className="rt-ic">
              <RiContrastLine size={15} />
            </span>
            <span className="rt-n">≈12</span>
            <span className="rt-l">describe partial variant updates</span>
            <span className="rt-s">The poster's estimate</span>
          </div>
        </div>
        <div className="rt-bar" role="img" aria-label="97 of 109 reviews rated 1 or 2 stars, 12 rated 3 stars">
          <i style={{ flexBasis: `${(97 / 109) * 100}%` }} />
          <i style={{ flexBasis: `${(12 / 109) * 100}%` }} data-soft="" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Tick meter, "Total project" style limit cards                           */
/* ------------------------------------------------------------------------ */

/**
 * Limit meter in one shape: a solid value chunk followed by slot ticks.
 * `slots` draws `count` ticks with the first `hi` emphasised; `chunk` draws
 * the documented value as a pill and the advertised remainder as ghost ticks.
 */
export function TickMeter(
  props:
    | { kind: "slots"; label: string; value: string; unit?: string; sub: ReactNode; count: number; hi: number; hiLabel: string; restLabel: string }
    | { kind: "chunk"; label: string; value: string; unit?: string; sub: ReactNode; chunk: string; rest: string; share?: number; ticks?: number },
) {
  return (
    <Card label={props.label} value={props.value} unit={props.unit} sub={props.sub}>
      {props.kind === "slots" ? (
        <div className="vz-slots">
          <div className="vz-slots__row" style={{ gridTemplateColumns: `repeat(${props.count}, 1fr)` }}>
            {Array.from({ length: props.count }, (_, i) => (
              <i key={i} data-hi={i < props.hi || undefined} />
            ))}
          </div>
          <div className="vz-slots__legend">
            <span>
              <b data-hi /> {props.hiLabel}
            </span>
            {props.restLabel ? (
              <span>
                <b /> {props.restLabel}
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="vz-chunk">
          <span className="vz-chunk__v" style={{ flexBasis: `${(props.share ?? 0.3) * 100}%` }}>
            {props.chunk}
          </span>
          <span className="vz-chunk__rest">
            {Array.from({ length: props.ticks ?? 22 }, (_, i) => (
              <i key={i} />
            ))}
          </span>
          <span className="vz-chunk__l">{props.rest}</span>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------------ */
/* Plan comparison (light, Apple "compare models" style: values, no ticks)  */
/* ------------------------------------------------------------------------ */

type PlanLine = { ic: ReactNode; v: ReactNode; off?: boolean; bad?: boolean; note?: string };
const ROW_IC = {
  mkt: <RiStore2Line size={15} />,
  direct: <RiUserLocationLine size={15} />,
  sched: <RiCalendarScheduleLine size={15} />,
  loc: <RiStackLine size={15} />,
  store: <RiDatabase2Line size={15} />,
};
const baseLines = (): PlanLine[] => [
  { ic: ROW_IC.mkt, v: <><b>3</b> active catalog assignments to B2B markets</> },
  { ic: ROW_IC.direct, v: "Direct company catalogs: not available", off: true },
  { ic: ROW_IC.sched, v: "Schedule a direct catalog with Rollouts: not available", off: true },
  { ic: ROW_IC.loc, v: <><b>25</b> catalogs per company location</> },
  { ic: ROW_IC.store, v: <><b>10,000</b> catalogs per store</> },
];
const PLANS: { n: string; t: string; p: string; from?: boolean; hot?: boolean; lines: PlanLine[] }[] = [
  { n: "Basic", t: "For solo entrepreneurs", p: "$29", lines: baseLines() },
  { n: "Grow", t: "For small teams", p: "$89", lines: baseLines() },
  { n: "Advanced", t: "For global reach", p: "$359", lines: baseLines() },
  {
    n: "Plus",
    t: "For complex businesses",
    p: "$2,300",
    from: true,
    hot: true,
    lines: [
      { ic: ROW_IC.mkt, v: <><b>Unlimited</b> active catalog assignments to B2B markets</> },
      { ic: ROW_IC.direct, v: <>Direct company catalogs <b>included</b></> },
      { ic: ROW_IC.sched, v: <>Schedule a direct catalog with Rollouts: <b>not supported</b></>, bad: true, note: "Stated on a different Help Center page" },
      { ic: ROW_IC.loc, v: <><b>25</b> catalogs per company location</> },
      { ic: ROW_IC.store, v: <><b>10,000</b> catalogs per store</>, note: "Marketed as \u201CUnlimited B2B catalogs\u201D" },
    ],
  },
];

/** Shopify plans as pricing cards (header tile, price, dotted rule, B2B limits). Plus is the dark card. */
export function PlanCompare() {
  return (
    <div className="pl">
      {PLANS.map((p) => (
        <div key={p.n} className="pl-card" data-hot={p.hot || undefined}>
          <div className="pl-head">
            <span className="pl-n">{p.n}</span>
            <span className="pl-t">{p.t}</span>
          </div>
          <div className="pl-body">
            <div className="pl-price">
              {p.from ? <small>from</small> : null}
              <b>{p.p}</b>
              <small>/ month</small>
            </div>
            <div className="pl-rule" />
            <p className="pl-k">B2B on {p.n}:</p>
            <ul className="pl-list">
              {p.lines.map((l, i) => (
                <li key={i} data-off={l.off || undefined} data-bad={l.bad || undefined}>
                  <span className="pl-ic">{l.ic}</span>
                  <span>
                    {l.v}
                    {l.note ? <em>{l.note}</em> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Segmented arc gauge, "120 New customer" style                           */
/* ------------------------------------------------------------------------ */

/** Percentage as a tick meter (kept the old name so call sites stay the same). */
export function ArcGauge({ value, label, unit = "%", sub, context, segments = 24 }: { value: number; label: string; unit?: string; sub?: string; context: ReactNode; segments?: number }) {
  const lit = Math.round((value / 100) * segments);
  const display = useCountUp(value);
  return (
    <div className="vz vz-pct">
      <p className="vz-label">{label}</p>
      <div className="vz-val">
        <span className="vz-num">{display}</span>
        <span className="vz-unit">
          {unit} {sub}
        </span>
      </div>
      <div className="vz-pct__t" aria-hidden>
        {Array.from({ length: segments }, (_, i) => (
          <i key={i} data-hi={i < lit || undefined} />
        ))}
      </div>
      <div className="vz-pct__c">{context}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Glossy bars, horizontal timelines and vertical day bars                 */
/* ------------------------------------------------------------------------ */

type PlanItem = { t: string; d: string; when: string; strong?: boolean };
type PlanGroup = { h: string; note?: string; items: PlanItem[] };

export type TaskItem = { t: ReactNode; d?: ReactNode; right?: ReactNode; flag?: boolean; key?: boolean; keyLabel?: string };
export type TaskGroup = { h?: string; note?: string; items: TaskItem[] };
export type TaskProp = { ic: ReactNode; k: string; v: ReactNode; tone?: "b" | "a" | "g" };

/** Task-style card: icon tile header, summary pill, a tree of tasks, property rows. */
export function TaskCard({ icon, title, sub, pill, groups, props }: { icon: ReactNode; title: ReactNode; sub?: ReactNode; pill?: ReactNode; groups: TaskGroup[]; props?: TaskProp[] }) {
  return (
    <section className="vz tk">
      <header className="tk-h">
        <span className="tk-ic">{icon}</span>
        <div className="min-w-0">
          <b>{title}</b>
          {sub ? <span>{sub}</span> : null}
        </div>
      </header>
      {pill ? (
        <div className="tk-pill">
          <RiCheckboxCircleLine size={16} />
          <span>{pill}</span>
        </div>
      ) : null}
      {groups.map((g, gi) => (
        <div key={gi} className="tk-g">
          {g.h ? (
            <div className="tk-gh">
              <span>{g.h}</span>
              {g.note ? <em>{g.note}</em> : null}
            </div>
          ) : null}
          <ul className="tk-tree">
            {g.items.map((it, i) => (
              <li key={i} data-key={it.key || undefined}>
                <span className="tk-box" aria-hidden />
                <span className="tk-t">
                  {it.keyLabel ? <small>{it.keyLabel}</small> : null}
                  <b>
                    {it.t}
                    {it.flag ? <RiFlagFill size={13} className="tk-flag" aria-label="Can stop the work early" /> : null}
                  </b>
                  {it.d ? <i>{it.d}</i> : null}
                </span>
                {it.right ? <span className="tk-r">{it.right}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {props && props.length ? (
        <dl className="tk-props">
          {props.map((p) => (
            <div key={p.k}>
              <dt>
                {p.ic}
                {p.k}
              </dt>
              <dd>
                <span className="tk-chip" data-tone={p.tone}>
                  {p.v}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}

function PlanRows({ groups, label, value, chip, sub, icon, status, statusTone }: { groups: PlanGroup[]; label: string; value: string; chip: string; sub: string; icon: ReactNode; status: string; statusTone: "b" | "a" | "g" }) {
  const n = groups.reduce((x, g) => x + g.items.length, 0);
  const early = groups.reduce((x, g) => x + g.items.filter((i) => i.strong).length, 0);
  return (
    <TaskCard
      icon={icon}
      title={label}
      sub={sub}
      pill={
        <>
          {n} steps · {value}
          {early ? (
            <>
              {" "}· <RiFlagFill size={12} className="tk-flag" /> {early} can stop it early
            </>
          ) : null}
        </>
      }
      groups={groups.map((g) => ({ h: g.h, note: g.note, items: g.items.map((it) => ({ t: it.t, d: it.d, right: it.when, flag: it.strong })) }))}
      props={[
        { ic: <RiHourglassLine size={15} />, k: "Estimate", v: value },
        { ic: <RiFlagLine size={15} />, k: "Status", v: status, tone: statusTone },
        { ic: <RiPriceTag3Line size={15} />, k: "Basis", v: chip },
      ]}
    />
  );
}


export type Step = { t: string; stop: string; when: string; lab?: string };
export type StepGroup = { h: string; note?: string; parallel?: boolean; items: Step[] };

/** Plain stepper: numbered steps on a line; parallel steps sit side by side. */
export function Stepper({ icon, title, total, sub, stopLabel, groups, foot }: { icon: ReactNode; title: string; total: string; sub: string; stopLabel: string; groups: StepGroup[]; foot?: ReactNode }) {
  let n = 0;
  const card = (s: Step) => {
    n += 1;
    return (
      <div className="sp-step" key={s.t}>
        <span className="sp-n">{n}</span>
        <div className="sp-body">
          <div className="sp-top">
            <b>{s.t}</b>
            <span className="sp-when">{s.when}</span>
          </div>
          <p>
            <em>{s.lab ?? stopLabel}</em>
            {s.stop}
          </p>
        </div>
      </div>
    );
  };
  return (
    <section className="vz sp">
      <header className="cd-h">
        <span className="cd-ic">{icon}</span>
        <div className="cd-tx">
          <b>{title}</b>
          <span>{sub}</span>
        </div>
        <span className="cd-total">{total}</span>
      </header>
      {groups.map((g) => (
        <div key={g.h} className="sp-g">
          <div className="sp-gh">
            <span>{g.h}</span>
            {g.note ? <em>{g.note}</em> : null}
          </div>
          <div className={g.parallel ? "sp-par" : "sp-seq"}>{g.items.map(card)}</div>
        </div>
      ))}
      {foot ? <p className="sp-foot">{foot}</p> : null}
    </section>
  );
}

export function DiscoveryGantt() {
  return (
    <Stepper
      icon={<RiSearchEyeLine size={20} />}
      title="Discovery, in dependency order"
      total="3 Weeks"
      sub="Proposed, given access. Nothing here has started."
      stopLabel="Stop if"
      groups={[
        {
          h: "Week 1",
          note: "Cheap checks first, one after another",
          items: [
            { t: "Original rationale", stop: "a current rationale already covers the asymmetry", when: "A day" },
            { t: "Reproduce behavior", lab: "Never a stop on its own:", stop: "it proves technical behavior, not merchant need", when: "An afternoon" },
            { t: "Quantify usage", stop: "the direct-assignment cohort is thin", when: "A query" },
          ],
        },
        {
          h: "Weeks 1–3",
          note: "In parallel",
          parallel: true,
          items: [
            { t: "Interview 8–10 merchants", stop: "the workaround meets a verified merchant need", when: "Two weeks" },
            { t: "Operational impact", stop: "repricing is rare or already automated", when: "Two weeks" },
          ],
        },
      ]}
      foot="Only the rationale check can stop the work inside week one. The customer-need decision waits for the interviews."
    />
  );
}

export function ShipGantt() {
  return (
    <Stepper
      icon={<RiRocket2Line size={20} />}
      title="Only if the investigations say build"
      total="22+ weeks"
      sub="Conditional on outcome C. Each phase is a gate, not a commitment."
      stopLabel="Gate:"
      groups={[
        {
          h: "Quarter 1",
          items: [
            { t: "Discovery", stop: "if usage comes back thin, write it up and stop", when: "Weeks 1–3" },
            { t: "Design and scope", stop: "can a rollout target a non-market catalog, and at what cost?", when: "Weeks 4–7" },
            { t: "Closed beta", stop: "a provisional 25–40 merchant learning cohort, Launch first", when: "Weeks 8–13" },
          ],
        },
        {
          h: "Quarter 2",
          items: [
            { t: "Open beta", stop: "Event only once Launch and rollback are proven", when: "Weeks 14–21" },
            { t: "GA and disclosure", stop: "opt-in first, Editions after adoption evidence", when: "Weeks 22+" },
          ],
        },
      ]}
    />
  );
}

/* ------------------------------------------------------------------------ */
/* When each resource type joined Rollouts                                  */
/* ------------------------------------------------------------------------ */

export function RolloutsJoined() {
  return (
    <section className="vz rk">
      <header className="cd-h">
        <span className="cd-ic">
          <RiCalendarScheduleLine size={20} />
        </span>
        <div className="cd-tx">
          <b>What Rollouts can schedule</b>
          <span>Catalogs joined last, on 23 Oct 2026</span>
        </div>
      </header>
      <div className="rk-g">
        <span className="rk-k">Could already schedule</span>
        <div className="rk-chips">
          {["Discounts", "Themes", "Checkout & accounts"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
      <div className="rk-g">
        <span className="rk-k">
          Added 23 Oct 2026 · <b>Catalogs</b>, but only one of the two types
        </span>
        <div className="rk-two">
          <div className="rk-t" data-tone="ok">
            <span className="rk-ic">
              <RiCheckLine size={16} />
            </span>
            <b>Market catalogs</b>
            <span className="vz-pill" data-tone="ok">Schedulable</span>
          </div>
          <div className="rk-t" data-tone="bad">
            <span className="rk-ic">
              <RiCloseLine size={16} />
            </span>
            <b>Direct company-location catalogs</b>
            <span className="vz-pill" data-tone="bad">Not schedulable</span>
          </div>
        </div>
      </div>
      <p className="rl-q">
        Changelog: “schedule product availability and pricing <b>per market</b>.”
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Price resolver, one LEGO set, one retailer, the precedence ladder        */
/* ------------------------------------------------------------------------ */

const RUNGS = [
  { id: 1, t: "Direct to the company location", s: "Brickyard Toys · Plus only", sched: false },
  { id: 2, t: "Market · specific company locations", s: "Brickyard Toys market (1 location)", sched: true },
  { id: 3, t: "Market · all company locations", s: "Toy retailers · US", sched: true },
  { id: 4, t: "Region market · specific regions", s: "Not used here", sched: true },
  { id: 5, t: "Region market · all regions", s: "Not used here", sched: true },
  { id: 6, t: "App catalog", s: "Online Store · retail", sched: null },
];

export function PriceResolver() {
  const [direct, setDirect] = useState(true);
  const [after, setAfter] = useState(true);
  // illustrative: the direct contract price is HIGHER than the market price, and still wins on precedence
  const price: Record<number, number | null> = useMemo(() => ({ 1: direct ? 52 : null, 2: after ? 46.4 : 50, 3: 55, 4: null, 5: null, 6: 99.99 }), [direct, after]);
  const winner = RUNGS.find((r) => price[r.id] !== null)!;
  const value = price[winner.id]!;
  const cents = Math.round(value * 100);
  const display = useCountUp(cents);
  const blocked = after && direct;
  return (
    <Card
      label={`Brickyard Toys pays · ${SETS.galaxy.name} ${SETS.galaxy.num}`}
      value={`$${(display / 100).toFixed(2)}`}
      vkey={`${direct}${after}`}
      delta={winner.id === 1 ? "Direct catalog wins" : "Market catalog wins"}
      deltaTone="mute"
      sub={
        blocked
          ? "The rollout lowered the market price to $46.40 · the buyer still pays $52.00, because the direct catalog outranks it even at a higher price."
          : !direct
            ? after
              ? "With no direct catalog, the scheduled market catalog decides the price: $46.40."
              : "Before the rollout, the 2026 market catalog is active: $50.00."
            : "Before the rollout, the direct catalog already decides the price: $52.00, above the $50.00 market price."
      }
    >
      <div className="vz-toolbar">
        <Switch isSelected={direct} onChange={setDirect} size="sm">
          <span className="text-body-2-medium text-text-secondary">Direct catalog assigned</span>
        </Switch>
        <SegmentedControl
          aria-label="Rollout"
          selectedKeys={new Set([after ? "after" : "before"])}
          onSelectionChange={(k) => {
            const v = [...k][0];
            if (v) setAfter(v === "after");
          }}
        >
          <SegmentedControlItem id="before">Dec 31</SegmentedControlItem>
          <SegmentedControlItem id="after">Jan 1 · rollout live</SegmentedControlItem>
        </SegmentedControl>
      </div>
      <div className="vz-ladder">
        {RUNGS.map((r) => {
          const p = price[r.id];
          const win = r.id === winner.id;
          const dead = p === null;
          return (
            <div key={r.id} className="vz-rung" data-win={win || undefined} data-dead={dead || undefined}>
              <span className="vz-rung__n">{r.id}</span>
              <span className="vz-rung__t">
                <b>{r.t}</b>
                <small>{r.s}</small>
              </span>
              {r.sched === null ? <span /> : <span className="vz-pill" data-tone={r.sched ? "ok" : "bad"}>{r.sched ? "Schedulable" : "Not schedulable"}</span>}
              <span className="vz-rung__p">{dead ? "—" : `$${p!.toFixed(2)}`}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------------ */
/* Decision map: stop results grouped by the outcome they force (no crossings) */
/* ------------------------------------------------------------------------ */

const FLOW: { n: number; t: string; stop: string; o: string[]; ot: string; tone: string }[] = [
  { n: 1, t: "Original rationale", stop: "Stops if a current rationale already covers the asymmetry", o: ["B", "A"], ot: "Either", tone: "B" },
  { n: 2, t: "Reproduce behavior", stop: "Never stops it alone: proves behavior, not merchant need", o: ["→"], ot: "Informs 4", tone: "I" },
  { n: 3, t: "Quantify usage", stop: "Stops if the direct-assignment cohort is thin", o: ["A"], ot: "Do nothing", tone: "A" },
  { n: 4, t: "Interview merchants", stop: "Stops if the workaround meets a verified merchant need", o: ["A", "B", "D"], ot: "Any", tone: "D" },
  { n: 5, t: "Operational impact", stop: "Stops if repricing is rare or already automated", o: ["A"], ot: "Do nothing", tone: "A" },
];

/** Shopify Flow-style workflow: checks run in order; a stop result branches out, otherwise continue. */
export function DecisionMap() {
  return (
    <Card label="Where each answer leads" delta="Only C needs engineering" deltaTone="mute" value="4 of 5" unit="checks can stop the work" sub="Five checks run left to right. A stop result exits down to an outcome; investigation 2 informs the interviews instead of stopping anything. Only passing all five reaches a build.">
      <div className="gt">
        <div className="gt-cols">
          {FLOW.map((f) => (
            <div key={f.n} className="gt-col">
              <div className="gt-lab">
                <b>{f.t}</b>
                <i>{f.stop}</i>
              </div>
              <span className="gt-dot">{f.n}</span>
              <span className="gt-stem" aria-hidden />
              <span className="gt-out" data-o={f.tone}>
                {f.o.map((l) => (
                  <em key={l}>{l}</em>
                ))}
                {f.ot}
              </span>
            </div>
          ))}
          <div className="gt-col gt-col--end">
            <div className="gt-lab">
              <b>All five pass</b>
              <i>No stop result fires</i>
            </div>
            <span className="gt-dot gt-dot--end" aria-hidden>
              <RiCheckLine size={16} />
            </span>
            <span className="gt-stem" aria-hidden />
            <span className="gt-out" data-o="C">
              <em>C</em>
              Parity build
            </span>
          </div>
          <span className="gt-track" aria-hidden />
        </div>
        <div className="gt-legend">
          <span>Where a stop result leads:</span>
          <span data-o="A"><em>A</em>Do nothing</span>
          <span data-o="B"><em>B</em>Fix the disclosure</span>
          <span data-o="D"><em>D</em>Guided setup</span>
          <span data-o="I"><em>→</em>Informs a later check</span>
          <span data-o="C"><em>C</em>Parity build, only if all five pass</span>
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------------ */
/* Journey: nine day tiles, one dot per idea (red = wrong, grey = kept)     */
/* ------------------------------------------------------------------------ */

export function JourneyBars({ kills, onPick, picked }: { kills: boolean[]; onPick: (i: number | null) => void; picked: number | null }) {
  const wrong = kills.filter(Boolean).length;
  const total = kills.length;
  // longest run of consecutive ideas that held up
  let best = 0, run = 0, end = -1;
  kills.forEach((k, i) => {
    run = k ? 0 : run + 1;
    if (run > best) {
      best = run;
      end = i;
    }
  });
  const from = end - best + 1;
  return (
    <section className="vz jg">
      <header className="cd-h">
        <span className="cd-ic">
          <RiCalendarCheckLine size={20} />
        </span>
        <div className="cd-tx">
          <b>Every idea I logged, in order</b>
          <span>One square per idea. Pick one to read it on its own.</span>
        </div>
      </header>
      <div className="jg-stats">
        <div>
          <span className="jg-n" data-tone="r">{wrong}</span>
          <span>of {total} turned out wrong</span>
        </div>
        <div>
          <span className="jg-n">{total - wrong}</span>
          <span>held up</span>
        </div>
      </div>
      <div className="jg-line">
        <div className="jg-sq" style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
          {kills.map((k, i) => (
            <button key={i} data-w={k || undefined} data-on={picked === i || undefined} data-dim={picked !== null && picked !== i ? "" : undefined} onClick={() => onPick(picked === i ? null : i)} aria-label={`Idea ${i + 1}: ${k ? "wrong" : "held up"}`} />
          ))}
          <span className="jg-run" style={{ gridColumn: `${from + 1} / ${end + 2}` }}>
            {best} in a row held up
          </span>
        </div>
        <div className="jg-ends">
          <span>First idea</span>
          <span>Latest</span>
        </div>
      </div>
      <div className="vz-slots__legend">
        <span>
          <b style={{ background: "#e5484d" }} /> An idea that turned out wrong
        </span>
        <span>
          <b style={{ background: "#e8eaee" }} /> An idea that held up
        </span>
      </div>
    </section>
  );
}

/** Interview guide as a script: the questions in the order I'd ask them. */
export function InterviewScript({ questions, key4 }: { questions: string[]; key4: number }) {
  return (
    <section className="vz qs">
      <header className="cd-h">
        <span className="cd-ic">
          <RiQuestionAnswerLine size={20} />
        </span>
        <div className="cd-tx">
          <b>Interview guide</b>
          <span>8–10 Plus B2B merchants · feeds investigation 4</span>
        </div>
        <span className="cd-total">45 min</span>
      </header>
      <ol className="qs-list">
        {questions.map((q, i) => (
          <li key={i} data-key={i === key4 || undefined}>
            <span className="qs-n">Q{i + 1}</span>
            <div className="qs-b">
              {i === key4 ? <small>The one that decides it</small> : null}
              <p>{q}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="sp-foot">Every question is about the last time something happened, not what they'd want next time.</p>
    </section>
  );
}
