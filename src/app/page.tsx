import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { LiveAuctions } from "@/components/home/live-auctions";
import { FeaturedSpecimens } from "@/components/home/featured-specimens";
import { StorySection } from "@/components/home/story-section";
import { Categories } from "@/components/home/categories";
import { AuctionLinks } from "@/components/home/auction-links";
import { CTASection } from "@/components/home/cta-section";
import { Testimonials } from "@/components/home/testimonials";
import { JsonLd } from "@/components/seo/json-ld";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const cats =
    categories?.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      type: cat.type,
      imageUrl: cat.image_url,
    })) || [];

  return (
    <>
      <JsonLd />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LiveAuctions />
        <AuctionLinks />
        <FeaturedSpecimens />
        <StorySection />
        <Categories categories={cats} />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
