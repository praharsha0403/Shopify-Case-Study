import type { ReactNode } from "react";
import {
  AlertTriangleIcon,
  CalendarTimeIcon,
  CatalogIcon,
  ChartVerticalIcon,
  ChevronLeftIcon,
  ContentIcon,
  DiscountIcon,
  GlobeIcon,
  HomeIcon,
  OrderIcon,
  LayoutSidebarLeftIcon,
  PersonIcon,
  PlusCircleIcon,
  ProductIcon,
  SearchIcon,
  SettingsIcon,
  StoreIcon,
  CartIcon,
  ChartLineIcon,
  ShopcodesIcon,
} from "@shopify/polaris-icons";
import { BrandMark, Collapse, Count, Popover, Stage, Swap, Window, type Act } from "@/kit";
import "./shopify.css";

/*
 * The 2026 Shopify admin (dark full-height nav, white content sheet, Sidekick
 * bar), rebuilt from the live admin and Polaris icons. LEGO is used as a
 * hypothetical merchant for recognisability: LEGO is not a Shopify customer.
 * Set names, numbers, images and retail prices are LEGO's; the retailer,
 * catalogs, contract prices and screen states are illustrative.
 */

export const LEGO_LOGO = "/ref/lego-logo.svg";
export const SETS = {
  galaxy: { name: "Galaxy Explorer", num: "10497", retail: 99.99, img: "/ref/lego-10497.png" },
  roses: { name: "Bouquet of Roses", num: "10328", retail: 59.99, img: "/ref/lego-10328.png" },
  starry: { name: "The Starry Night", num: "21333", retail: 169.99, img: "/ref/lego-21333.png" },
  ferrari: { name: "Ferrari Daytona SP3", num: "42143", retail: 449.99, img: "/ref/lego-42143.png" },
};

type Ic = typeof HomeIcon;
const I = ({ s, size = 20 }: { s: Ic; size?: number }) => {
  const C = s as unknown as (p: { width: number; height: number; fill: string }) => ReactNode;
  return <C width={size} height={size} fill="currentColor" />;
};

type Nav = "catalogs" | "rollouts" | "markets";

/* ------------------------------------------------------------------------ */
/* Admin chrome                                                              */
/* ------------------------------------------------------------------------ */

