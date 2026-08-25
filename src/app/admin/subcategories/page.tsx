import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryActions } from "@/components/admin/category-actions";

export default async function AdminSubcategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const parentCategories = categories?.filter((c) => !c.parent_id) || [];
  const subcategories = categories?.filter((c) => c.parent_id) || [];

  const getParentName = (parentId: string) =>
    parentCategories.find((p) => p.id === parentId)?.name || "Unknown";

  const { data: lotsCount } = await supabase.from("lots").select("category_id");

  const getCategoryCount = (categoryId: string) =>
    lotsCount?.filter((l) => l.category_id === categoryId).length || 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Subcategories
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage subcategories under parent categories
          </p>
        </div>
        <CategoryActions parentCategories={parentCategories} />
      </div>

      {/* Parent Categories Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Parent Categories</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {parentCategories.map((cat) => {
            const subCount = subcategories.filter((s) => s.parent_id === cat.id).length;
            return (
              <div
                key={cat.id}
                className="flex items-center gap-3 rounded-xl border border-border/50 p-4"
              >
                {cat.image_url ? (
                  <img src={cat.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg">💎</div>
                )}
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{subCount} subcategories</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subcategories List */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">All Subcategories</h2>
        {subcategories.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {sub.image_url ? (
                      <img src={sub.image_url} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary text-xl">💎</div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-serif text-lg font-semibold">{sub.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">/{sub.slug}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">{sub.type}</Badge>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Parent: {getParentName(sub.parent_id!)}
                      </p>
                      {sub.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{sub.description}</p>
                      )}
                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                        <span className="text-sm text-muted-foreground">
                          {getCategoryCount(sub.id)} lots
                        </span>
                        <CategoryActions category={sub} parentCategories={parentCategories} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-muted-foreground">No subcategories yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create a category and select a parent to make it a subcategory
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
