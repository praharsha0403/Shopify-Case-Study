import { HowItEnded, Hero, Manifesto, Nav, Overview, Proof, ShortVersion, StartedLanded } from "@/sections/Top";
import { SectionFinding, SectionToday, SectionWorkaround } from "@/sections/Core";
import { SectionBuild, SectionWho, SectionWhy } from "@/sections/Middle";
import { Appendix, Author, Footer, SectionCommit, SectionHard, SectionJourney, SectionProve, SectionShip } from "@/sections/End";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Proof />
        <Manifesto />
        <Overview />
        <ShortVersion />
        <StartedLanded />
        <HowItEnded />
        <SectionToday />
        <SectionFinding />
        <SectionWorkaround />
        <SectionWho />
        <SectionWhy />
        <SectionBuild />
        <SectionProve />
        <SectionShip />
        <SectionCommit />
        <Appendix />
        <SectionHard />
        <SectionJourney />
        <Author />
      </main>
      <Footer />
    </>
  );
}
