import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryActions } from "@/components/admin/category-actions";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const parentCategories = categories?.filter((c) => !c.parent_id) || [];

  const { data: lotsCount } = await supabase.from("lots").select("category_id");

  const getCategoryCount = (categoryId: string) =>
    lotsCount?.filter((l) => l.category_id === categoryId).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="mt-2 text-muted-foreground">
            Organize your lots by category
          </p>
        </div>
        <CategoryActions parentCategories={parentCategories} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories && categories.length > 0 ? (
          categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary text-2xl">
                      💎
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-semibold">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          /{category.slug}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {category.type}
                      </Badge>
                    </div>
                    {category.description && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                      <span className="text-sm text-muted-foreground">
                        {getCategoryCount(category.id)} lots
                      </span>
                      <CategoryActions category={category} parentCategories={parentCategories} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-muted-foreground">No categories yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