function Admin({ active, children, compact, sidekick = true }: { active: Nav; children: ReactNode; compact?: boolean; sidekick?: boolean }) {
  const item = (icon: Ic | null, label: string, opts: { on?: boolean; sub?: boolean; badge?: string } = {}) => (
    <div className="sfy-nav" data-on={opts.on || undefined} data-sub={opts.sub || undefined}>
      {icon ? (
        <span className="sfy-nav__ic">
          <I s={icon} />
        </span>
      ) : null}
      <span className="sfy-nav__t">{label}</span>
      {opts.badge ? <span className="sfy-nav__b">{opts.badge}</span> : null}
    </div>
  );
  return (
    <div className="sfy">
      {!compact && (
        <aside className="sfy-side">
          <div className="sfy-side__top">
            <BrandMark brand="shopify" size={24} tile={false} surface="dark" />
            <span className="sfy-side__toggle">
              <I s={LayoutSidebarLeftIcon} size={18} />
            </span>
          </div>
          <div className="sfy-search">
            <I s={SearchIcon} size={16} />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </div>
          <div className="sfy-navlist">
            {item(HomeIcon, "Home")}
            {item(OrderIcon, "Orders", { badge: "12" })}
            {item(ProductIcon, "Products")}
            {item(PersonIcon, "Customers")}
            {item(ChartLineIcon, "Growth")}
            {item(DiscountIcon, "Discounts")}
            {item(ContentIcon, "Content")}
            {item(GlobeIcon, "Markets", { on: active === "markets" })}
            {item(null, "Catalogs", { on: active === "catalogs", sub: true })}
            {item(null, "Rollouts", { on: active === "rollouts", sub: true })}
            {item(ChartVerticalIcon, "Analytics")}
            <div className="sfy-navhead">Sales channels</div>
            {item(StoreIcon, "Online Store")}
            {item(ShopcodesIcon, "Agentic")}
          </div>
          <div className="sfy-side__foot">
            {item(SettingsIcon, "Settings")}
            <div className="sfy-store">
              <img src={LEGO_LOGO} alt="" />
              <span>LEGO Wholesale</span>
            </div>
          </div>
        </aside>
      )}
      <div className="sfy-sheet">
        {children}
        {sidekick && !compact && (
          <div className="sfy-sidekick">
            <span className="sfy-sidekick__av" />
            <span>Work with Sidekick</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Head({ icon, crumbs, badge, actions, back }: { icon: Ic; crumbs: string[]; badge?: ReactNode; actions?: ReactNode; back?: boolean }) {
  return (
    <div className="sfy-head">
      {back ? (
        <span className="sfy-back">
          <I s={ChevronLeftIcon} size={16} />
        </span>
      ) : null}
      <span className="sfy-head__ic">
        <I s={icon} size={16} />
      </span>
      {crumbs.map((c, i) => (
        <span key={c} className={i === crumbs.length - 1 ? "sfy-head__t" : "sfy-head__c"}>
          {c}
          {i < crumbs.length - 1 ? <em>/</em> : null}
        </span>
      ))}
      {badge}
      <span className="sfy-head__sp" />
      {actions}
    </div>
  );
}

const Pill = ({ children, primary, ...rest }: { children: ReactNode; primary?: boolean } & Record<string, unknown>) => (
  <span className="sfy-btn" data-primary={primary || undefined} {...rest}>
    {children}
  </span>
);
const St = ({ tone, children }: { tone?: "ok" | "info" | "draft" | "warn"; children: ReactNode }) => (
  <span className="sfy-badge" data-tone={tone}>
    {children}
  </span>
);
const Chk = ({ on, off }: { on?: boolean; off?: boolean }) => <span className="sfy-chk" data-on={on || undefined} data-off={off || undefined} />;

/* ======================================================================== */
/* HERO, the real "New rollout" flow: add catalogs, the direct one can't   */
/* ======================================================================== */

type HS = { modal: boolean; picked: boolean; hint: boolean; applied: boolean };
const H0: HS = { modal: false, picked: false, hint: false, applied: false };

async function heroScript(a: Act<HS>) {
  await a.wait(900);
  await a.move("add-changes");
  await a.wait(200);
  await a.click();
  await a.set({ modal: true });
  await a.wait(700);
  await a.move("pick-market");
  await a.click();
  await a.set({ picked: true });
  await a.wait(700);
  await a.move("pick-direct");
  await a.wait(250);
  await a.set({ hint: true });
  await a.wait(2600);
  await a.set({ hint: false });
  await a.move("apply");
  await a.click();
  await a.set({ modal: false, applied: true });
  await a.wait(4200);
  await a.move("remove");
  await a.click();
  await a.set({ ...H0 });
  await a.wait(900);
}

const MODAL_ROWS = [
  { id: "pick-market", t: "Brickyard Toys · 2027 book", s: "B2B market · Brickyard Toys", ok: true },
  { id: "pick-us", t: "Toy retailers · US", s: "B2B market · 48 company locations", ok: true },
  { id: "pick-direct", t: "Brickyard Toys · contract", s: "Assigned directly · Brickyard Toys, Austin", ok: false },
  { id: "pick-dtc", t: "Online Store", s: "App catalog", ok: true },
];

export function HeroScene() {
  return (
    <Stage
      width={1120}
      height={600}
      compact={{ below: 720, width: 358, height: 560 }}
      initial={H0}
      poster={{ modal: true, picked: true, hint: true, applied: false }}
      script={heroScript}
      cursor={{ at: { wide: { x: 980, y: 560 }, compact: { x: 320, y: 520 } } }}
      className="sc sc-hero"
    >
      {(s, rect, layout) => {
        const compact = layout === "compact";
        const d = rect("pick-direct");
        return (
          <>
            <Window url="admin.shopify.com/store/lego-wholesale/rollouts/new" urlShape="pill" className="sc-hero__win">
              <Admin active="rollouts" compact={compact} sidekick={!s.modal}>
                <Head
                  icon={CalendarTimeIcon}
                  back
                  crumbs={compact ? ["New rollout"] : ["Rollouts", "2027 contract pricing"]}
                  badge={<St tone="info">Draft</St>}
                  actions={compact ? undefined : <Pill primary>Schedule</Pill>}
                />
                <div className="sfy-body sfy-form">
                  <div className="sfy-card sfy-row2">
                    <div className="sfy-field">
                      <label>Rollout name</label>
                      <div className="sfy-input">2027 contract pricing</div>
                    </div>
                    <Pill>
                      <I s={CalendarTimeIcon} size={14} /> Launch
                    </Pill>
                  </div>
                  <div className="sfy-sec">Scheduling</div>
                  <div className="sfy-card sfy-kv">
                    <span className="sfy-kv__k">Changes publish</span>
                    <div className="sfy-input">Jan 1, 2027 · 12:00 AM EST</div>
                  </div>
                  <div className="sfy-sec">Changes</div>
                  <div className="sfy-card sfy-changes" data-filled={s.applied || undefined}>
                    <Collapse open={!s.applied}>
                      <div className="sfy-empty">
                        <span>Prepare changes for a launch, sales event or experiment</span>
                        <span className="sfy-btn" data-soft data-target="add-changes" data-cursor="pointer">
                          Add changes
                        </span>
                      </div>
                    </Collapse>
                    <Collapse open={s.applied} reveal="drop">
                      <div className="sfy-change">
                        <span className="sfy-change__ic">
                          <I s={CatalogIcon} size={18} />
                        </span>
                        <div>
                          <div className="sfy-strong">Brickyard Toys · 2027 book</div>
                          <div className="sfy-sub">Catalog · set to Active</div>
                        </div>
                        <St tone="ok">Active</St>
                        <span className="sfy-x" data-target="remove" data-cursor="pointer">
                          ×
                        </span>
                      </div>
                    </Collapse>
                  </div>
                  {!compact && (
                    <>
                      <div className="sfy-sec">Audience</div>
                      <div className="sfy-card sfy-aud">
                        <div className="sfy-aud__k">
                          <span>Traffic allocation</span>
                          <Pill>All eligible visitors</Pill>
                          <span>Eligibility</span>
                          <Pill>
                            <Swap id={s.applied ? 1 : 0}>{s.applied ? "1 market" : "0 markets"}</Swap>
                          </Pill>
                        </div>
                        <div className="sfy-ring" data-on={s.applied || undefined}>
                          <span />
                          <em>Reached</em>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Admin>
              {/* dims the admin; lives inside the window so the window's rounded corners clip it */}
              <div className="sfy-scrim" data-on={s.modal || undefined} />
            </Window>

            {/* The real "Add changes" dialog */}
            <div className="sfy-modal" data-on={s.modal || undefined}>
              <div className="sfy-modal__h">
                <span>Add changes</span>
                <span className="sfy-x">×</span>
              </div>
              <div className="sfy-modal__b">
                {!compact && (
                  <div className="sfy-modal__cats">
                    {[
                      [CatalogIcon, "Catalogs", true],
                      [CartIcon, "Checkout & accounts"],
                      [DiscountIcon, "Discounts"],
                      [StoreIcon, "Online store"],
                    ].map(([ic, t, on]) => (
                      <div key={t as string} className="sfy-cat" data-on={on || undefined}>
                        <I s={ic as Ic} size={16} />
                        {t as string}
                      </div>
                    ))}
                  </div>
                )}
                <div className="sfy-modal__list">
                  {MODAL_ROWS.map((r) => {
                    const checked = r.id === "pick-market" && s.picked;
                    return (
                      <div key={r.id} className="sfy-pick" data-off={!r.ok || undefined} data-target={r.id} data-cursor={r.ok ? "pointer" : "default"}>
                        <Chk on={checked} off={!r.ok} />
                        <div style={{ minWidth: 0 }}>
                          <div className="sfy-strong">{r.t}</div>
                          <div className="sfy-sub">{r.s}</div>
                        </div>
                        {!r.ok ? (
                          <span className="sfy-lock">
                            <I s={AlertTriangleIcon} size={16} />
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                  <div className="sfy-modal__create">
                    <I s={PlusCircleIcon} size={16} /> Create a catalog
                  </div>
                </div>
              </div>
              <div className="sfy-modal__f">
                <Pill>Cancel</Pill>
                <Pill primary data-target="apply" data-cursor="pointer">
                  Apply
                </Pill>
              </div>
            </div>

            <Popover
              show={s.hint && s.modal}
              origin="top left"
              className="sc-tip"
              style={{ position: "absolute", left: Math.min(d.x + 24, (compact ? 358 : 1120) - (compact ? 300 : 330) - 12), top: d.y + d.height + 6, width: compact ? 300 : 330 }}
            >
              <div className="sc-tip__t">Can't be added to a rollout</div>
              <div className="sc-tip__b">Direct company-location catalogs can't be added to a rollout. Assign the catalog to a B2B market to schedule it.</div>
            </Popover>
          </>
        );
      }}
    </Stage>
  );
}

/* ======================================================================== */
/* ROLLOUT MECHANICS, Shopify's own timeline vocabulary, a catalog swap    */
/* ======================================================================== */

type RS = { t: 0 | 1 | 2 };
async function swapScript(a: Act<RS>) {
  await a.wait(1600);
  await a.set({ t: 1 });
  await a.wait(4200);
  await a.set({ t: 2 });
  await a.wait(3600);
  await a.set({ t: 0 });
  await a.wait(1200);
}

export function SwapScene() {
  return (
    <Stage width={1040} height={470} compact={{ below: 720, width: 358, height: 600 }} initial={{ t: 0 } as RS} poster={{ t: 1 }} script={swapScript} className="sc sc-swap">
      {(s, _r, layout) => {
        const compact = layout === "compact";
        const live27 = s.t === 1;
        const head = ["8", "15", "22", "29", "Jan 1", "8", "15", "22"];
        const play = s.t === 0 ? 46 : s.t === 1 ? 60 : 86;
        return (
          <>
            <Window url="admin.shopify.com/store/lego-wholesale/rollouts/2027-contract" urlShape="pill" className="sc-swap__win">
              <Admin active="rollouts" compact={compact} sidekick={false}>
                <Head icon={CalendarTimeIcon} back crumbs={compact ? ["2027 contract"] : ["Rollouts", "2027 contract pricing"]} badge={<St tone={live27 ? "ok" : "draft"}>{live27 ? "Running" : "Scheduled"}</St>} />
                <div className="sfy-body">
                  <div className="sfy-card sfy-tl">
                    <div className="sfy-tl__head">
                      {head.map((h, i) => (
                        <span key={i} data-on={h === "Jan 1" || undefined}>
                          {h}
                        </span>
                      ))}
                    </div>
                    <div className="sfy-tl__lane">
                      <span className="sfy-tl__bar" style={{ left: "56%", width: "30%" }}>
                        Event · Brickyard Toys
                      </span>
                    </div>
                    <span className="sfy-tl__now" style={{ left: `${play}%` }} />
                  </div>
                  <div className="sfy-card sfy-swaplist">
                    {[
                      { n: "Brickyard Toys · 2026 book", live: !live27, p: "$50.00" },
                      { n: "Brickyard Toys · 2027 book", live: live27, p: "$46.40" },
                    ].map((r) => (
                      <div key={r.n} className="sfy-swaprow" data-live={r.live || undefined}>
                        <span className="sfy-thumb">
                          <img src={SETS.galaxy.img} alt="" />
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div className="sfy-strong">{r.n}</div>
                          <div className="sfy-sub">
                            {SETS.galaxy.name} {SETS.galaxy.num}
                          </div>
                        </div>
                        {!compact && <span className="sfy-num">{r.p}</span>}
                        <St tone={r.live ? "ok" : "draft"}>
                          <Swap id={r.live ? "a" : "d"}>{r.live ? "Active" : "Draft"}</Swap>
                        </St>
                      </div>
                    ))}
                    <div className="sfy-note">Prices live on each catalog. The rollout only switches which one is active.</div>
                  </div>
                </div>
              </Admin>
            </Window>

            <div className="sc-flip">
              <span className="sc-flip__dot" data-on={live27 || undefined} />
              <span className="sc-flip__l">{s.t === 2 ? "Event ended" : live27 ? "Rollout started" : "Starts in"}</span>
              <span className="sc-flip__d">
                <Swap id={s.t}>{s.t === 0 ? "00:01" : s.t === 1 ? "00:00" : "Jan 15"}</Swap>
              </span>
            </div>

            <div className="sc-buyer">
              <div className="sc-buyer__top">
                <img src={LEGO_LOGO} alt="LEGO" />
                <span>Brickyard Toys · buyer view</span>
              </div>
              <div className="sc-buyer__p">
                <img src={SETS.galaxy.img} alt="" />
                <div>
                  <div className="sc-buyer__name">
                    {SETS.galaxy.name} <span>{SETS.galaxy.num}</span>
                  </div>
                  <div className="sc-buyer__price">
                    $<Count value={live27 ? 46 : 50} />
                    <span>.{live27 ? "40" : "00"}</span>
                  </div>
                  <div className="sc-buyer__rrp">RRP ${SETS.galaxy.retail}</div>
                </div>
              </div>
            </div>
          </>
        );
      }}
    </Stage>
  );
}

/* ======================================================================== */
/* WORKAROUND, a B2B market scoped to one company location (still)         */
/* ======================================================================== */

export function MarketScene() {
  return (
    <Stage width={760} height={460} compact={{ below: 600, width: 358, height: 480 }} initial={{}} className="sc sc-market">
      {(_s, _r, layout) => {
        const compact = layout === "compact";
        return (
          <>
            <Window url="admin.shopify.com/store/lego-wholesale/markets" urlShape="pill" className="sc-market__win">
              <Admin active="markets" compact={compact} sidekick={false}>
                <Head icon={GlobeIcon} back crumbs={compact ? ["Brickyard Toys"] : ["Markets", "Brickyard Toys"]} badge={<St>B2B</St>} />
                <div className="sfy-body">
                  <div className="sfy-card" style={{ padding: "14px 16px" }}>
                    <div className="sfy-strong" style={{ marginBottom: 6 }}>
                      Company locations
                    </div>
                    {[
                      ["All company locations", false],
                      ["Company locations in selected regions", false],
                      ["Specific company locations", true],
                    ].map(([t, on]) => (
                      <div key={t as string} className="sfy-radio" data-on={on || undefined}>
                        <span />
                        <div>
                          <div className={on ? "sfy-strong" : undefined}>{t as string}</div>
                          {on ? (
                            <>
                              <div className="sfy-sub">Includes only the company locations you specify</div>
                              <span className="sfy-tag">Brickyard Toys · Austin, TX</span>
                            </>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Admin>
            </Window>
            <div className="sc-market__sat">
              <div className="sfy-sub">Catalog</div>
              <div className="sc-market__row">
                <span className="sfy-thumb">
                  <img src={SETS.starry.img} alt="" />
                </span>
                <span className="sfy-strong">Brickyard Toys · 2027 book</span>
              </div>
              <div className="sc-market__ok">
                <I s={CalendarTimeIcon} size={16} /> Can be added to a rollout
              </div>
            </div>
          </>
        );
      }}
    </Stage>
  );
}

/* ======================================================================== */
/* CONCEPT, scheduling a direct catalog, with a resolved-price preflight   */
/* ======================================================================== */

export function PreflightScene() {
  const rows = [
    // the direct contract price is higher than the matching market price, and still wins on precedence
    { p: SETS.galaxy, direct: 52.0, market: 46.4 },
    { p: SETS.starry, direct: 104.0, market: 98.6 },
    { p: SETS.ferrari, direct: 279.0, market: 261.0 },
  ];
  const $ = (n: number) => `$${n.toFixed(2)}`;
  return (
    <Stage width={1000} height={540} compact={{ below: 720, width: 358, height: 640 }} initial={{}} className="sc sc-pre">
      {(_s, _r, layout) => {
        const compact = layout === "compact";
        return (
          <Window url="admin.shopify.com/store/lego-wholesale/rollouts/new" urlShape="pill" className="sc-pre__win">
            <Admin active="rollouts" compact={compact} sidekick={false}>
              <Head icon={CalendarTimeIcon} back crumbs={compact ? ["Preflight"] : ["Rollouts", "Holiday contract event"]} badge={<St tone="warn">Concept</St>} actions={compact ? undefined : <Pill primary>Review and schedule</Pill>} />
              <div className="sfy-body">
                <div className="sfy-card sfy-meta">
                  {[
                    ["Type", "Event"],
                    ["Starts", "Dec 1 · 12:00 AM"],
                    ["Ends", "Dec 15 · 11:59 PM"],
                    ["Audience", "100% of Brickyard Toys buyers"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="sfy-sub">{k}</div>
                      <div className="sfy-strong sfy-trunc">{v}</div>
                    </div>
                  ))}
                </div>
                <div className="sfy-warn">
                  <I s={AlertTriangleIcon} size={18} />
                  <div>
                    <div className="sfy-strong">The direct catalog decides these prices</div>
                    <div className="sfy-sub">A matching market catalog is cheaper, but direct assignment has higher precedence for overlapping products.</div>
                  </div>
                </div>
                <div className="sfy-card sfy-table">
                  <div className="sfy-tr sfy-th">
                    <span>Product</span>
                    {!compact && <span>Direct, after activation</span>}
                    {!compact && <span>Matching market</span>}
                    <span>Buyer pays</span>
                  </div>
                  {rows.map((r) => (
                    <div key={r.p.num} className="sfy-tr">
                      <span className="sfy-prod">
                        <span className="sfy-thumb">
                          <img src={r.p.img} alt="" />
                        </span>
                        <span className="sfy-strong sfy-trunc">{r.p.name}</span>
                      </span>
                      {!compact && <span className="sfy-num">{$(r.direct)}</span>}
                      {!compact && <span className="sfy-num sfy-strike">{$(r.market)}</span>}
                      <span className="sfy-num sfy-strong">{$(r.direct)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Admin>
          </Window>
        );
      }}
    </Stage>
  );
}
