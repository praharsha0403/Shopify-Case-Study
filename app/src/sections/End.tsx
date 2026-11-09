import { useState, type ReactNode } from "react";
import { RiLinkedinFill, RiMailLine, RiCheckboxCircleFill, RiCloseCircleFill, RiFlagLine, RiGroupLine, RiLineChartLine, RiQuestionAnswerLine, RiTimeLine, RiBookOpenLine, RiArrowRightLine } from "@remixicon/react";
import { Accordion, AccordionItem } from "@/components/base/accordion/accordion";
import { Tab, TabList, TabPanel, Tabs } from "@/components/base/tabs/tabs";
import { DecisionMap, DiscoveryGantt, InterviewScript, JourneyBars, ShipGantt } from "@/charts/viz";
import { PreflightScene } from "@/scenes/shopify";
import { Bands, Ext, Note, Pull, Rv, SecHead } from "@/ui/fp";
import { cx } from "@/utils/cx";

export function SectionProve() {
  return (
    <section className="sec" id="prove">
      <div className="wrap">
        <SecHead
          tag="07 · What's next"
          title="What I'd need to prove before anyone writes code."
          sub="I had a revenue number, $180 to $270 million, and every input underneath it was invented. I don't know how many merchants use direct catalogs, how often they reprice, or what it costs them when it goes wrong. Those aren't gaps to paper over. Closing them would be the first three weeks of the job."
        />
        <div className="grid g2" style={{ alignItems: "start" }}>
          <Rv className="prose">
            <h3 className="h-inline" style={{ marginTop: 0 }}>Five proposed investigations, in dependency order</h3>
            <p>My instinct was to order these by cost. That's wrong: establish the intended behavior first, reproduce it, <em>then</em> quantify who it affects. Sizing a problem before you understand the decision that created it is how you end up measuring the wrong thing precisely.</p>
            <p>Four of the five have a result that would stop the work. The second doesn't: reproducing the behavior in a test store proves how the product works, not whether the workaround is good enough for merchants. That decision waits for the interviews.</p>
            <p><b>How this differs from section 08:</b> these five establish what must be learned and what each answer rules out. Section 08 assumes the answers came back favorably. If you only read one, read this, 08 is contingency planning for an outcome I'm not predicting.</p>
            <Note title="What the three weeks assume" tone="warn">
              <p>These are proposed investigations, not work I've done. As an independent author I haven't had access to Shopify's internal data or teams. The three-week estimate depends on access to:</p>
              <ul>
                <li>Internal product rationale and the relevant product owners</li>
                <li>A Shopify test store</li>
                <li>Usage data or internal queries</li>
                <li>Merchant recruitment and interview availability</li>
              </ul>
            </Note>
          </Rv>
          <Rv delay={80}>
            <DiscoveryGantt />
          </Rv>
        </div>
        <Rv style={{ marginTop: 12 }}>
          <DecisionMap />
        </Rv>
        <Rv style={{ marginTop: 24 }}>
          <div className="tw" tabIndex={0} role="region" aria-label="Five investigations: stop and go (table)">
            <table className="t">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Question it answers</th>
                  <th>Evidence required</th>
                  <th>Stops the work if…</th>
                  <th>Leads to</th>
                  <th>Uncertainty that remains</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", <><strong>Shopify's original rationale.</strong> What was the intended division of labor between market and direct assignment, and why were direct catalogs left out of Rollouts?</>, "Product and design documentation; one conversation with the owners of B2B catalogs", "A current, deliberate rationale already accounts for the asymmetry.", "B if merchants still need the trade-off surfaced; otherwise A", "Whether that rationale still matches how merchants use the two routes"],
                  ["2", <><strong>Reproduce the behavior.</strong> Does the storefront resolve prices as documented for a single-location market, a broader company-location market and a region market?</>, "A test store with overlapping products, quantity rules and volume pricing; the buyer-facing resolved price compared with the documented hierarchy", "Nothing, on its own. It proves technical behavior, not that the workaround is adequate for merchants. A mismatch goes to engineering as a behavior question.", "Informs investigation 4", "Whether merchants experience the documented behavior as workable"],
                  ["3", <><strong>Quantify usage.</strong> How many Plus merchants use direct assignment <em>versus</em> single-location markets, and with how many catalogs?</>, "Two internal queries: direct-assignment usage and catalog-count distribution; Plus shops already using location-scoped markets", "The direct-assignment cohort is thin, or most hold one or two catalogs.", "A", "Why merchants chose their route; counts don't say"],
                  ["4", <><strong>Interview merchants.</strong> Why did they choose their route, and does the market workaround meet their real repricing need?</>, "8–10 interviews about past behavior, across the four groups below", "The workaround meets a verified merchant need.", "A if the need is met; B if merchants don't connect the details; D if they choose without weighing scope, precedence and scheduling, and B doesn't fix it", "A discovery sample, not a representative one; patterns need checking against usage data"],
                  ["5", <><strong>Operational impact.</strong> How often do negotiated prices change, what breaks, and what already covers it?</>, "Repricing frequency, integration dependencies, manual-work estimates; engineering's read on what parity would cost", "Repricing is rare, or integrations already automate it.", "A. C only if all five pass", "Cost depends on engineering validating the write path"],
                ].map(([n, a, b, c, d, e]) => (
                  <tr key={n as string}>
                    <td><span className={cx("chip", n === "1" ? "b" : undefined)}>{n}</span></td>
                    <td>{a}</td>
                    <td>{b}</td>
                    <td>{c}</td>
                    <td>{d}</td>
                    <td>{e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cap"><b>Investigation 3's second query is the one I'd fight for.</b> Counting direct-assignment users gives the cohort size; counting Plus merchants already using single-location markets gives the baseline. Together with the interviews, they show whether merchants choose direct assignment because they need its precedence, or because it's the more intuitive way to make a customer price list. The first points toward parity; the second toward guidance.</p>
        </Rv>

        <div className="grid g2" style={{ marginTop: 48, alignItems: "start" }}>
          <Rv className="prose">
            <Note title="A constraint I discovered late">
              <p>Shopify states a rollout <em>"can include more than one catalog change"</em>, bulk scheduling already exists for market catalogs. But a catalog can only be in one unended rollout at a time, which shapes how a merchant with overlapping seasonal changes would use this. I'd been assuming unlimited composability.</p>
            </Note>
            <h3 className="h-inline">How I'd run investigation 4</h3>
            <p>The failure mode in discovery is asking people whether they want a feature. They always say yes. So the script is about the last time, not the next time, and never about whether they'd like something I've proposed.</p>
            <p>Q4 is the one I most want answered: how they chose between direct and market assignment, and what else they considered. I don't mention a single-location market until Q7, after I understand their workflow, so the alternative doesn't steer their answers. If most hadn't considered it, that points at guidance rather than capability.</p>
          </Rv>
          <Rv delay={80}>
            <InterviewScript
              key4={3}
              questions={[
                "How many company locations and distinct catalogs do you manage?",
                "Walk me through the last time you changed negotiated prices for a company location.",
                "How did you prepare the new prices and make them live at the intended time?",
                "How did you decide between direct assignment and market assignment? What alternatives did you consider?",
                "Show me your current catalog configuration. When overlapping products exist, how do you know which price the buyer receives?",
                "What happened the last time a pricing update failed or went wrong? How did you recover?",
                "Had you previously considered or used a B2B market targeting one specific company location? (Only introduced after understanding their existing workflow.)",
              ]}
            />
          </Rv>
        </div>

        <Rv style={{ marginTop: 40 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>Who I'd recruit, and why each group</h3>
          <p className="lead-p" style={{ marginTop: 0 }}>8–10 interviews is a proposed discovery sample to find patterns and surprises, not a representative sample.</p>
          <div className="grid g4" style={{ marginTop: 16 }}>
            {[
              ["Direct-assignment users", "Did they choose it for its precedence, and how do they reprice today?"],
              ["Single-location-market users", "Does the workaround already meet the need, and what does it cost them?"],
              ["Merchants using both", "Where do precedence and scheduling collide in a real configuration?"],
              ["Integration or ERP users, where relevant", "Does scheduling already live outside Shopify, and at what upkeep?"],
            ].map(([t, d]) => (
              <div key={t} className="card pad">
                <span className="ico">
                  <RiGroupLine size={18} />
                </span>
                <div className="d3" style={{ marginTop: 14, fontSize: "1.05rem" }}>{t}</div>
                <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--mute)" }}>{d}</p>
              </div>
            ))}
          </div>
        </Rv>

        <Rv className="prose" style={{ marginTop: 40 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>The model I'd fill in, rather than the number I'd guess</h3>
          <div className="grid g2" style={{ columnGap: 56 }}>
          <p>The first decision is whether there's a real workflow problem. Only then would I estimate engineering cost against measured operational impact. Plus list price is not incremental revenue at risk, and broad wholesale-efficiency case studies are not evidence this feature improves retention.</p>
          <p>Retention or expansion impact needs a separate cohort analysis, not interviews alone. I wouldn't forecast revenue or retention from forum posts. The decision I'd bring to prioritization is a bounded discovery question, how many Plus merchants use direct assignment, what work it creates, and whether the precedence guarantee matters enough that a scheduled market isn't a substitute. If the cohort is small or the market route already serves the workflow, the proposal should stop.</p>
          </div>
          <div className="grid g4" style={{ marginTop: 40 }}>
            {[
              ["Cohort sizes", "Direct-assignment vs single-location-market users", "Investigation 3"],
              ["Catalogs & locations per merchant", "Does maintenance plausibly create scale work?", "Investigation 3"],
              ["Repricing frequency & recovery cost", "How much operational burden exists today", "Investigations 4 + 5"],
              ["Why direct assignment", "Functionally necessary, or a default-choice issue?", "Investigations 3 + 4"],
            ].map(([t, d, s]) => (
              <div key={t} className="card pad">
                <span className="chip">{s}</span>
                <div className="d3" style={{ marginTop: 12, fontSize: "1.05rem" }}>{t}</div>
                <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.55, color: "var(--mute)" }}>{d}</p>
              </div>
            ))}
          </div>
        </Rv>
      </div>
    </section>
  );
}

const FLOW = [
  ["Select", "Pick the direct-assigned catalogs and company locations in the change.", "Show unique catalogs and locations separately; never infer one catalog per account."],
  ["Prepare", "Prepare a new direct catalog with the revised prices; never edit the active catalog in place for a future change.", "Show current vs proposed catalog and variant differences; confirm publication and quantity/volume rules."],
  ["Resolve", "Preview the buyer price for each affected location and overlapping product, including the catalog being replaced.", "Explain the precedence chain and flag any catalog that would keep winning, including an old direct catalog with a lower price."],
  ["Schedule", "Launch or Event, start/end, store timezone, 100% of the location's eligible buyers, a proposed requirement.", "No random partial allocation for contract prices. Validate targeting, eligibility, the 25-per-location limit and one-unended-rollout rule."],
  ["Confirm", "Review a final summary before scheduling.", "Every location, catalog, overlap, effective price and blocked item. No silent partial success."],
  ["Monitor", "Review the activation outcome and resolve failures.", "Engineering validates what partial failure, recovery and audit would require; I'm not assuming atomic activation or rollback exists. A revert changes activation, not prior prices."],
];

const TRANSITION: [string, string][] = [
  ["The old direct catalog", "Does it have to be drafted or deactivated for the new one to take effect? The public documentation doesn't say that activating a new catalog replaces the old one."],
  ["Both active at once", "Shopify documents that when several direct catalogs on one company location include the same product, the lowest price applies. If the old catalog stays active and is cheaper, the buyer keeps the old price."],
  ["One scheduled change", "Today a rollout can include more than one catalog change for market catalogs. Whether drafting the old direct catalog and activating the new one could be scheduled together is an engineering validation question."],
  ["Partial failure", "If one activation succeeds and the other fails, what does the buyer see, and how does the merchant find out? Validation question. I'm not assuming an atomic transaction or rollback."],
  ["Recovery and audit", "Start from what existing activity logs, API records and webhooks already record, before proposing anything new."],
];

export function SectionShip() {
  return (
    <section className="sec" id="ship">
      <div className="wrap">
        <SecHead
          tag="08 · If the answer is build"
          title="How it would ship, contingency, not a roadmap."
          sub="Shopify ships with gradual rollouts, developer previews, Merchant Success beta cohorts, and twice-yearly Editions. A plan that ignores that machinery isn't a plan."
        />
        <div className="grid g2" style={{ alignItems: "start", columnGap: 56 }}>
        <Rv>
          <Note title="This section is conditional, and I nearly deleted it" tone="warn">
            <p>Everything below assumes outcome C, and only applies if the five investigations support a build. <b>My working preference is B over C, but I don't have enough evidence to rank the outcomes by likelihood.</b> The initial recommendation stays: no build until evidence supports it. I've kept this because "I'd find out first" is only credible if you can show you'd know what to do with a yes.</p>
          </Note>
        </Rv>
        <Rv className="prose" delay={80}>
          <p>The first evaluation is workflow feasibility and operational impact, not GMV. Adoption and time saved can be measured in a beta; any causal claim about support load or retention needs an adequately powered merchant-level evaluation. <b>Scope:</b> Launch and Event only; Experiment excluded until engineering verifies the allocation unit. <b>Existing capability:</b> a rollout can already include several catalog changes, the question is whether direct catalogs can be valid targets and what precedence-safe behavior requires.</p>
        </Rv>
        </div>

        <Rv style={{ marginTop: 32 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>A concrete workflow to validate before designing UI</h3>
          <div className="flow6" style={{ marginTop: 20 }}>
            {FLOW.map(([t, a, g], i) => (
              <div key={t} className={cx("card", i === 2 && "card-dark")}>
                <div className="f-h">
                  <span className="f-n">{i + 1}</span>
                  <span className="d3">{t}</span>
                  {i === 2 ? <span className="f-key">Where precedence bites</span> : null}
                </div>
                <p className="f-d">{a}</p>
                <p className="f-g">
                  <b>Safeguard:</b> {g}
                </p>
              </div>
            ))}
          </div>
        </Rv>

        <Rv style={{ marginTop: 40 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>What happens to the catalog it replaces</h3>
          <p className="lead-p" style={{ marginTop: 0 }}>The flow prepares a new direct catalog, but a new catalog going live doesn't, by itself, retire the old one. Where the public documentation doesn't establish the behavior, it's an engineering validation question, not a feature I'm assuming.</p>
          <div className="pts3 pts5" style={{ marginTop: 16 }}>
            {TRANSITION.map(([k, d]) => (
              <div key={k} className="pt">
                <b className="pt-k">{k}</b>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </Rv>

        <Rv className="hero-shot" style={{ marginTop: 40, borderRadius: 20, borderBottom: "1px solid var(--line)", padding: 0, overflow: "hidden", display: "flex", justifyContent: "center" }}>
          <PreflightScene />
        </Rv>
        <p className="cap">
          <b>Concept, not an existing Shopify screen.</b> Step 3, resolve, drawn with LEGO as a hypothetical merchant (LEGO isn't on Shopify): real set names and images, invented retailer and contract prices. It assumes a proposed company-location audience and 100% allocation; today's Rollouts audience is market-derived. The required decision is to show the buyer's resolved price, not just the catalog being scheduled. <b>Open questions:</b> a direct-catalog target extension or a new orchestration layer; whether catalog versions are needed; how conflicts with market catalogs surface; what existing activity logs, API records and webhooks already provide before proposing an audit trail.
        </p>

        <div className="grid g2" style={{ marginTop: 48, alignItems: "start" }}>
          <Rv className="stick-l">
            <ShipGantt />
          </Rv>
          <Rv delay={80} className="card" style={{ overflow: "hidden" }}>
            {[
              ["Weeks 1–3 · Discovery", "Answer the five investigations. Earn the right to build.", "Queries and conversations from section 07; 8–10 merchants across direct, single-location-market and mixed setups, about what they did last January. Walk into the B2B and Markets teams and ask what I'm missing."],
              ["Weeks 4–7 · Design & scope", "Find out what the object model will allow", "With Markets engineering: can a rollout target a non-market catalog, at what cost? Design against a real account list, not a mock with six rows. Audit existing history, API records and webhooks first."],
              ["Weeks 8–13 · Closed beta", "25–40 Plus merchants, a provisional size", "A learning cohort, not a statistical sample. Selected through Merchant Success from discovery participants and other direct-assignment merchants who reprice on a schedule, mixing catalog counts and integration setups. It validates the workflow, the resolved-price preview and failure handling, not market-wide demand. Launch activation first."],
              ["Weeks 14–21 · Open beta", "Comparison design only if the cohort supports it", "Event only once Launch is reliable. No 5% holdout by intuition: estimate population, baseline, minimum detectable effect and sample size first, or report descriptively."],
              ["Weeks 22+ · GA & disclosure", "Ship it, and surface the trade-off", "Opt-in for eligible Plus merchants first, keeping direct assignment Plus-only. GA and an Editions announcement follow evidence. Plan comparison and setup show precedence and scheduling eligibility together."],
            ].map(([d, h, b], i) => (
              <div key={d} style={{ padding: "16px 20px", borderTop: i ? "1px solid var(--line)" : 0 }}>
                <div className="kicker">{d}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 2 }}>{h}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--mute)", marginTop: 4 }}>{b}</div>
              </div>
            ))}
          </Rv>
        </div>

        <Rv style={{ marginTop: 40 }}>
          <h3 className="h-inline" style={{ marginTop: 0 }}>What I'd measure, and in what order</h3>
          <div className="tw" tabIndex={0} role="region" aria-label="What I'd measure (table)">
            <table className="t">
              <thead>
                <tr><th>Stage · metric</th><th>What's measured</th><th>Eligible cohort</th><th>Observation window</th><th>How it's collected</th><th>Decision it informs</th></tr>
              </thead>
              <tbody>
                {[
                  ["Beta", "Workflow completion and preparation time", "Share of scheduled direct-catalog changes completed without help; time from starting a change to scheduling it", "Beta merchants", "Every change they schedule during the beta", "Product instrumentation, against each merchant's own baseline from discovery", "Whether the workflow is usable enough to widen the beta"],
                  ["Beta", "Unique catalogs and company locations per rollout", "Distinct catalogs and locations in each scheduled change; one account ≠ one catalog", "Beta merchants", "During the beta", "Rollout records", "Whether merchants coordinate multi-catalog changes, and so whether bulk handling matters"],
                  ["Open beta", "Adoption among eligible merchants", "Share of eligible merchants who schedule at least one change", "Plus merchants using direct assignment", "At least one full repricing cycle, set from discovery; contract pricing may be annual or seasonal, so not a fixed 90 days", "Usage data", "Whether the need is real at scale. Low adoption over a full cycle means I was wrong, and I'd say so"],
                  ["Open beta", "Activation failures, precedence conflicts, incorrect buyer prices", "Failed activations, conflicts flagged at preview, orders at an unintended price", "Every scheduled change", "Continuous", "Activation logs, preview results, resolved-price checks against the intended price", "Guardrail: pause the beta if it rises. A revert changes activation, not prices"],
                  ["Later, if a baseline exists", "Support contacts about catalog updates", "Contact volume and themes", "Eligible merchants", "Comparable periods before and after", "Support tagging", "Descriptive only, unless the baseline and sample support more"],
                  ["Later, if powered", "Retention or expansion", "Merchant-level retention or plan expansion", "A defined cohort and assignment unit", "Long enough to cover renewals", "Cohort analysis with an adequately powered evaluation", "Not a promised outcome; causal claims only if the design supports them"],
                ].map(([a, b, c, d, e, f, g], i) => (
                  <tr key={i}>
                    <td>
                      <span className={cx("chip", a === "Beta" ? "g" : a === "Open beta" ? "b" : undefined)} style={{ whiteSpace: "nowrap" }}>{a}</span>
                      <strong style={{ display: "block", marginTop: 8 }}>{b}</strong>
                    </td>
                    <td>{c}</td>
                    <td>{d}</td>
                    <td>{e}</td>
                    <td>{f}</td>
                    <td>{g}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="cap">The initial success criterion is reliable workflow completion and reduced preparation effort. Discovery findings set the observation windows. GMV and retention are downstream hypotheses, not promised outcomes.</p>
        </Rv>
      </div>
    </section>
  );
}

const WILL: [string, string][] = [
  ["A decision in about three weeks, given access", "Five investigations in dependency order. The first, Shopify's original rationale, takes a day and could stop the work early."],
  ["Understanding the original decision before changing it", "Investigation 1 is reading why Shopify built both. If a current rationale accounts for the asymmetry, that's the answer."],
  ["Testing the disclosure regardless of the outcome", "Shopify documents the distinction. What's unvalidated is whether merchants connect the Rollouts limitation with the Plus-only capability before choosing; I'd test that whatever else comes back."],
  ["Killing this publicly if the answers come back small", "Each investigation has a stated stop result. I've already killed my own thesis once; doing it twice costs nothing."],
];
const WONT: [string, string][] = [
  ["That this is worth building", "I can't rule out that the market workaround is adequate and nothing needs to change beyond the docs."],
  ["A cost estimate for parity", "The schema hints the model allows it, nothing about mutations, validation, targeting, permissions or billing."],
  ["Revenue impact", "I had a $180–270M estimate and deleted it. I'm not replacing it with a better-dressed guess."],
  ["That merchants want this", "Six mixed-provenance signals point at adjacent workflows. None validates direct-assignment demand."],
];

export function SectionCommit() {
  const col = (title: string, list: [string, string][], ok: boolean) => (
    <div className="card pad">
      <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
        <span className="d3">{title}</span>
      </div>
      {list.map(([t, d]) => (
        <div key={t} className="flex gap-3" style={{ padding: "14px 0", borderTop: "1px solid var(--line-2)" }}>
          {ok ? <RiCheckboxCircleFill size={20} color="var(--green)" style={{ flex: "none" }} /> : <RiCloseCircleFill size={20} color="#e5484d" style={{ flex: "none" }} />}
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em", color: ok ? "var(--ink)" : "var(--mute)" }}>{t}</div>
            <div style={{ fontSize: 14, lineHeight: 1.55, color: "var(--mute)", marginTop: 3 }}>{d}</div>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <section className="sec" id="commit">
      <div className="wrap">
        <SecHead tag="09 · Commitments" title="What I'd commit to, and what I wouldn't." sub="The tempting promise is feature outcomes, scheduling that works, bulk operations, an audit trail. I can't promise those; I haven't established the feature should be built. What I can commit to is the investigation and its honesty." />
        <Rv className="grid g2">
          {col("I'd commit to", WILL, true)}
          {col("I wouldn't promise", WONT, false)}
        </Rv>
        <p className="cap"><b>This section changed more than any other.</b> It used to be product guarantees. Now I know what to find out, not what to build.</p>
      </div>
    </section>
  );
}

const QA: { cat: string; who: string; q: string; a: ReactNode[] }[] = [
  { cat: "Product", who: "asked by the person who should ask it first", q: "A B2B market can target one company location. So your gap doesn't exist. Why are we still talking?", a: [
    "You're right, and that question killed the proposal I had built. A Plus merchant can schedule location-specific pricing by creating a market for one named company location, provided no higher-precedence direct catalog keeps determining the price for overlapping products. Section 03 is built around that finding rather than hiding it.",
    "What I'd put in front of you is narrower. The precedence rules are clear in the developer guide. The question isn't whether the hierarchy is documented; it's whether merchants understand it and need both precedence and scheduling for the same contract. Investigation 2 checks the live behavior; investigation 4 asks the merchants.",
  ] },
  { cat: "Product", who: "a commercial-strategy check", q: "Would extending scheduled activation to directly assigned catalogs change the role of direct assignment as a Shopify Plus differentiator?", a: [
    "Possibly, and I can't answer it from outside. Direct assignment is a published Plus capability, and scheduling it could make it more valuable, or change how it's positioned against what every B2B plan gets through markets.",
    "So the proposal keeps the boundary: direct assignment stays Plus-only, and any scheduling for it would be Plus-only too. What that does to Plus positioning is a question to validate with the people who own the plan structure, not a conclusion I'd draw. It's one more reason the recommendation is no build until the evidence supports one.",
  ] },
  { cat: "Engineering", who: "asked by a principal engineer", q: "You built a confident proposal on a GraphQL interface type. That's not how our system works.", a: [
    <>Fair, and I've narrowed the claim. The schema shows <code>RolloutCatalogActivateChange.catalog</code> returns the <code>Catalog</code> interface, which <code>CompanyLocationCatalog</code> implements. It does <em>not</em> show that mutations accept it, that validation permits it, that targeting can serve it to a treatment's audience, or that permissions and billing agree.</>,
    "The defensible sentence: the public schema suggests a common catalog abstraction, but doesn't establish that direct company-location catalogs are supported by rollout mutations. Engineering validation is required. I'd previously written something much more confident.",
    <>I also got a related thing backwards: I claimed <code>status</code> was the field a rollout flips. Your docs say a rollout activates a catalog <em>"without changing the catalog's native status."</em> It's corrected in section 05 rather than deleted.</>,
  ] },
  { cat: "Engineering", who: "asked by an engineering lead", q: "Merchants at that scale use the API. Why would they care about admin scheduling?", a: [
    "Some will, and I've written that as a kill criterion in investigation 5 rather than an objection to argue past. If repricing is already automated through ERP integrations, this is a quality-of-life fix and should be prioritized as one.",
    "Two things make me check rather than assume. An ERP or app workaround may need its own scheduler, versioning, recovery logic and audit trail for a workflow Rollouts already provides for market catalogs. And it's only available to merchants with engineering capacity, but that's a hypothesis; I have no data on what share of Plus B2B merchants have developers.",
  ] },
  { cat: "Engineering", who: "asked by a staff engineer", q: "What if the engineering cost is much higher than you think?", a: [
    "Entirely possible, and I've deliberately not estimated it because I can't see the code. Rollouts may be coupled to the market object in ways that make this a rewrite rather than an extension.",
    "That's why weeks 4–7 are a scoping gate rather than a design phase. If the coupling is deep, the proposal changes shape, most likely to a narrower “scheduled activation on a direct catalog” that borrows the idea without inheriting the whole Rollouts surface.",
  ] },
  { cat: "Support", who: "asked by a support lead", q: "Why hasn't this come up from merchants, if it's real?", a: [
    "Section 04 has six public signals, verbatim and linked, with what each does and doesn't demonstrate. None establishes that direct assignment caused the reported problems. No one in the sample asks for Rollouts on direct catalogs, and I can't turn that absence into proof of latent demand.",
    "The signals are heterogeneous, workload, webhooks, bulk-edit recovery, a developer's validation. They don't establish a common failure. I can't rebut that from public data; the defensible next step is targeted merchant research, which is why investigation 4 is interviews rather than ticket analysis.",
  ] },
  { cat: "Research", who: "asked by a research lead", q: "Your merchant evidence is forum posts. We have actual research. Why would I value yours?", a: [
    "You shouldn't value it above your own. You have the data I spent a week approximating badly; if your research contradicts mine, yours wins. You can query how many Plus merchants use direct catalogs and how often they reprice. I can't.",
    "What public evidence gets you is limited but checkable: every quote has a link, and each signal is labeled for what it does and doesn't demonstrate.",
  ] },
];

export function SectionHard() {
  return (
    <section className="sec" id="hard">
      <div className="wrap">
        <SecHead tag="Appendix A · Q&A" title="Questions I used to pressure-test the recommendation" sub="These are hypothetical review objections I wrote to challenge my own proposal, from the point of view of each function. They were not asked by Shopify employees." />
        <div className="qa">
          {QA.map((q, i) => (
            <Rv key={q.q} className="qa-row" delay={i * 30}>
              <div className="qa-q">
                <span className="qa-who">
                  <img className="qa-av av-img" src={`/ref/avatars/${q.cat.toLowerCase()}.svg`} alt="" />
                  Hypothetical · {q.cat} lens
                </span>
                <h3>{q.q}</h3>
              </div>
              <div className="qa-a prose">
                {q.a.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </Rv>
          ))}
        </div>
      </div>
    </section>
  );
}

type J = { d: string; h: string; tag?: string; kill?: boolean; b: ReactNode };
const JOURNEY: J[] = [
  { d: "Day 1", h: "Started from the earnings call, not the product", b: "A secondary industry summary reported B2B GMV growth of 96% in 2025 after 140% in 2024. I treated that as context for asking which workflows might be under-served, not as evidence of demand." },
  { d: "Day 2", h: "“Per-customer pricing is locked behind a $2,300 plan”", tag: "Wrong", kill: true, b: "I'd read it in four agency blogs and believed it. Custom B2B pricing works on Basic; what's Plus-only is direct assignment. I only caught it reading the plan page to get a number right." },
  { d: "Day 2", h: "“10 customers per company location”", tag: "Wrong", kill: true, b: "Also from a blog. The real numbers are 50 customers and 25 catalogs. Two wrong facts in one afternoon convinced me to rebuild everything off primary documentation only." },
  { d: "Day 3", h: "“So un-gate direct assignment for Advanced”", tag: "Killed", kill: true, b: "My first real proposal. I killed it after re-reading the April announcement, Shopify had just published that boundary deliberately. Asking them to reverse it is a misread of the business." },
  { d: "Day 3", h: "Found the rollout sentence while checking something else", tag: "Kept", b: "Verifying assignment limits, I read past the section I needed. One sentence in a paragraph about something else. I almost scrolled past it." },
  { d: "Day 4", h: "Reframed from “give it away” to “it's incomplete”", tag: "The turn", b: "One question asks Shopify to reverse a plan boundary; the other asks whether the documented distinction creates a workflow problem worth solving. The second is more precise and doesn't presume the answer." },
  { d: "Day 5", h: "Deleted my own revenue estimate", tag: "Hardest edit", b: "$180–270M looked impressive. Every input was invented. Taking it out made the document weaker to skim and much stronger to interrogate." },
  { d: "Day 6", h: "Had the draft torn apart, and the worst note was right", tag: "Kept the note", b: "A hostile reviewer: the whole thing was Help Center pages and two merchants Shopify published itself. No merchant had chosen to speak. A document about a problem, written without the people who have it." },
  { d: "Day 6", h: "Went looking for merchants and nearly concluded I was wrong", tag: "Almost killed it", kill: true, b: "Forums, the request board, YouTube, Reddit, X, LinkedIn. No explicit request for a rollout on a company-location catalog. The honest conclusion might have been a real gap nobody cares about." },
  { d: "Day 6", h: "Then noticed I'd been searching for the wrong sentence", tag: "The second turn", b: "The public record surfaced adjacent symptoms, manual edits, bulk-operation risk, automation requests, rollback tooling, but not one shared failure. I keep that distinction visible." },
  { d: "Day 7", h: "Stopped guessing about architecture and read the schema", tag: "Should have come first", b: <>Twenty minutes in the reference docs: <code>RolloutCatalogActivateChange.catalog</code> is typed as the <code>Catalog</code> interface, not <code>MarketCatalog</code>, the opposite of what I'd argued. A plausible paragraph instead of a link is a worse habit than being wrong.</> },
  { d: "Day 7", h: "Checked the changelog date, then my own conclusion", tag: "Changed the pitch", b: "Catalog rollouts shipped 23 October 2026, shortly before. The changelog shows the scope, not why direct catalogs were excluded or whether that's permanent. The timing is a moment to ask, not evidence of intent." },
  { d: "Day 8", h: "Found the paragraph that killed my proposal", tag: "Thesis dead", kill: true, b: <>A reviewer asked whether a market could target one location. I'd assumed not. Shopify's own worked example: <em>"Company Location A, a market specifically for a single company location."</em> Documented the whole time.</> },
  { d: "Day 9", h: "Read the precedence rule properly and found the better finding", tag: "The real one", b: "Direct assignment takes precedence over market catalogs. The override layer can't be scheduled; location-specific market pricing can. The surviving question: does anyone need both?" },
  { d: "Day 9", h: "Invented a documentation contradiction that wasn't there", tag: "Caught in review", kill: true, b: "I treated two precedence rules as ambiguous, then found the developer docs' full hierarchy. The ordering is documented. The open question is whether merchants understand and need it." },
  { d: "Day 9", h: "Reordered my discovery plan after one sentence of feedback", tag: "Best note I got", b: <>My plan started with sizing. Someone pointed out I was sizing a problem before understanding the decision that created it: <em>before proposing another way to manage B2B pricing, understand why Shopify already built two.</em></> },
];

export function SectionJourney() {
  const [pick, setPick] = useState<number | null>(null);
  const [kind, setKind] = useState<"all" | "wrong" | "kept">("all");
  const list = JOURNEY.filter((j, i) => (pick === null || i === pick) && (kind === "all" || (kind === "wrong" ? j.kill : !j.kill)));
  return (
    <section className="sec" id="journey">
      <div className="wrap">
        <SecHead tag="Appendix B · The journey" title="How I got here, including the parts I got wrong." sub="The finished argument makes the process look cleaner than it was. Three of my first four ideas were wrong, two of them in ways that would have embarrassed me in an interview." />
        <div className="grid g-jr" style={{ alignItems: "start" }}>
          <div style={{ position: "sticky", top: 88 }} className="hide-sticky">
            <JourneyBars kills={JOURNEY.map((j) => !!j.kill)} onPick={setPick} picked={pick} />
            <div className="card pad" style={{ marginTop: 12 }}>
              <div className="kicker">Starting context · secondary source</div>
              <div className="st2">
                {[["2024", "+140%", "b"], ["2025", "+96%", "g"]].map(([y, v, t]) => (
                  <div key={y} className="st2-tile" data-tone={t}>
                    <span className="st2-ic">
                      <RiLineChartLine size={16} />
                    </span>
                    <b>{v}</b>
                    <span>Shopify B2B GMV growth, {y}</span>
                  </div>
                ))}
              </div>
              <p className="cap" style={{ marginTop: 12 }}>Uncap, <em>Shopify Statistics 2026</em>. A reason to look, never evidence this gap matters.</p>
            </div>
          </div>
          <div>
            <Tabs className="card" style={{ overflow: "hidden" }} selectedKey={kind} onSelectionChange={(k) => setKind(k as typeof kind)}>
            <div className="flex items-center justify-between gap-3 flex-wrap jl-head">
              <div style={{ maxWidth: "100%", overflowX: "auto", scrollbarWidth: "none" }}>
                <TabList aria-label="Filter the journey log">
                  <Tab id="all" count={JOURNEY.length}>All entries</Tab>
                  <Tab id="wrong" count={JOURNEY.filter((j) => j.kill).length}>Where I was wrong</Tab>
                  <Tab id="kept" count={JOURNEY.filter((j) => !j.kill).length}>What I kept</Tab>
                </TabList>
              </div>
              {pick !== null ? (
                <button className="chip b" style={{ cursor: "pointer" }} onClick={() => setPick(null)} aria-label={`Clear the idea ${pick + 1} filter`}>
                  Idea {String(pick + 1).padStart(2, "0")} ✕
                </button>
              ) : null}
            </div>
            <TabPanel id={kind}>
              {list.map((j, i) => (
                <div key={j.h} style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 16, padding: "18px 20px", borderTop: i ? "1px solid var(--line)" : 0 }}>
                  <span className="kicker" style={{ paddingTop: 3, fontFamily: "JetBrains Mono, monospace" }}>{String(JOURNEY.indexOf(j) + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontWeight: 600, fontSize: 15.5, letterSpacing: "-0.015em", color: j.kill ? "var(--mute)" : "var(--ink)", textDecoration: j.kill ? "line-through" : undefined, textDecorationColor: "#e5a3a3" }}>{j.h}</span>
                      {j.tag ? <span className={cx("chip", j.kill ? "r" : "g")}>{j.tag}</span> : null}
                    </div>
                    <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.6, color: "var(--mute)" }}>{j.b}</p>
                  </div>
                </div>
              ))}
              {list.length === 0 ? <div className="pad kicker">Nothing logged for that filter.</div> : null}
            </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Appendix() {
  const wrong = JOURNEY.filter((j) => j.kill).length;
  const items: { href: string; k: string; ic: ReactNode; t: string; d: string }[] = [
    { href: "#hard", k: "A", ic: <RiQuestionAnswerLine size={20} />, t: "Questions I used to pressure-test the recommendation", d: `${QA.length} hypothetical objections, one function at a time` },
    { href: "#journey", k: "B", ic: <RiTimeLine size={20} />, t: "The discovery log", d: `${JOURNEY.length} entries, ${wrong} of them where I was wrong` },
    { href: "#sources", k: "→", ic: <RiBookOpenLine size={20} />, t: "Every source, linked", d: "Shopify documentation, schema, and public posts" },
  ];
  return (
    <section className="sec apx" id="appendix">
      <div className="wrap">
        <Rv className="apx-c">
          <div className="apx-l">
            <span className="kicker">Appendix</span>
            <h2 className="d2">The working, for anyone who wants to go deeper.</h2>
            <p>The main argument ends with the commitments above. What follows is the supporting work, including the parts where I was wrong.</p>
          </div>
          <nav className="apx-r" aria-label="Appendix contents">
            {items.map((x) => (
              <a key={x.href} className="apx-a" href={x.href}>
                <span className="apx-ic">{x.ic}</span>
                <span className="apx-t">
                  <small>{x.k === "→" ? "Sources" : `Appendix ${x.k}`}</small>
                  <b>{x.t}</b>
                  <span>{x.d}</span>
                </span>
                <RiArrowRightLine size={18} className="apx-go" />
              </a>
            ))}
          </nav>
        </Rv>
      </div>
    </section>
  );
}

export function Author() {
  return (
    <section className="sec" data-sec="author" style={{ paddingTop: 96 }}>
      <div className="wrap">
        <Rv className="closer" id="author">
          <Bands n={12} />
          <div className="closer-c">
            <p>Who wrote this?</p>
            <p className="closer-sub">Praharsha Nelaturi, an M.S. Software Engineering candidate at UC Irvine (expected December 2026) and a Product Manager with 3+ years of experience across 0‑to‑1 B2B products, most recently at Superloopz, an AI-native commerce platform.</p>
            <div className="flex flex-wrap justify-center gap-3" style={{ marginTop: 28 }}>
              <a className="btn btn-dark closer-btn" href="https://www.linkedin.com/in/praharsha-nelaturi/" target="_blank" rel="noreferrer">
                <RiLinkedinFill size={17} />
                LinkedIn
              </a>
              <a className="btn closer-btn closer-btn--light" href="https://mail.google.com/mail/?view=cm&fs=1&to=Praharsha0403@gmail.com" target="_blank" rel="noreferrer">
                <RiMailLine size={17} />
                Mail me
              </a>
            </div>
          </div>
        </Rv>
      </div>
    </section>
  );
}

export function Footer() {
  const A = Ext;
  return (
    <footer className="foot" id="sources">
      <div className="wrap">
        <div className="foot-top">
          <div style={{ display: "contents" }}>
            <div className="d2" style={{ color: "#fafafa", fontSize: "1.9rem" }}>If any claim here is wrong, I'd genuinely like to know.</div>
            <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>
              <strong>Praharsha Nelaturi</strong> · Product case study, November 2026. Written from public sources. I have no affiliation with Shopify and no access to their internal data, which is why section 07 is five investigations rather than a proposal, and why section 03 documents the finding that invalidated my thesis. The correction log in section 01 exists because two claims already were wrong.
            </p>
          </div>
        </div>
        <div className="foot-cols">
          <div>
            <h4>Shopify documentation</h4>
            <ol>
              <li><A href="https://help.shopify.com/en/manual/b2b/getting-started/plan-features">B2B features by plan</A>: the plan matrix, 3-assignment cap, direct catalogs as Plus-only</li>
              <li><A href="https://help.shopify.com/en/manual/b2b/markets/catalogs">B2B catalogs with Markets</A>: <b>the rollout constraint</b>, precedence rules, 25-catalog location limit</li>
              <li><A href="https://help.shopify.com/en/manual/b2b/catalogs">Catalogs and pricing in B2B</A>: the rollout constraint, stated a second time</li>
              <li><A href="https://help.shopify.com/en/manual/b2b/catalogs/creating-catalogs">Customizing B2B pricing using catalogs</A>: third statement; 10,000 catalogs per store</li>
              <li><A href="https://help.shopify.com/en/manual/b2b/companies-and-customers/creating-companies">Creating and managing companies</A>: 50 customers and 25 catalogs per location</li>
              <li><A href="https://help.shopify.com/en/manual/markets/getting-started/market-types">Understanding market types</A>: B2B markets targeting specific company locations</li>
              <li><A href="https://help.shopify.com/en/manual/markets/rollouts/rollout-types">Types of rollouts and changes</A>: Launch, Event, Experiment, catalog activation</li>
              <li><A href="https://help.shopify.com/en/manual/markets/rollouts/requirements-and-considerations">Requirements and considerations for Rollouts</A>: one unended rollout per catalog, market-derived audience, visitor allocation</li>
              <li><A href="https://help.shopify.com/en/manual/markets/rollouts/create-a-rollout">Creating a rollout</A>: multiple catalog changes, scheduled start/end</li>
              <li><A href="https://help.shopify.com/en/manual/b2b/getting-started/features">Overview of B2B features</A> · <A href="https://help.shopify.com/en/manual/markets/getting-started/overview">Overview of markets features</A></li>
            </ol>
          </div>
          <div>
            <h4>Shopify, on the record &amp; schema</h4>
            <ol>
              <li><A href="https://www.shopify.com/pricing">Pricing page</A>: Plus "Starts at $2,300 USD/mo"; <b>per-term prices not published</b></li>
              <li><A href="https://www.shopify.com/news/b2b-for-all">B2B for all</A>, 2 Apr 2026, the plan boundary, DAX and Snyder evidence</li>
              <li><A href="https://www.shopify.com/case-studies/snyder-performance-engineering">Snyder Performance Engineering</A>: 25% back-office reduction, 40% spend increase</li>
              <li><A href="https://www.lego.com">LEGO</A>: set names, numbers, images and retail prices used in the illustrative admin screens. LEGO is a hypothetical merchant here; it is not a Shopify customer</li>
              <li><A href="https://jaysbrickblog.com/news/lego-announces-10497-galaxy-explorer-a-reimagination-of-a-classic-space-icon/">Jay's Brick Blog: LEGO 10497 Galaxy Explorer announcement (US$99.99)</A></li>
              <li><A href="https://www.shopify.com/news/shopify-q3-2026-financial-results">Q3 2026 results</A>: $119.1B GMV, segment context</li>
              <li><A href="https://shopify.dev/docs/api/admin-graphql/latest/interfaces/Catalog">Catalog</A>, <A href="https://shopify.dev/docs/api/admin-graphql/latest/objects/CompanyLocationCatalog">CompanyLocationCatalog</A>, <A href="https://shopify.dev/docs/api/admin-graphql/latest/objects/MarketCatalog">MarketCatalog</A>: the one-field difference</li>
              <li><A href="https://shopify.dev/docs/api/admin-graphql/latest/objects/RolloutCatalogActivateChange">RolloutCatalogActivateChange</A>: <b>catalog: Catalog</b>, the interface · <A href="https://shopify.dev/docs/api/admin-graphql/latest/objects/Rollout">Rollout</A></li>
              <li><A href="https://shopify.dev/docs/apps/build/markets/catalogs">About catalogs in Markets</A>: pricing-priority hierarchy, two-catalog pattern</li>
              <li><A href="https://changelog.shopify.com/posts/schedule-and-test-catalog-changes-with-rollouts">Changelog</A>, 23 Oct 2026, <em>"per market"</em> · <A href="https://shopify.dev/changelog/posts/read_rollouts">Rollouts queries and webhooks</A></li>
            </ol>
          </div>
          <div>
            <h4>Merchants in public, context, rejected</h4>
            <ol>
              <li><A href="https://community.shopify.com/t/managing-b2b-catalog-pricing-any-tools-out-there/258045">EVP</A>, 17 Dec 2024, four catalogs, <b>zero replies</b></li>
              <li><A href="https://community.shopify.com/t/b2b-catalog-price-change-webhook-flow-trigger/722894">lu_judy</A>, 24 Jul 2026, webhook / Flow trigger request</li>
              <li><A href="https://community.shopify.com/t/i-read-109-negative-reviews-of-bulk-price-and-store-credit-apps/730617">Bryce_David</A>, 1 Aug 2026, 109 reviews; plus Ian_Chechin and zhouhua1998071</li>
              <li>UndoB2B, 12 Sep 2026, developer validating a $39/month price-restore app</li>
              <li><A href="https://www.youtube.com/watch?v=YDZ2qvRnj3M">ONHOW Studio</A>, 12 Apr 2026, both methods; scheduling never appears</li>
              <li><b>Secondary, context only:</b> Uncap B2B GMV growth; trade.gov $36T B2B ecommerce; <A href="https://storeleads.app/reports/shopify">Store Leads</A> ~2.82M stores (third-party crawl); a ~12% B2B-share estimate with no published method; Shopify 10-K "millions of merchants"; <A href="https://www.shopify.com/news/ai-commerce-at-scale">agentic commerce</A> and <A href="https://shopify.dev/docs/agents">UCP docs</A>, connection to B2B unverified</li>
              <li><b>Checked and rejected:</b> per-customer pricing as Plus-only; a 10-customer location limit; <b>the "50 markets per store" limit</b>, not on any Shopify page, not used anywhere here</li>
            </ol>
          </div>
        </div>
        <p style={{ marginTop: 48, paddingTop: 20, borderTop: "1px solid #1f1f1f", fontSize: 13, lineHeight: 1.6, color: "#a3a3a3" }}>
          Independent case study by <a href="https://www.linkedin.com/in/praharsha-nelaturi/" target="_blank" rel="noreferrer">Praharsha Nelaturi</a>. Not affiliated with or endorsed by Shopify. · <a href="mailto:pnelatur@uci.edu">pnelatur@uci.edu</a>
        </p>
        <p style={{ marginTop: 8, fontSize: 12, lineHeight: 1.6, color: "#737373" }}>
          Not affiliated with or endorsed by the LEGO Group. Shopify and LEGO are trademarks of their owners. LEGO appears as a hypothetical merchant for recognizability; it is not a Shopify customer. Admin screens are recreations of the 2026 Shopify admin; the retailer, catalogs, contract prices and screen states are invented. Pricing and Help Center images are real screenshots of shopify.com. Charts use BeUI and BoardUI; product scenes use the Stageshow kit; layout follows the Flowpath template. Avatars are illustrative DiceBear "Notionists" (CC0), not likenesses of the people quoted.
        </p>
      </div>
    </footer>
  );
}
