import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrendingSection } from "@/components/TrendingSection";
import { NewsSection } from "@/components/NewsSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrendingSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
