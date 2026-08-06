import { Audience } from "@/components/audience";
import { FeedbackPreview } from "@/components/feedback-preview";
import { Footer, WaitlistCta } from "@/components/waitlist-cta";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";
import { PracticeModes } from "@/components/practice-modes";
import { Problem } from "@/components/problem";
import { WhyWaitlist } from "@/components/why-waitlist";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Audience />
        <Problem />
        <PracticeModes />
        <FeedbackPreview />
        <WhyWaitlist />
        <WaitlistCta />
      </main>
      <Footer />
    </>
  );
}
