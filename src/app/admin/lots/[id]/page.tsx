import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LotForm } from "@/components/admin/lot-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditLotPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const is_new = id === "new";

  let lot = null;
  if (!is_new) {
    const result = await supabase.from("lots").select("*").eq("id", id).single();
    lot = result.data;
    if (!lot) notFound();
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
        {is_new ? "Create New Lot" : `Edit: ${lot?.name}`}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {is_new
          ? "Add a new specimen to the auction"
          : "Update lot details and settings"}
      </p>

      <div className="mt-8">
        <LotForm lot={lot || undefined} categories={categories || []} />
      </div>
    </div>
  );
}
