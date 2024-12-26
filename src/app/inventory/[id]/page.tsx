import { ItemForm } from "@/components/item-form"

export default function EditItemPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">
        {params.id === "new" ? "Add New Item" : "Edit Item"}
      </h1>
      <ItemForm id={params.id} />
    </div>
  )
}

