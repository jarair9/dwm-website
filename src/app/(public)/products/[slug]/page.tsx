import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BackButton } from "@/components/layout/back-button";
import { Badge } from "@/components/ui/badge";
import { ImageGallery } from "@/components/auction/image-gallery";
import { ContactModal } from "@/components/product/contact-modal";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("lots")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  const category = product.categories as { name: string; slug: string } | null;

  return (
    <>
      <Navbar />
      <BackButton />
      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 pt-24 lg:pt-20">
          <nav className="mb-8 text-sm text-muted-foreground">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>{category?.name || "Products"}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left — Images */}
            <div>
              <ImageGallery
                images={product.images || []}
                name={product.name}
                status="available"
              />

              {/* Description below image */}
              {product.description && (
                <div className="mt-8">
                  <h2 className="font-serif text-xl font-semibold text-foreground">
                    Description
                  </h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Right — Product Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                {category && <Badge variant="outline">{category.name}</Badge>}
                <Badge variant="secondary">For Sale</Badge>
              </div>

              <h1 className="font-serif text-4xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-6 rounded-2xl border border-border/50 p-6">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="mt-1 font-serif text-4xl font-bold text-foreground">
                  ${product.starting_bid.toLocaleString()}
                </p>
              </div>

              {/* Product Details */}
              <div className="mt-8 space-y-4 rounded-2xl border border-border/50 p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Product Details
                </h3>
                <div className="space-y-3">
                  {category && (
                    <div className="flex justify-between border-b border-border/50 pb-3">
                      <span className="text-sm text-muted-foreground">Category</span>
                      <span className="text-sm font-medium text-foreground">{category.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-border/50 pb-3">
                    <span className="text-sm text-muted-foreground">Availability</span>
                    <span className="text-sm font-medium text-foreground">In Stock</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-3">
                    <span className="text-sm text-muted-foreground">Certified</span>
                    <span className="text-sm font-medium text-foreground">Yes</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-3">
                    <span className="text-sm text-muted-foreground">Authenticity</span>
                    <span className="text-sm font-medium text-foreground">GIA Verified</span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-3">
                    <span className="text-sm text-muted-foreground">Shipping</span>
                    <span className="text-sm font-medium text-foreground">Insured &amp; Tracked</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Returns</span>
                    <span className="text-sm font-medium text-foreground">14-Day Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              <div className="mt-6">
                <ContactModal
                  productName={product.name}
                  productPrice={product.starting_bid}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
