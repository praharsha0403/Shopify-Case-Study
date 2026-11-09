import type { ReactNode } from "react";
import { RiCheckLine, RiCloseLine, RiFlaskLine, RiGlobalLine, RiPlayFill } from "@remixicon/react";
import { Meter } from "@/components/base/meter/meter";
import { ArcGauge, ProvenanceMatrix, ReviewWaffle, RolloutsJoined } from "@/charts/viz";
import { Ext, HC, Note, Pull, Rv, SecHead, VideoThumb } from "@/ui/fp";
import { cx } from "@/utils/cx";

function Post({ who, ini, color, meta, href, thread, tag, tagTone, children, why }: { who: string; ini: string; color: string; meta: string; href?: string; thread?: string; tag?: string; tagTone?: string; children: ReactNode; why: ReactNode }) {
  return (
    <div className="card post">
      <div className="post-h">
        <img className="av av-img" src={`/ref/avatars/${who.toLowerCase()}.svg`} alt="" />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14.5 }}>{who}</div>
          <div className="kicker">{meta}</div>
        </div>
        {tag ? <span className={cx("chip", tagTone)}>{tag}</span> : null}
      </div>
      {thread ? (
        href ? (
          <a className="lnk" href={href} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--mute)" }}>
            <RiGlobalLine size={14} className="post-ic" />
            {thread}
          </a>
        ) : (
          <span style={{ fontSize: 13, color: "var(--faint)" }}><RiGlobalLine size={14} className="post-ic" />{thread}</span>
        )
      ) : null}
      <blockquote>{children}</blockquote>
      <div className="why">{why}</div>
    </div>
  );
}

