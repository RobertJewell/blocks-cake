import { MiddlewareDemo } from "@/components/demo";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { NavigationBar } from "@/components/navigation";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        <HeroSection />
        <MiddlewareDemo />
      </main>
      <Footer />
    </div>
  );
}
