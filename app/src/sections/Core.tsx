import { RiFlagLine, RiBuilding2Line, RiCalendarCheckLine, RiCalendarCloseLine, RiCheckLine, RiCloseLine, RiFlaskLine, RiGroupLine, RiStackLine, RiStore3Line } from "@remixicon/react";
import { PlanCompare, PriceResolver, TickMeter } from "@/charts/viz";
import { MarketScene, SwapScene } from "@/scenes/shopify";
import { Ext, HC, Note, Pull, Rv, SecHead, Shot } from "@/ui/fp";
import { cx } from "@/utils/cx";

const Y = () => <RiCheckLine size={16} color="var(--green)" />;
const N = () => <RiCloseLine size={16} color="#c4c4c4" />;

type Li = { t: React.ReactNode; on?: boolean; flag?: boolean; v?: string };
const PLANS: { name: string; note: string; hot?: boolean; li: Li[] }[] = [
  { name: "Basic", note: "B2B since April 2026", li: [{ t: "Companies and locations", on: true }, { t: "Catalogs with custom prices", on: true }, { t: "3 active market assignments", on: true, v: "3" }, { t: "Volume pricing, quantity rules", on: true }, { t: "Net payment terms", on: true }, { t: "Direct catalog assignment" }, { t: "Deposits, partial payments" }, { t: "Contextual checkout" }] },
  { name: "Grow", note: "B2B since April 2026", li: [{ t: "Companies and locations", on: true }, { t: "Catalogs with custom prices", on: true }, { t: "3 active market assignments", on: true }, { t: "Volume pricing, quantity rules", on: true }, { t: "Net payment terms", on: true }, { t: "Direct catalog assignment" }, { t: "Deposits, partial payments" }, { t: "Contextual checkout" }] },
  { name: "Advanced", note: "B2B since April 2026", li: [{ t: "Companies and locations", on: true }, { t: "Catalogs with custom prices", on: true }, { t: "3 active market assignments", on: true }, { t: "Volume pricing, quantity rules", on: true }, { t: "Net payment terms", on: true }, { t: "Direct catalog assignment" }, { t: "Deposits, partial payments" }, { t: "Contextual checkout", on: true }] },
  { name: "Plus", note: "Starts at $2,300 USD/mo", hot: true, li: [{ t: "Companies and locations", on: true }, { t: "Catalogs with custom prices", on: true }, { t: "Unlimited market assignments", on: true }, { t: "Volume pricing, quantity rules", on: true }, { t: "Net payment terms", on: true }, { t: "Direct catalog assignment", on: true }, { t: "Deposits, partial payments", on: true }, { t: "Contextual checkout", on: true }, { t: "Rollouts on a direct catalog", flag: true }] },
];

