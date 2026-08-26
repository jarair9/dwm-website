import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { CategoryActions } from "@/components/admin/category-actions";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  const allCategories = categories || [];
  const parentCategories = allCategories.filter((c) => !c.parent_id);
  const subCategories = allCategories.filter((c) => c.parent_id);

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

      <div className="mt-8 space-y-4">
        {parentCategories.length > 0 ? (
          parentCategories.map((parent) => {
            const children = subCategories.filter(
              (s) => s.parent_id === parent.id
            );
            const totalLots =
              getCategoryCount(parent.id) +
              children.reduce(
                (sum, child) => sum + getCategoryCount(child.id),
                0
              );

            return (
              <div
                key={parent.id}
                className="rounded-xl border border-border/50 bg-white"
              >
                {/* Parent row */}
                <div className="flex items-center gap-4 p-5">
                  {parent.image_url ? (
                    <img
                      src={parent.image_url}
                      alt={parent.name}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary text-xl">
                      {parent.type === "mineral" ? "🪨" : "💎"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-serif text-lg font-semibold truncate">
                        {parent.name}
                      </h3>
                      <Badge variant="outline" className="capitalize shrink-0">
                        {parent.type}
                      </Badge>
                      {children.length > 0 && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {children.length} sub
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {totalLots} lots
                      {children.length > 0 &&
                        ` \u00B7 ${children.length} subcategories`}
                    </p>
                  </div>
                  <CategoryActions
                    category={parent}
                    parentCategories={parentCategories}
                  />
                </div>

                {/* Children rows */}
                {children.length > 0 && (
                  <div className="border-t border-border/50">
                    {children.map((child, i) => (
                      <div
                        key={child.id}
                        className={`flex items-center gap-4 px-5 py-3 ml-12 ${
                          i < children.length - 1 ? "border-b border-border/30" : ""
                        }`}
                      >
                        {child.image_url ? (
                          <img
                            src={child.image_url}
                            alt={child.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm">
                            {parent.type === "mineral" ? "🪨" : "💎"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {child.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryCount(child.id)} lots
                          </p>
                        </div>
                        <CategoryActions
                          category={child}
                          parentCategories={parentCategories}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-border/50 bg-secondary/30 py-16 text-center">
            <p className="text-muted-foreground">No categories yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
