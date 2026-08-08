import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { PracticeModes } from "@/components/practice-modes";
import { BeyondGrammar } from "@/components/beyond-grammar";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <PracticeModes />
        <BeyondGrammar />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
