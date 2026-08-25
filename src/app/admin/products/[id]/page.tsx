import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (id === "new") {
    return (
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">New Product</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a mineral or gemstone for direct sale
        </p>
        <div className="mt-8">
          <ProductForm categories={categories || []} />
        </div>
      </div>
    );
  }

  const { data: product } = await supabase
    .from("lots")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-foreground">Edit Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      <div className="mt-8">
        <ProductForm product={product} categories={categories || []} />
      </div>
    </div>
  );
}