export function SectionToday() {
  return (
    <section className="sec" id="today">
      <div className="wrap">
        <SecHead
          tag="01 · What's true"
          title="Start with what's actually true, because most writing about this gets it wrong."
          sub="The current state of Shopify B2B, taken only from Shopify's own Help Center. I'm starting here because I got two of these facts wrong myself early on, and so did every third-party blog I read while researching."
        />
        <div className="grid g2" style={{ alignItems: "start" }}>
          <Rv className="prose">
            <p>
              On 2 April 2026, Shopify <Ext href="https://www.shopify.com/news/b2b-for-all">extended B2B to Basic, Grow and Advanced</Ext> at no extra cost. Company profiles, up to three custom catalogs with tailored pricing, volume discounts, quantity rules, vaulted cards and payment terms all moved down from Plus.
            </p>
            <p>Shopify was explicit about what stayed behind.</p>
            <p>
              <b>This is the first thing I had to get right.</b> At first I believed per-customer B2B pricing was Plus-only. That's false, a merchant on Basic can absolutely give different customers different prices. What's Plus-only is a narrower thing: attaching a catalog <em>directly</em> to one named company location, rather than routing it through a market.
            </p>
          </Rv>
          <Rv delay={80}>
            <HC
              label="Exhibit A"
              src="shopify.com/news/b2b-for-all"
              href="https://www.shopify.com/news/b2b-for-all"
              title="Shopify brings native B2B features to millions more merchants"
              meta="Shopify Newsroom · 2 April 2026"
              foot={
                <>
                  <b>Why this matters:</b> direct catalog assignment being Plus-only is deliberate, stated, and monetized. Any case study that attacks that boundary is arguing against a decision Shopify published on purpose. Mine doesn't.
                </>
              }
            >
              "For merchants with established B2B businesses and more complex needs, Plus continues to offer full access to all Shopify B2B features. <mark>Plus merchants still get unlimited catalogs for customer-specific pricing, direct catalog assignment to companies and locations, partial payments, and deposits.</mark>"
            </HC>
          </Rv>
        </div>

        <Rv style={{ marginTop: 56 }}>
          <div className="flex items-end justify-between gap-4 flex-wrap" style={{ marginBottom: 16 }}>
            <h3 className="h-inline" style={{ margin: 0 }}>The plans, and the row the plan comparison leaves out</h3>
            <span className="kicker">Prices: shopify.com/pricing · Features: Help Center · Nov 2026</span>
          </div>
          <PlanCompare />
          <p className="cap">
            Plan names, taglines and prices from <Ext href="https://www.shopify.com/pricing">shopify.com/pricing</Ext>. Catalog rows from <Ext href="https://help.shopify.com/en/manual/b2b/getting-started/plan-features">Shopify B2B features by plan</Ext>. <b>The Rollouts row appears on neither.</b> It comes from a third page, <Ext href="https://help.shopify.com/en/manual/b2b/markets/catalogs">B2B catalogs with Markets</Ext>, and that gap is part of the argument.
          </p>
        </Rv>

        <Rv className="prose" style={{ marginTop: 56 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>Two hard limits worth writing down</h3>
          <div className="grid g2" style={{ columnGap: 56 }}>
            <p>
              These are easy to get wrong, and I did get them wrong the first time. From <Ext href="https://help.shopify.com/en/manual/b2b/companies-and-customers/creating-companies">Shopify's companies documentation</Ext>: a company location can hold a maximum of <b>50 customers</b> and a maximum of <b>25 catalogs</b>.
            </p>
            <p>
              Two more scale constraints matter to the workaround: Shopify documents a maximum of <b>10,000 catalogs per store</b>, and its developer guide describes a <em>two-catalog pattern</em> that separates pricing from product publication to reduce catalog duplication. So catalog count, location count and price-list count must be measured independently; a 1:1 account-to-catalog assumption is not safe.
            </p>
          </div>
        </Rv>
        <div className="grid g2 eq-row" style={{ marginTop: 8, gap: 12 }}>
          <Rv><TickMeter kind="slots" label="Catalogs per company location" value="25" unit="max" count={25} hi={25} hiLabel="25 slots, direct and market combined" restLabel="" sub="The ceiling a one-location-market workaround has to live under." /></Rv>
          <Rv delay={50}><TickMeter kind="slots" label="Customers per company location" value="50" unit="max" count={50} hi={10} hiLabel="What an agency blog said: 10" restLabel="Shopify's real limit: 50" sub="I worked from the wrong number at first." /></Rv>
          <Rv><TickMeter kind="chunk" label="Catalogs per store" value="10,000" chunk="10,000" rest={"\u201CUnlimited\u201D on pricing"} share={0.42} sub="A ceiling the plan page doesn't show." /></Rv>
          <Rv delay={50}><TickMeter kind="chunk" label="Market assignments" value="3" unit="active" chunk="3" rest="∞ on Plus" share={0.22} sub="Basic, Grow, Advanced. No cap on Plus." /></Rv>
        </div>
        <Rv style={{ marginTop: 12 }}>
          <Note title="Correction log">
              <p>I worked from "10 customers per company location" at first. That number came from a third-party agency blog and it is wrong. I'm leaving the correction visible because the habit of checking a vendor blog against the vendor's own documentation is the only reason I found the actual problem.</p>
            </Note>
        </Rv>

        <Rv style={{ marginTop: 48 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>What Plus costs, and what it lists</h3>
          <div className="pts3">
          <div className="pt">
            <b className="pt-k">A published floor</b>
          <p>
            Shopify's <Ext href="https://www.shopify.com/pricing">pricing page</Ext> lists Plus at <b>"Starts at $2,300 USD/mo."</b> The same page notes that <em>"if you choose a 1- or 3-year Plus subscription, you can cancel when your term commitment expires"</em>, so term commitments exist, but <b>it does not publish a price for each term.</b> Higher-volume businesses move to a variable platform fee, so $2,300 is a published floor rather than a universal merchant cost.
          </p>
          </div>
          <div className="pt">
            <b className="pt-k">No price per term</b>
          <p>
            Partners and agencies widely report a higher monthly rate on the shorter term. <b>I'm not stating those figures as Shopify's, because Shopify doesn't print them</b>, and this document already carries a correction log about the last time I trusted an agency number. Nothing in the argument depends on the exact figure, only on Plus costing materially more than Advanced, which Shopify confirms by making it a separate tier.
          </p>
          </div>
          <div className="pt">
            <b className="pt-k">"Unlimited", with a ceiling</b>
          <p>
            The Plus pricing page markets <b>"Unlimited B2B catalogs"</b>, while the detailed help documentation sets a 10,000-total-catalog ceiling per store and a 25-catalog ceiling per company location. The mechanism distinction, direct company-location assignment versus market assignment, appears on the plan page, but the Rollouts restriction is documented separately.
          </p>
          </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}

const SCOPE = [
  { ic: RiCalendarCheckLine, t: "Launch", tag: ["In scope", "g"], d: "A market catalog can be scheduled to become Active or Draft for its eligible audience. A direct-assigned catalog cannot be included as the change target." },
  { ic: RiCalendarCloseLine, t: "Event", tag: ["In scope", "g"], d: "A market catalog can be scheduled for a time window and its activation status can revert. This does not restore an earlier price snapshot; catalog price edits save immediately." },
  { ic: RiGroupLine, t: "Audience allocation", tag: ["100% only", "a"], d: "Rollouts can apply to a percentage of eligible visitors, assigned at random. For a negotiated company-location price, the concept assumes 100% of eligible buyers at that location, a proposed requirement, not an existing direct-catalog Rollouts capability. Partial allocation is out of scope." },
  { ic: RiFlaskLine, t: "Experiment", tag: ["Out of scope", "r"], d: "Don't extend this to B2B negotiated pricing without validating the allocation unit and price consistency for all buyers at a company location." },
] as const;

export function SectionFinding() {
  return (
    <section className="sec" id="finding">
      <div className="wrap">
        <SecHead
          tag="02 · The finding"
          title="One sentence, buried in a help article."
          sub="Rollouts are how you schedule a change on Shopify, a theme, a checkout config, a discount, or a catalog going live on a date. They are, in Shopify's own framing, the mechanism for planned change."
        />

        <Rv>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ background: "#f0f0f0", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "center" }}>
              <SwapScene />
            </div>
            <div className="grid g2" style={{ gap: 0 }}>
              <div className="pad prose" style={{ padding: 32 }}>
                <span className="chip b">I got this wrong first</span>
                <h3 className="h-inline" style={{ marginTop: 14 }}>A rollout doesn't edit prices. It swaps which catalog is live.</h3>
                <p>
                  A rollout applies a treatment-level activation for a <em>prepared</em> catalog, Active or Draft for the buyers served by that treatment, without changing the catalog's native status. Price edits save immediately, whether or not a rollout is running. An Event rollback reverts the activation, not a previous snapshot of prices.
                </p>
                <p>
                  So a scheduled price change is really a <b>catalog swap</b>: duplicate the catalog, edit the copy, schedule a rollout that activates the copy and drafts the original. The old prices survive because the old catalog is still sitting there in draft.
                </p>
              </div>
              <div className="pad prose" style={{ padding: 32, borderLeft: "1px solid var(--line)" }}>
                <span className="chip">The fine print</span>
                <p style={{ marginTop: 14 }}>
                  A catalog can be part of only one unended rollout at a time. A market catalog can be added before it is assigned to a market, but affects no customers until one is. A direct-catalog target would need a different eligibility rule, based on company location. And the swap carries its own questions: how the revised catalog is prepared, what happens if only some activations succeed, and how conflicting assignments are prevented.
                </p>
              </div>
            </div>
          </div>
          <p className="cap">
            <b>Illustrative recreation of the Shopify admin, hypothetical merchant.</b> Not a live account screenshot. LEGO isn't a Shopify customer; its Galaxy Explorer set (<Ext href="https://jaysbrickblog.com/news/lego-announces-10497-galaxy-explorer-a-reimagination-of-a-classic-space-icon/">US launch price as announced by LEGO</Ext>: $99.99) is shown on a one-location B2B market for a fictional toy retailer, with invented contract prices. Watch the clock: the rollout flips Active and Draft, from the $50.00 book to the $46.40 book, and the price on each catalog never changes.
          </p>
        </Rv>

        <Rv style={{ marginTop: 56 }}>
          <div className="flex items-end justify-between gap-4 flex-wrap" style={{ marginBottom: 16 }}>
            <h3 className="h-inline" style={{ margin: 0 }}>Three pages, one native-platform constraint</h3>
            <span className="kicker">All three read 5 November 2026</span>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            <Shot
              src="/ref/rollout-sentence-narrow@2x.png"
              url="help.shopify.com/en/manual/b2b/markets/catalogs"
              href="https://help.shopify.com/en/manual/b2b/markets/catalogs"
              alt="Shopify Help Center: A catalog assigned to a B2B market can be added to a rollout to schedule its status changes. Direct company-location catalogs can't be added to a rollout."
              caption="Exhibit B, the finding. Highlight added; text unchanged."
            />
            <HC
              label="Exhibit C, corroboration"
              src="help.shopify.com/manual/b2b/catalogs"
              href="https://help.shopify.com/en/manual/b2b/catalogs"
              title="Catalogs and pricing in B2B"
              meta="Overview page"
              foot={
                <>
                  <b>Second page, same constraint.</b> Not a documentation slip or a stale article.
                </>
              }
            >
              "You can use a rollout to schedule a catalog's status change <mark className="g">only for a catalog that you create for a market</mark>. A catalog that's assigned directly to a company or a company location <mark>can't be added to a rollout</mark>."
            </HC>
            <HC
              label="Exhibit D, third confirmation"
              src="help.shopify.com/manual/b2b/catalogs/creating-catalogs"
              href="https://help.shopify.com/en/manual/b2b/catalogs/creating-catalogs"
              title="Customizing B2B pricing using catalogs"
              meta={'Section: "Create a catalog"'}
              foot={
                <>
                  <b>This page gives the native path: assign the catalog to a B2B market.</b> That doesn't make direct assignment inferior, it has higher precedence and suits tailored relationships. The merchant needs to see the trade-off before choosing.
                </>
              }
            >
              "<mark className="g">If you want to schedule the catalog's status changes with a rollout, then assign the catalog to a B2B market.</mark> Catalogs assigned directly to company locations can't be added to a rollout."
            </HC>
          </div>
          <p className="cap">
            I found no Shopify Rollouts path for directly assigned catalogs. That doesn't rule out ERP or app-based orchestration through APIs, separate workflows with their own scheduling, reliability and recovery responsibilities. CSV import is a bulk-edit path, not scheduled activation. <b>On screenshots:</b> I've reproduced exact wording rather than pasting images, because Shopify revises help articles and a quote with a live link stays checkable.
          </p>
        </Rv>

        <div className="grid g2" style={{ marginTop: 48, alignItems: "start" }}>
          <Rv className="prose">
            <Pull>The two routes have different precedence and scheduling properties. The question is whether merchants need both properties in the same workflow.</Pull>
            <h3 className="h-inline">What the direct-assignment route cannot do today</h3>
            <p>
              A catalog assigned directly to a company location cannot itself be added to a Rollout. That is a real product asymmetry, but it is <b>not</b> a blanket loss of scheduled per-customer pricing: a merchant can create a B2B market scoped to a specific company location and schedule a market catalog through Rollouts.
            </p>
            <p>
              The caveat is precedence. Shopify's developer documentation ranks a directly assigned company-location catalog above a specific-company-location market catalog. If both apply to the same buyer and product, the direct catalog remains the higher-priority source. A scheduled market catalog cannot be assumed to change the visible price for products still covered by a direct assignment.
            </p>
          </Rv>
          <Rv delay={80}>
            <Note title="Before you ask: is this big enough to matter?" tone="warn">
              <p>It's the first question I'd ask too, and I want to answer it before arguing anything else rather than burying it on page six.</p>
              <p>
                <b>Honestly: I don't know yet, and neither does anyone outside Shopify.</b> The size depends on how many Plus merchants use direct catalogs and how often they reprice, two numbers that only exist inside Shopify's database. Section 07 is built entirely around getting them, and includes the condition under which I'd kill my own proposal.
              </p>
              <p>My planning estimate for initial discovery is about three weeks and two internal usage queries, an estimate to validate with the team, not a delivery commitment, and materially smaller than funding a build before establishing the cohort and workflow.</p>
            </Note>
          </Rv>
        </div>

        <div className="grid g4" style={{ marginTop: 24 }}>
          {SCOPE.map((s, i) => (
            <Rv key={s.t} delay={i * 50} className="card pad">
              <div className="flex items-center justify-between gap-2">
                <span className="ico">
                  <s.ic size={18} />
                </span>
                <span className={cx("chip", s.tag[1])}>{s.tag[0]}</span>
              </div>
              <div className="d3" style={{ marginTop: 16 }}>{s.t}</div>
              <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.6, color: "var(--mute)" }}>{s.d}</p>
            </Rv>
          ))}
        </div>
        <Rv style={{ marginTop: 32 }}>
          <div className="vs2">
            <div className="vs2-c">
              <span className="vs2-k">Not the unresolved question</span>
              <p>Whether Shopify can schedule location-specific prices. It can, through a location-specific market. Existing Rollouts derive their audience from the markets associated with the catalog change; a direct-catalog extension would need a company-location audience model.</p>
            </div>
            <div className="vs2-c" data-key="">
              <span className="vs2-k">The unresolved question</span>
              <p>Whether merchants who deliberately use direct assignment need its higher precedence for overlapping products <em>and</em> also need timed activation.</p>
            </div>
          </div>
          <p className="cap">The scale of that cohort and its workload are unknown; 240 locations do not imply 240 unique catalogs or 240 manual operations.</p>
        </Rv>
      </div>
    </section>
  );
}

export function SectionWorkaround() {
  return (
    <section className="sec" id="workaround">
      <div className="wrap">
        <SecHead
          tag="03 · What broke it"
          title="The finding that broke my own thesis."
          sub="I had the proposal written. Extend Rollouts to direct catalogs, here's the ship plan, here's what I'd promise. Then I went back through the Markets documentation to check something unrelated, and found the paragraph that invalidated it."
        />
        <Rv className="callout" style={{ marginBottom: 20 }}>
          <span className="callout-ic">
            <RiFlagLine size={16} />
          </span>
          <p>I'm putting it here, at the front, rather than in a footnote, because how a PM handles the evidence that kills their own idea is more informative than the idea was.</p>
        </Rv>
        <div className="grid g2" style={{ alignItems: "stretch" }}>
          <Rv>
            <HC
              label="Exhibit E, what I missed"
              tone="b"
              src="help.shopify.com/manual/markets/getting-started/market-types"
              href="https://help.shopify.com/en/manual/markets/getting-started/market-types"
              title="Understanding market types"
              meta={'Section: "B2B markets"'}
              className="h-full"
              foot={
                <>
                  <b>Shopify documents a market containing exactly one company location.</b> A catalog assigned to it can be scheduled through Rollouts. On Plus the three-assignment cap doesn't apply, though the 25-per-location and 10,000-per-store limits still matter. This provides scheduled location-specific pricing, subject to the precedence hierarchy.
                </>
              }
            >
              <p style={{ margin: "0 0 10px" }}>
                "You can include company locations in B2B markets in three different ways: … <mark>Specific company locations: Includes only the company locations you specify</mark>, regardless of where they're shipping to."
              </p>
              <p style={{ margin: 0 }}>
                "For example, your store contains the following markets: <mark>Company Location A, a market specifically for a single company location.</mark>"
              </p>
            </HC>
          </Rv>
          <Rv delay={80} className="card" style={{ overflow: "hidden", background: "#f0f0f0", minHeight: 380 }}>
            <MarketScene />
          </Rv>
        </div>
        <p className="cap">
          <b>The single most important page in the document,</b> found late. My proposal assumed direct assignment was the only route to per-customer pricing. It isn't, and Shopify says so in the same Help Center I'd been quoting all week. Right: an illustrative recreation of a B2B market scoped to one fictional toy retailer (LEGO used as a hypothetical merchant), not a live account screenshot.
        </p>

        <Rv style={{ marginTop: 56 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>What this kills, and what survives</h3>
          <div className="tw" tabIndex={0} role="region" aria-label="What this kills, and what survives (table)">
            <table className="t">
              <thead>
                <tr>
                  <th>Claim I made</th>
                  <th>Verdict</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Plus merchants cannot schedule a direct-assigned catalog", "True, with an alternative", "g", "A market catalog scoped to one company location can be scheduled, but it has lower precedence than a direct assignment for overlapping products."],
                  ["Rollouts are a scheduled price-edit and rollback engine", "False", "r", "A rollout applies a treatment-level Active/Draft activation without changing the catalog's native status. Price edits save immediately; a rollback reverts activation, not old prices."],
                  ["240 accounts means 240 manual operations", "Unsupported", "r", "One catalog can serve many locations. I never established the real catalog count."],
                  ["Direct company-location catalogs can't be added to a rollout", "Verified", "g", "On three separate Shopify pages. Unchanged."],
                  ["The plan comparison page explains the scheduling trade-off", "False", "r", "The plan matrix lists direct assignment as a Plus feature but doesn't pair it with the Rollouts limitation, which is documented separately."],
                  ["Shopify's documentation gives no choice guidance", "False", "r", "Correction: the B2B catalogs guide says markets suit broader strategies and direct catalogs suit tailored relationships. The open question is whether scheduling and precedence are easy to connect across the plan, catalog and Rollouts pages."],
                ].map(([c, v, tone, w]) => (
                  <tr key={c}>
                    <td><strong>{c}</strong></td>
                    <td style={{ whiteSpace: "nowrap" }}><span className={cx("chip", tone)}>{v}</span></td>
                    <td>{w}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Rv>

        <Rv style={{ marginTop: 48 }} id="precedence">
          <h3 className="h-inline" style={{ marginTop: 0 }}>The better question underneath</h3>
          <div className="pts3">
            <div className="pt">
              <b className="pt-k">Not obsolete either</b>
              <p>Losing the thesis exposed something sharper than the thesis was. My next instinct was that markets now dominate direct assignment on every axis, which would make direct assignment obsolete. That's wrong too, and the reason it's wrong is the interesting part.</p>
            </div>
            <div className="pt">
              <b className="pt-k">The published hierarchy</b>
              <p>
              Shopify's developer documentation spells out the full precedence hierarchy (<Ext href="https://shopify.dev/docs/apps/build/markets/catalogs">Pricing prioritization</Ext>). Only catalogs at the highest applicable level are considered; if several tie there, the lower price is used. The resolver below uses exactly that rule.
            </p>
            </div>
            <div className="pt">
              <b className="pt-k">Catalogs combine, prices override</b>
              <p>
              <b>One distinction I nearly got wrong.</b> A direct catalog doesn't replace a market catalog wholesale. Shopify: <em>"If the catalogs include different products, then all products from each catalog are displayed."</em> The catalogs <em>combine</em>, and precedence decides the price only where the same product appears in both, <b>a higher-priority pricing override for overlapping products, not a replacement for the entire market catalog.</b>
            </p>
            </div>
          </div>
        </Rv>
        <div className="grid g2 eq-row" style={{ marginTop: 32 }}>
          <Rv className="col-stack">
            <Shot
              src="/ref/precedence-rule@2x.png"
              url="help.shopify.com/en/manual/b2b/markets/catalogs"
              href="https://help.shopify.com/en/manual/b2b/markets/catalogs"
              alt="Shopify Help Center: A catalog assigned directly to the customer's company location takes precedence over market catalogs. If the applicable catalogs are equally specific, then the lower price applies."
              caption="Exhibit F, direct wins. Highlight added; text unchanged."
            />
            <div className="try">
              <span className="try-k">Try the resolver</span>
              <ul>
                <li>
                  <b>Keep the direct catalog on</b> and switch to Jan 1. The rollout lowers the market price to $46.40, and the buyer still pays the direct $52.00.
                </li>
                <li>
                  <b>Precedence, not the lowest price, decides.</b> The cheaper market catalog loses because direct assignment sits on a higher level.
                </li>
                <li>
                  <b>Switch the direct catalog off.</b> Now the scheduled market catalog decides the price.
                </li>
                <li>
                  <b>The rule it applies:</b> only the highest applicable level counts; ties take the lower price.
                </li>
              </ul>
              <div className="try-note">
                <img src="/ref/lego-10497.png" alt="" />
                <p>LEGO set and retail price are real; LEGO isn't a Shopify merchant, and the retailer and contract prices are illustrative.</p>
              </div>
            </div>
          </Rv>
          <Rv delay={80}>
            <PriceResolver />
          </Rv>
        </div>

        <Rv style={{ marginTop: 72 }}>
          <h3 className="tbl-h">Direct assignment isn't a redundant version of markets. It's a higher-priority pricing override.</h3>
          <div className="tw" tabIndex={0} role="region" aria-label="Which price the buyer sees (table)">
            <table className="t">
              <thead>
                <tr>
                  <th>Scenario, Shopify's own candle examples</th>
                  <th>Which price the buyer sees</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Two catalogs assigned directly to the same location</strong></td>
                  <td>The lowest price wins</td>
                  <td>$9 and $7 → buyer sees <strong>$7</strong></td>
                </tr>
                <tr>
                  <td><strong>A direct catalog and a matching market catalog</strong></td>
                  <td>The direct catalog wins, as the more specific price</td>
                  <td>$9 direct, $7 via market → buyer sees <strong>$9</strong></td>
                </tr>
                <tr>
                  <td><strong>Two market catalogs, both matching</strong></td>
                  <td>The more specific market wins; if equally specific, the lower price</td>
                  <td>"All locations shipping to the US" beats "all locations in all countries"</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="cap">Shopify documents both candle examples under separate headings. The model is coherent: direct outranks a matching market for overlapping products; ties at the same level take the lower price.</p>
        </Rv>

        <div className="grid g2" style={{ marginTop: 40 }}>
          <Rv className="card pad" style={{ background: "var(--blue-soft)", borderColor: "#cfe3ff" }}>
            <span className="chip b">The context-based route</span>
            <div className="d3" style={{ marginTop: 12 }}>Market assignment</div>
            <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.6, color: "var(--ink-2)" }}>It can cover groups of company locations or a specific location, and its catalogs can be scheduled through Rollouts.</p>
          </Rv>
          <Rv delay={60} className="card pad card-dark" style={{ background: "#0d0d0d", borderColor: "#0d0d0d", color: "#fff" }}>
            <span className="chip" style={{ background: "#262626", color: "#d4d4d4", borderColor: "#333" }}>The exception</span>
            <div className="d3" style={{ marginTop: 12, color: "#fff" }}>Direct assignment</div>
            <p style={{ margin: "6px 0 0", fontSize: 15, lineHeight: 1.6, color: "#bdbdbd" }}>The individually negotiated deal that overrides the book on the products it covers, at a documented higher priority.</p>
          </Rv>
        </div>

        <Rv className="pull-row" style={{ marginTop: 24 }}>
          <Pull>So Shopify can schedule market catalogs, including catalogs scoped to one company location. It cannot schedule the direct-assignment override itself. The product question is whether merchants need both properties at once.</Pull>
          <div className="prose">
            <p>
            This is the narrower finding I can defend after correcting the precedence model. Whether an individually negotiated contract needs the direct override <em>and</em> a specific go-live time is the unresolved customer question.
          </p>
          </div>
        </Rv>
        <Rv style={{ marginTop: 40 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>And the workaround isn't actually equivalent</h3>
          <div className="pts3">
            <div className="pt">
              <b className="pt-k">A real alternative, not an equivalent</b>
              <p>
            A market scoped to one company location can be scheduled and is more specific than broader company-location and region markets. It is a real alternative when a merchant needs location-specific pricing without a direct override. It is <b>not equivalent</b> where the merchant relies on a directly assigned catalog taking precedence over that market.
          </p>
            </div>
            <div className="pt">
              <b className="pt-k">Documented, not ambiguous</b>
              <p>
            The hierarchy is documented, not ambiguous. I had missed the developer documentation that states it explicitly. Investigation 2 should now test the implementation against that published hierarchy and inspect the resulting buyer experience, not pretend the ordering is unknown.
          </p>
            </div>
            <div className="pt">
              <b className="pt-k">What to validate</b>
              <p>
            The question to validate is practical: which real merchant setups depend on direct assignment winning over a market catalog for overlapping products, and how often do they need a timed change? If no meaningful cohort needs both, there may be no engineering opportunity. If they do, a market workaround is not sufficient for those products while the direct catalog remains assigned.
          </p>
            </div>
          </div>
        </Rv>
        <div className="grid g2" style={{ marginTop: 48, alignItems: "start" }}>
          <Rv>
            <Note title="A number I am deliberately not using" tone="warn">
            <p>Several third-party sources, agencies and migration guides, state that a Shopify store supports a maximum of <b>50 markets</b>. If true, that would cap the workaround neatly, and it would have been very convenient for my argument.</p>
            <p><b>I could not confirm it on any Shopify page, and there is evidence against it.</b> Shopify's developer documentation discusses a limit on <em>wildcard</em> markets, a different thing, and a 2025 developer forum response indicates the older 50-market figure no longer applies.</p>
            <p>So: <b>the official documentation I reviewed does not establish a global limit on individually specified company-location markets.</b> This is the second agency number that would have helped me if I'd believed it. I believed the first one and was wrong.</p>
          </Note>
          </Rv>
          <Rv delay={80} className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>Why I didn't delete the case study</h3>
            <p>I considered deleting the build proposal. What remains is a smaller discovery case and a possible information-design improvement.</p>
            <p>
            This isn't missing documentation. Shopify explains when each route fits; what's unvalidated is whether merchants connect the Rollouts limitation with the Plus-only capability before choosing, which section 05 takes up.
          </p>
            <p>
            The mechanisms have different semantics, and that distinction may be deliberate, I can't infer Shopify's rationale from public docs. The next step is to test whether merchants understand the trade-off and whether it affects a real workflow. A concise decision guide on the plan and setup surfaces may be justified even if no engineering is.
          </p>
            <p>So the rest of this document is no longer a proposal. It's the case for spending about three weeks finding out, and the four outcomes that could follow, one of which is doing nothing.</p>
          </Rv>
        </div>
      </div>
    </section>
  );
}
