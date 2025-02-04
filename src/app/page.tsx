import Features from "@/components/Features";
import HeroSection from "@/components/HeroSection";
import Stats from "@/components/Stats";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
    <div className="grid-background">
    </div>
    <div className="w-full absolute top-0 left-0">
      <HeroSection />
      <Features />
      <Stats />
    </div>
    </div>
  )
}
