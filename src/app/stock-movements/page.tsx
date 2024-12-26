import { DataTable } from "@/lib/components/data-table"
import { columns } from "./columns"

async function getData() {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      type: "PURCHASE",
      itemName: "Item 1",
      quantity: 100,
      date: "2023-05-01",
    },
    // ... more stock movements
  ]
}

export default async function StockMovementsPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Stock Movements</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