export function SectionWho() {
  return (
    <section className="sec" id="who">
      <div className="wrap">
        <SecHead
          tag="04 · Who this hurts"
          title="Six public signals. Not six merchants."
          sub="I have not interviewed a Shopify merchant, and I'm not going to invent personas and call them research. So I went looking for people who had already written about this in public, where anyone can check them."
        />
        <Rv className="lead-p">
          <p>Before the quotes, I want to be precise about what this evidence is, because my instinct was to present it as stronger than it is, and that instinct is worth naming.</p>
        </Rv>
        <div className="grid g-ev eq-row">
          <Rv className="prose">
            <Note title="What this evidence is, and is not" tone="warn">
              <p>
                It would be easy to call these "six merchants" and say six independent voices demonstrate the same failure. <b>That overstates it.</b> Two are replies in a single thread, one is a developer validating an app concept, and one is a poster reporting research into D2C bulk-price app reviews, not B2B catalogs. The Plus merchant's post doesn't say whether the four catalogs were directly or market-assigned, nor whether scheduling was the problem.
              </p>
              <p>
                More importantly: <b>not one of them establishes that direct catalog assignment caused their problem.</b> They describe pain in the neighborhood of my thesis. That's a reason to go and ask the right people, not a substitute for having asked them. I'm keeping the quotes because they're real and checkable; I'm removing the claim that they validate my proposal.
              </p>
            </Note>
          </Rv>
          <Rv delay={80}>
            <ProvenanceMatrix />
            <p className="cap">Each step follows the case study's own reading of the posts. By the last step nothing is left: nobody names direct assignment or asks for scheduling, which is why investigation 4 exists. Hover a step.</p>
          </Rv>
        </div>

        <Rv style={{ marginTop: 48 }}>
          <div className="facepile">
            <div className="facepile-av" aria-hidden>
              {["evp", "lu_judy", "bryce_david", "ian_chechin", "zhouhua1998071", "undob2b"].map((n) => (
                <img key={n} src={`/ref/avatars/${n}.svg`} alt="" />
              ))}
            </div>
            <div>
              <b>Six public voices, every one linked</b>
              <span>3 posts · 2 replies · 1 developer validating an app</span>
            </div>
          </div>
          <div className="masonry">
            <Post who="EVP" ini="EV" color="#0073ff" meta="Shopify Plus merchant · 17 Dec 2024" href="https://community.shopify.com/t/managing-b2b-catalog-pricing-any-tools-out-there/258045" thread="Managing B2B Catalog Pricing, any tools out there?" tag="Zero replies" tagTone="r"
              why={<><b>What it supports:</b> a Plus merchant with four B2B catalogs reported management overhead and asked about bulk price updates. The post doesn't say whether the catalogs were direct or market-assigned, how many locations they served, or whether scheduling was the need. The absence of replies is a forum observation, not evidence Shopify lacks a feature. A lead for an interview, not proof of the direct-catalog cohort.</>}>
              <p>"We currently have 4 catalogs and have plans to add more but are a bit concerned about the time it's going to manage all of them. Are there no tools out there for bulk uploading pricing for multiple catalogs?"</p>
              <p>"We should really be able to update a products catalog pricing on the actual product page."</p>
            </Post>
            <Post who="lu_judy" ini="LJ" color="#0d0d0d" meta="Shopify Community · 679 views · 24 Jul 2026" href="https://community.shopify.com/t/b2b-catalog-price-change-webhook-flow-trigger/722894" thread="B2B Catalog Price Change webhook / Flow trigger"
              why={<>Shopify's thread summary notes the request would <em>"reduce reliance on scheduled polling or manual checks,"</em> with no timeline given. <b>What it supports:</b> an automation need. A webhook is not scheduled activation, and doesn't establish demand for Rollouts on direct catalogs.</>}>
              <p>"Please add a Flow trigger or webhook for B2B Catalog Price changes, similar to the existing Product Variant Price Changed trigger."</p>
            </Post>
            <Post who="Bryce_David" ini="BD" color="#0d0d0d" meta="Shopify Community · 1 Aug 2026" href="https://community.shopify.com/t/i-read-109-negative-reviews-of-bulk-price-and-store-credit-apps/730617" thread="I read 109 negative reviews of bulk price apps" tag="D2C, not B2B" tagTone=""
              why={<><b>What it signals:</b> rollback and execution visibility are the recurring failure in third-party bulk-price tools. Adjacent evidence about bulk-edit risk, not about Shopify B2B catalog assignment, and not something I'd use to validate the proposal.</>}>
              <p>"Spent an afternoon reading every 1 to 3 star review I could find across 17 apps … 109 reviews total, 97 of them 1 or 2 stars."</p>
              <p>"Bulk price editors: <b>the failure is almost never the price change itself. It's the undo.</b>"</p>
              <p>"One merchant said a revert only restored about a quarter of their store and they had to fix the rest by hand."</p>
              <p>"About 12 reviews describe partial variant updates specifically, the job reports success but only some variants actually moved. One merchant found out <b>because a customer bought something at the wrong price</b> before anyone noticed internally."</p>
            </Post>
            <Post who="Ian_Chechin" ini="IC" color="#0d0d0d" meta="Reply in the same thread · 1 Sep 2026" tag="Reply"
              why={<><b>Why it matters:</b> a third-party undo is another write loop against the same rate limits, while a platform-side rollout flips which catalog is serving instead of replaying writes. It argues for a platform capability in general, not for this specific one.</>}>
              <p>"If the app applied 4,000 of 5,000 changes and timed out, its undo replays the same pipeline against the same API limits, so it times out the same way, except now the catalog is in <b>a third state neither you nor the app has a name for</b>."</p>
            </Post>
            <Post who="zhouhua1998071" ini="ZH" color="#0d0d0d" meta="Same thread · 4 Sep 2026" tag="Reply"
              why={<><b>What it supports:</b> a bulk-edit job that looked successful despite incomplete execution, found late. An adjacent reliability signal, not corroboration of a B2B direct-assignment problem.</>}>
              <p>"Without a per-variant record of intended / updated / skipped / failed, <b>a job that ends early looks identical to a job that finished.</b> The merchant only finds out when a customer points at a price."</p>
            </Post>
            <Post who="UndoB2B" ini="UB" color="#0d0d0d" meta="Developer validating an app · 12 Sep 2026" thread="Planned price: $39/month, refundable deposit to join the beta" tag="Nobody has bought it" tagTone="r"
              why={<><b>Stated precisely:</b> a developer scoped an app, named it after the missing verb, <em>undo</em>, and is validating demand at a planned price. It's a bet about where someone thinks the pain is, not evidence of paying customers.</>}>
              <p>"The problem I'm looking at is <b>B2B pricing mistakes.</b> If prices are changed by mistake during a bulk edit or import, I'd like to make it easy to see what changed and restore the previous pricing state."</p>
              <p>"If someone accidentally overwrote a large batch of B2B prices today, how would you recover?"</p>
            </Post>
          </div>
        </Rv>

        <Rv style={{ marginTop: 36 }}>
          <ReviewWaffle />
        </Rv>
        <div className="vc">
          {[
            ["EVP", "Concern about the time to manage four B2B catalogs; asked about bulk-upload tools", "That direct assignment was the cause, or that scheduling was what he wanted"],
            ["lu_judy", "Demand for price-change webhooks on B2B catalogs", "Demand for scheduled activation"],
            ["Bryce_David", "Rollback, not the edit, is the dominant failure in bulk tooling", "That direct B2B catalogs have this problem, his sample is D2C apps"],
            ["Ian_Chechin", "Why third-party undo struggles: it replays writes against the same limits", "Independent merchant demand, a technical reply"],
            ["zhouhua1998071", "Missing per-variant execution visibility", "Demand for this specific solution; also a reply"],
            ["UndoB2B", "A developer believes B2B price recovery is worth charging for", "Paying merchant demand, it is a bet"],
          ].map(([a, b, c], i) => (
            <Rv key={a} className="vc-card" delay={i * 40}>
              <div className="vc-h">
                <img className="vc-av av-img" src={`/ref/avatars/${a.toLowerCase()}.svg`} alt="" />
                <b>{a}</b>
              </div>
              <p className="vc-yes">
                <RiCheckLine size={15} />
                <span>
                  <small>Demonstrates</small>
                  {b}
                </span>
              </p>
              <p className="vc-no">
                <RiCloseLine size={15} />
                <span>
                  <small>Does not demonstrate</small>
                  {c}
                </span>
              </p>
            </Rv>
          ))}
        </div>
        <p className="cap">Writing this table changed how I read my own evidence. Collectively these point at a real neighborhood of pain, bulk price changes are risky and hard to reverse, but none is about the thing I claimed.</p>

        <div className="grid g2" style={{ marginTop: 48, alignItems: "start" }}>
          <Rv className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>Adjacent third-party tooling, not proof of this gap</h3>
            <p>I found apps for bulk price editing, backups, snapshots and recovery. They show that merchants and developers build tools around bulk-price operations. They do <b>not</b> establish that these tools support Shopify's native B2B catalog objects, that their users are Plus merchants, or that direct company-location catalogs are the unmet need.</p>
            <p>UndoB2B's public material described a validation-stage product at a proposed $39/month; not evidence of paying customers. I wouldn't add any tool's price or feature claims to a business case without checking each listing and its exact B2B compatibility.</p>
            <p>One public request asks for scheduling and reverting bulk product-price edits, a useful D2C workflow signal, but not a definition of native B2B catalog Rollouts, which apply treatment-level activation, not changes to stored prices.</p>
          </Rv>
          <Rv delay={80} className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>What I couldn't find</h3>
            <p><b>Nobody wrote "I wish I could put a rollout on a company-location catalog."</b> Not one person. I searched the forums, the feature-request board, YouTube comments, Reddit, X and LinkedIn. The sentence does not exist.</p>
            <p><b>Reading one, it isn't a real problem.</b> If it mattered, someone would have asked. That's the reading I'd expect a skeptical reviewer to take, and I can't disprove it from public data.</p>
            <p><b>What the evidence supports:</b> several adjacent signals, catalog-management workload, requests for price-change events, complaints about bulk-edit recovery, interest in snapshots. Enough to justify targeted interviews; not enough to justify a build. EVP's thread is the clearest case, and even there I can't infer whether he wants a native feature, an app or a better workflow.</p>
          </Rv>
        </div>
        <Rv className="read prose">
          <Pull>This is why investigation 4 is interviews, not ticket analysis. "What did you do last January" surfaces this. Reading support tickets never will, because nobody files a ticket about a workaround that works.</Pull>
        </Rv>

        <Rv className="card vid-card" style={{ marginTop: 24 }}>
          <div className="grid g2 vid">
            <div className="vid-l">
              <VideoThumb id="YDZ2qvRnj3M" title="How To Bulk Update Wholesale Prices On Shopify, ONHOW Studio" thumb="https://i.ytimg.com/vi/YDZ2qvRnj3M/hqdefault.jpg" />
            </div>
            <div className="pad prose" style={{ padding: 28 }}>
              <span className="chip">The one walkthrough I found · 284 views</span>
              <div className="d3" style={{ marginTop: 12 }}>How To Bulk Update Wholesale Prices On Shopify</div>
              <div className="kicker" style={{ marginBottom: 14 }}>ONHOW Studio · 12 Apr 2026 · 3:03</div>
              <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                {[
                  ["0:03", "“Managing a massive wholesale catalog can be exhausting when rates change.”"],
                  ["M1", "A blanket percentage adjustment, fine if every price moves the same, useless for renegotiated accounts."],
                  ["M2", "Export to CSV, edit in a spreadsheet, re-import. The real workflow for anything specific."],
                  ["2:21", "“If you use Gemini, make sure to double-check, otherwise you might make mistakes and you lose money.”"],
                ].map(([k, t]) => (
                  <div key={k} className="flex gap-3" style={{ fontSize: 14, lineHeight: 1.55, color: "var(--ink-2)" }}>
                    <span className={cx("chip", k.includes(":") && "b")} style={{ flex: "none", marginTop: 1 }}>{k.includes(":") ? k : k === "M1" ? "Method 1" : "Method 2"}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="vid-foot">
                <b>What it shows:</b> percentage adjustments and CSV export/edit/re-import. It doesn't demonstrate scheduled activation, a staged swap or recovery, but a short tutorial isn't a product audit; its silence isn't evidence merchants need those things. One demonstrated workflow, not proof it's the only one. Quotes from the video's captions, 5 Nov 2026; low view count stated deliberately.
          </p>
        </Rv>

        <SecHead tag="Shopify's own merchants" title="Two merchants Shopify chose to publish." sub="Forum posts are evidence of friction. Shopify's own published quotes are evidence that Shopify already agrees the friction is real, context on B2B operations, not validation of this scheduling gap." />
        <div className="grid g2" style={{ alignItems: "stretch" }}>
          <Rv>
            <HC label="Exhibit G · DAX Eyewear" src="shopify.com/news/b2b-for-all" href="https://www.shopify.com/news/b2b-for-all" title="When pricing is maintained by hand, buyers stop trusting it" meta="Justin Dyson, co-runs DAX Eyewear with Channing Dyson · April 2026" className="h-full"
              foot={<><b>Context only.</b> DAX described a pre-native-B2B problem. It shows why correct B2B pricing matters; it's not evidence about direct-catalog scheduling.</>}>
              "While depending on workarounds to manage wholesale, DAX found that buyers would sometimes see retail prices instead of their negotiated rates. <mark>So some never placed an order at all.</mark>", "If you can't trust the data, you can't make good decisions."
            </HC>
          </Rv>
          <Rv delay={80} className="card hc">
            <div className="hc-top">
              <span className="chip">Exhibit H · Snyder Performance Engineering</span>
              <a className="src" href="https://www.shopify.com/case-studies/snyder-performance-engineering" target="_blank" rel="noreferrer">Source ↗</a>
            </div>
            <div>
              <div className="hc-t">Back-office time is the constraint on how many accounts you can carry</div>
              <div className="kicker">Amy Snyder · quoted by Shopify, April 2026</div>
            </div>
            <blockquote>Before Shopify, "every one of Snyder's B2B orders required a phone call or email instead of customers self-serving. <mark>This limited how many accounts they could process.</mark>"</blockquote>
            <div className="grid g2" style={{ gap: 10, marginTop: 4 }}>
              <ArcGauge value={25} label="Back-office time" sub="less time" context="After moving to native B2B" />
              <ArcGauge value={40} label="Average customer spend" sub="higher" context="As published by Shopify" />
            </div>
            <div className="hc-foot"><b>What this contributes:</b> operational improvements can matter to B2B merchants. It doesn't establish that the Rollouts asymmetry creates the same cost, nor that direct-catalog users are the highest-account cohort.</div>
          </Rv>
        </div>
        <p className="cap"><b>Why I'd rather borrow real merchants than invent my own.</b> An interviewer can check every one of these. They can't check a persona I made up. Where I extrapolate beyond what they said, I've marked it.</p>

        <div className="grid g2" style={{ marginTop: 48, alignItems: "start" }}>
          <Rv className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>Potential buyer impact, a hypothesis</h3>
            <p>A pricing workflow that changes at the wrong time could expose a buyer to an outdated or unintended price, but I have no direct observation that this happens to merchants using direct company-location catalogs.</p>
            <p>One technical caveat: scheduling a market catalog does not override an applicable direct-assigned catalog. If the direct catalog remains active for an overlapping product, the buyer may keep seeing the direct price. Any workflow must preview the buyer's <em>resolved</em> price, not just the status of the catalog being scheduled.</p>
            <p>DAX's buyers seeing retail instead of negotiated prices is context for why accuracy matters, <b>not evidence</b> the Rollouts limitation causes the same outcome. Validate through storefront tests, order examples and interviews.</p>
          </Rv>
          <Rv delay={80} className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>The two merchant shapes most exposed</h3>
            <p>Not research personas. <b>Both could use either mechanism</b>, so the question isn't precision versus timing. It's which route is practical. Four questions to brief a researcher on:</p>
            <ol>
              <li>Does maintaining many single-location markets create real overhead, or does it just sound like it would?</li>
              <li>Does direct assignment make a negotiated relationship easier to express and maintain?</li>
              <li>Does its higher precedence matter in practice, when a location also matches broader markets?</li>
              <li>Do catalog limits, product availability and market configuration favor one route at scale? <em>(Each location caps at 25 catalogs, direct and market combined.)</em></li>
            </ol>
          </Rv>
        </div>
        <div className="grid g2" style={{ marginTop: 20 }}>
          {[
            { tag: "Hypothesis 1", who: "The account-managed distributor", t: "Many accounts, individually negotiated, repriced on a calendar", b: "An illustrative Plus merchant with many wholesale company locations and individually negotiated price lists; cohort size and catalog distribution unknown. Prices move on contract anniversaries and at the start of the financial year.", f: <>If they chose direct assignment for its precedence, the scheduling gap is a real cost. If it was just the obvious way to make a customer price list, the fix is guidance, not engineering. <b>It would be easy to write that direct assignment is "the only mechanism that fits". It isn't</b>, investigation 4 decides which.</> },
            { tag: "Hypothesis 2", who: "The seasonal wholesaler", t: "Time-boxed pricing is the whole business model", b: "Trade-show pricing, pre-season books and end-of-line clearances are plausible time-boxed workflows. Both routes express location-specific prices; only the market route supports Rollouts.", f: <><b>What to test:</b> whether merchants need the direct override during seasonal events. Don't infer a manual promotion workflow just because a catalog was activated and deactivated within 60 days, inspect the change history and merchant intent first.</> },
          ].map((h, i) => (
            <Rv key={h.tag} delay={i * 60} className="card pad">
              <div className="flex items-center gap-2"><span className="chip b">{h.tag}</span><span className="kicker">{h.who}</span></div>
              <div className="d3" style={{ marginTop: 12 }}>{h.t}</div>
              <p style={{ margin: "8px 0 14px", fontSize: 14.5, lineHeight: 1.6, color: "var(--mute)" }}>{h.b}</p>
              <div className="post" style={{ padding: 0, margin: 0 }}><div className="why">{h.f}</div></div>
            </Rv>
          ))}
        </div>
        <Rv className="read prose"><Pull>I should not assume the market route is cumbersome. I should find out whether merchants experience it that way.</Pull></Rv>
      </div>
    </section>
  );
}

const Schema = ({ name, note, a, b }: { name: string; note: string; a: string; b: string }) => (
  <div style={{ background: "#0d0d0d", borderRadius: 16, padding: "20px 22px", fontFamily: "JetBrains Mono, monospace", fontSize: 13, lineHeight: 1.85, color: "#d4d4d4", overflowX: "auto" }}>
    <div style={{ color: "#6b6b6b" }}># {note}</div>
    <div><span style={{ color: "#7cc4ff" }}>type</span> <span style={{ color: "#fff" }}>{name}</span> {"{"}</div>
    {[[a, true], [b, true], ["id: ID!"], ["operations: [ResourceOperation!]!"], ["priceList: PriceList"], ["publication: Publication"], ["status: CatalogStatus!", false, true], ["title: String!"]].map(([l, diff, key], i) => (
      <div key={i} style={{ paddingLeft: 12, borderRadius: 6, background: diff ? "rgba(255,138,115,.1)" : key ? "rgba(54,251,161,.07)" : undefined }}>
        <span style={{ color: diff ? "#ff9b8a" : "#9a9a9a", display: "inline-block", width: 16 }}>{diff ? "±" : ""}</span>
        <span style={{ color: diff ? "#ffb3a7" : "#d4d4d4" }}>{l as string}</span>
        {key ? <span style={{ color: "#6b6b6b" }}>  # shared</span> : null}
      </div>
    ))}
    <div>{"}"}</div>
  </div>
);

export function SectionWhy() {
  return (
    <section className="sec" id="why">
      <div className="wrap">
        <SecHead
          tag="05 · Why it's this way"
          title="Why I stopped assuming it was an oversight."
          sub="An asymmetry in the product does not tell me why it exists. It may reflect deliberate product differentiation, a workflow boundary, launch scope, or technical constraints that aren't visible in public documentation. These are hypotheses to test, not explanations I can claim as fact."
        />
        <div className="grid g2" style={{ alignItems: "start" }}>
          <Rv className="prose">
            <p>I went looking for evidence on both sides. Then I stopped guessing about the architecture and read the schema, because Shopify publishes it.</p>
            <p>My working explanation for a while was an educated guess: rollouts probably belong to the Markets object model, direct catalogs hang off Company Locations, and the two don't meet. It read plausibly. It was also unfalsifiable, which should have bothered me sooner.</p>
            <p><b>First:</b> <code>Catalog</code> is a GraphQL <em>interface</em> (Admin API 2026-10), implemented by <code>AppCatalog</code>, <code>CompanyLocationCatalog</code> and <code>MarketCatalog</code>. Six of eight fields are identical. The two that matter differ by exactly one thing: <b>which object they attach to.</b> Neither has a rollout field; the word "rollout" appears zero times on either page.</p>
            <Note title="A correction worth stating plainly">
              <p>I read <code>status</code> as "the field a rollout flips." Wrong: <code>RolloutCatalogActivateChange</code> activates a catalog for a treatment's buyers <em>"without changing the catalog's native status."</em> A rollout overlays an activation for part of the audience. I had the evidence in hand and read it backwards.</p>
            </Note>
          </Rv>
          <Rv delay={80} style={{ display: "grid", gap: 10 }}>
            <Schema name="CompanyLocationCatalog" note="Plus only · direct assignment" a="companyLocations" b="companyLocationsCount" />
            <Schema name="MarketCatalog" note="every B2B plan · schedulable" a="markets" b="marketsCount" />
          </Rv>
        </div>

        <div className="grid g2" style={{ marginTop: 40, alignItems: "start" }}>
          <Rv>
            <div style={{ background: "#0d0d0d", borderRadius: 16, padding: "22px 24px", fontFamily: "JetBrains Mono, monospace", fontSize: 13.5, lineHeight: 1.9, color: "#d4d4d4" }}>
              <div style={{ color: "#6b6b6b" }}># returned by RolloutTreatment.changes, read side</div>
              <div><span style={{ color: "#7cc4ff" }}>type</span> <span style={{ color: "#fff" }}>RolloutCatalogActivateChange</span> {"{"}</div>
              <div style={{ paddingLeft: 28 }}>catalog: <span style={{ background: "rgba(54,251,161,.14)", color: "#7ff0b0", padding: "1px 7px", borderRadius: 6 }}>Catalog</span> <span style={{ color: "#6b6b6b" }}># the interface, not MarketCatalog</span></div>
              <div style={{ paddingLeft: 28 }}>id: ID!</div>
              <div>{"}"}</div>
            </div>
            <div style={{ marginTop: 20 }}>
              <RolloutsJoined />
            </div>
          </Rv>
          <Rv delay={80} className="prose">
            <p><b>Second, the finding I'd lead with in a review.</b> Rollouts carry changes as <code>treatments</code>; a catalog change inside one is <code>RolloutCatalogActivateChange</code>, and its <code>catalog</code> field is typed as the <code>Catalog</code> interface, not <code>MarketCatalog</code>.</p>
            <p>Read carefully, that's weaker evidence than it looks. It's a <b>read-side</b> field: how Shopify models a rollout change when reading one back. It says nothing about whether create and update mutations accept a <code>CompanyLocationCatalog</code>, or whether validation, audience targeting and permissions would allow it. It suggests the two types aren't alien to each other, a reason to ask an engineer, not an answer.</p>
            <Pull>The public schema suggests a common read-side model. It does not prove rollout mutations accept every catalog type.</Pull>
            <p><b>Then I checked when this shipped: 23 October 2026, shortly before I wrote this.</b> "Per market" is the whole boundary, stated in the launch note without comment. This isn't legacy debt; it's a two-week-old feature scoped to one of two catalog types.</p>
            <ul>
              <li><b>One plausible reading: market-only was a launch scope, not a verdict.</b> Catalog scheduling launched with market-based eligibility. That may reflect how catalog audiences and pricing contexts are resolved, but the changelog does not explain why direct-assigned catalogs were excluded. Rollouts also supports other resource types, so I should not describe the entire Rollouts system as having originated inside Markets. <em>It's a hypothesis for investigation 1, no stronger than the other three below.</em></li>
              <li><b>What I should not claim:</b> that a team is working in this code now. I have no visibility into roadmaps or staffing.</li>
              <li><b>The timing is the argument.</b> Market-assigned catalogs can be scheduled across eligible B2B plans. Plus-only direct company-location catalogs cannot be added to native Rollouts. The distinction is between assignment models, not free versus premium plans, and it's most useful to raise in the weeks after launch, before workarounds settle into "how it works."</li>
            </ul>
            <p className="cap">
              Verify: <Ext href="https://shopify.dev/docs/api/admin-graphql/latest/interfaces/Catalog">Catalog</Ext> · <Ext href="https://shopify.dev/docs/api/admin-graphql/latest/objects/CompanyLocationCatalog">CompanyLocationCatalog</Ext> · <Ext href="https://shopify.dev/docs/api/admin-graphql/latest/objects/MarketCatalog">MarketCatalog</Ext> · <Ext href="https://shopify.dev/docs/api/admin-graphql/latest/objects/RolloutCatalogActivateChange">RolloutCatalogActivateChange</Ext> · <Ext href="https://shopify.dev/docs/api/admin-graphql/latest/objects/Rollout">Rollout</Ext> · <Ext href="https://changelog.shopify.com/posts/schedule-and-test-catalog-changes-with-rollouts">changelog</Ext>. <b>What I still can't claim:</b> that the shared interface makes direct catalogs valid rollout targets. Engineering must validate the write path and runtime behavior before any estimate.
            </p>
          </Rv>
        </div>

        <Rv className="foot-top" style={{ marginTop: 56, marginBottom: 24 }}>
          <h3 className="h-inline" style={{ margin: 0 }}>Four explanations, and I'm not picking one</h3>
          <p className="sub" style={{ margin: 0 }}>I can see the asymmetry. I can't see the reasoning behind it. The absence of a public explanation is not the presence of a mistake. Each of these fits every fact I have.</p>
        </Rv>
        <div className="sub5 sub4">
          {[
            ["Deliberate differentiation", "Scheduling belongs to the market model because markets are the rule-based layer, and overrides are meant to be deliberate manual acts.", "A design document saying so, or anyone on the team articulating it."],
            ["A simpler workflow, on purpose", "Direct assignment is the quick path for a customer-specific override, and keeping it free of rollout machinery is what keeps it quick.", "Merchants describing it that way in interviews, and choosing it for that reason."],
            ["An increment, not an endpoint", "Catalog scheduling launched with market-based eligibility. Direct catalogs may simply not have been in the first scope, a shipping order rather than a verdict.", "Roadmap intent, or the absence of any decision record on the boundary."],
            ["A constraint I can't see", "Audience resolution and pricing precedence may make scheduled activation genuinely hard for a catalog bound to a location rather than a market.", "An engineer explaining why. The most interesting one, and the one I'm least able to test."],
          ].map(([t, d, c], i) => (
            <Rv key={t} delay={i * 50} className={cx("card pad", i === 2 && "card-dark")}>
              <div className="flex items-center justify-between" style={{ height: 24 }}>
                <span className="kicker">Explanation {i + 1}</span>
                {i === 2 ? <span className="kicker kd-label">The one I want true</span> : null}
              </div>
              <div className="d3" style={{ marginTop: 10 }}>{t}</div>
              <p style={{ margin: "10px 0 18px", fontSize: 14, lineHeight: 1.6, color: "var(--mute)" }}>{d}</p>
              <div>
                <div className="rule" style={{ marginBottom: 14 }} />
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)" }}>
                  <b>Would confirm it:</b> {c}
                </div>
              </div>
            </Rv>
          ))}
        </div>
        <p className="cap">All four are live. I notice I <em>want</em> explanation 3 to be true, because it's the one where my finding is most useful, a good reason to be suspicious of my own reading. Investigation 1 distinguishes between them, and it costs one conversation.</p>

        <div className="grid g2" style={{ marginTop: 40, alignItems: "start" }}>
          <Rv className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>What I can say without knowing which</h3>
            <p><b>Shopify documents the distinction and explains when each assignment route is appropriate.</b> However, the plan comparison does not surface the Rollouts limitation alongside the Plus-only direct-assignment capability. Whether merchants connect these details before choosing a route, particularly in the actual setup flow, remains unvalidated.</p>
            <p>A useful improvement may be one decision aid at setup: audience scope, precedence, scheduling eligibility and the 25-catalog-per-location limit, together. A product-content hypothesis, not a proven usability failure, test comprehension first.</p>
          </Rv>
          <Rv delay={80} className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>Why the framing matters more than the finding</h3>
            <p>A proposal to <em>"un-gate direct catalogs for Advanced merchants"</em> would argue against a plan boundary Shopify published in April, so I don't make it.</p>
            <p>What I'm bringing instead is a question: <b>do merchants connect the scheduling and precedence trade-off before they choose a route?</b> That's testable, and the answer may be that no engineering is needed.</p>
          </Rv>
        </div>
      </div>
    </section>
  );
}

const OUTCOMES = [
  { k: "A", t: "Do nothing", d: "The market-per-location workaround is adequate. Merchants don't reprice on a calendar, or already handle it through their ERP and the API.", cost: "None", lvl: 0, req: "Investigations 3 and 5 come back small: few use direct assignment, they reprice rarely, or integrations cover it." },
  { k: "B", t: "Fix the disclosure", d: "Shopify already explains when each route fits. Surface the Rollouts limitation next to the Plus-only direct-assignment capability, on the plan comparison and in setup. No engineering.", cost: "Very low", lvl: 1, hot: true, req: "Comprehension testing shows merchants don't connect the Rollouts limitation with the Plus-only capability before choosing a route. Test the current journey first." },
  { k: "C", t: "Bring direct catalogs to parity", d: "Investigate making direct company-location catalogs valid Rollout targets, preserving precedence and defining safe activation and recovery.", cost: "Unknown", lvl: -1, req: "Investigation 4 shows merchants choose direct assignment for its precedence and still need scheduled repricing, and 4 and 5 show the market route costs them something real. None of that is established." },
  { k: "D", t: "Converge the setup decision", d: "Create one guided assignment experience that helps merchants choose between market and direct assignment based on audience scope, pricing precedence and scheduling needs, while preserving the underlying distinction between the two models.", cost: "High", lvl: 4, req: "Interviews show merchants pick a route without weighing scope, precedence and scheduling, and the outcome B content fix, tested, doesn't close that gap. Not a merger of the two data models." },
];

export function SectionBuild() {
  return (
    <section className="sec" id="build">
      <div className="wrap">
        <SecHead
          tag="06 · Four outcomes"
          title="Four ways this could end, including doing nothing."
          sub="My instinct was to compare three build options and recommend one. That chooses a solution before establishing the problem is worth solving. Do nothing is first deliberately: on current evidence it's the one I can least rule out."
        />
        <div className="sub5">
          {OUTCOMES.map((o, i) => (
            <Rv key={o.k} delay={i * 50} className={cx("card pad", o.hot && "card-dark")}>
              <div className="flex items-center justify-between" style={{ height: 24 }}>
                <span className="kicker">Outcome {o.k}</span>
                {o.hot ? <span className="kicker kd-label">Working preference</span> : null}
              </div>
              <div className="d3" style={{ fontSize: "1.3rem", marginTop: 10 }}>{o.t}</div>
              <p style={{ margin: "10px 0 16px", fontSize: 14, lineHeight: 1.6, color: "var(--mute)" }}>{o.d}</p>
              <div>
                <div className="rule" />
                <div className="cost" style={{ padding: "14px 0" }}>
                  <span>Cost</span>
                  <b aria-label={`Cost: ${o.cost}`}>
                    {o.lvl < 0 ? "????" : <><i>{"$".repeat(o.lvl)}</i>{"$".repeat(4 - o.lvl)}</>}
                    <em>{o.cost}</em>
                  </b>
                </div>
                <div className="rule" />
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--ink-2)", paddingTop: 16 }}>
                <b>Would have to be true:</b> {o.req}
              </div>
            </Rv>
          ))}
        </div>
        <p className="cap">
          <b>Option C is the one I wanted to be right,</b> and I had it written up as obvious before I'd earned it. <b>My working preference is B over C, but I don't have enough evidence to rank the outcomes by likelihood.</b> A remains viable until investigations 3 and 4 are complete. Cost for C: the schema exposes a shared read-side interface, but nothing about mutation eligibility, validation, targeting, permissions or feasibility.
        </p>
        <div className="grid g2" style={{ marginTop: 24, alignItems: "start" }}>
          <Rv className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>What outcome D means, and doesn't</h3>
            <p>D is a guided setup decision, not a merged data model. Market and direct assignment keep their different precedence rules underneath; the merchant gets one place that asks about audience scope, pricing precedence and scheduling needs, and recommends a route.</p>
          </Rv>
          <Rv delay={80} className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>The evidence that would justify D over B or A</h3>
            <p>A content fix (B) is cheaper, so D needs more: interviews that show merchants choose a route without weighing those three factors, and a tested B that still leaves them choosing wrongly. If merchants already choose well, or B fixes it, D isn't justified, and if nobody is hurt by the choice, A is the answer.</p>
          </Rv>
        </div>

        <Rv style={{ marginTop: 56 }}>
          <Pull>A negotiated price is a contractual commitment. Every buyer purchasing for the same company location must receive the intended contract price, so even Launch and Event use 100% of the eligible audience. That's a proposed requirement, not an existing direct-catalog Rollouts capability.</Pull>
        </Rv>
        <div className="grid g2" style={{ marginTop: 32, alignItems: "start", columnGap: 64 }}>
          <Rv className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>One thing I'd cut from my own proposal</h3>
            <p>The original idea extended all three rollout types to direct catalogs: Launch, Event and Experiment. <b>Experiment stays out of scope.</b></p>
            <p>Rollout traffic allocation is a percentage of eligible visitors, assigned at random; Experiment adds a control/treatment split. That's not the same as assigning one negotiated price to every buyer at a company location. I haven't tested whether Shopify would expose inconsistent contract prices, so I won't claim it, the initial design assumes 100% allocation to the eligible company-location audience.</p>
          </Rv>
          <Rv delay={80} className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>What I'd want an engineer to tell me</h3>
            <p>Option C rests on a claim I can only half-support: the schema types <code>RolloutCatalogActivateChange.catalog</code> as the <code>Catalog</code> interface, which <code>CompanyLocationCatalog</code> implements. That tells me the <em>returned</em> type. It does <b>not</b> tell me that create and update mutations accept it, that validation permits it, that targeting can serve a company-location catalog to a treatment's audience, or that permissions and billing agree. A reviewer was right to push me on this. The defensible sentence: <b>the schema suggests a common abstraction; engineering validation is required.</b> That's one conversation, inside investigation 5.</p>
          </Rv>
        </div>
        <Rv className="callout" style={{ marginTop: 24 }}>
          <span className="callout-ic">
            <RiFlaskLine size={16} />
          </span>
          <p>If price experimentation is ever considered, the randomization and analysis unit must be chosen deliberately, potentially the company location or merchant. Launch and Event are the only candidates for discovery, and even they need engineering validation of activation and rollback semantics.</p>
        </Rv>
      </div>
    </section>
  );
}
