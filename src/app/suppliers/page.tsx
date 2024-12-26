import { DataTable } from "@/lib/components/data-table"
import { columns } from "./columns"
import { withRoleCheck } from "@/lib/components/with-role-check"

async function getData() {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Acme Corp",
      contact: "John Doe",
      email: "john@acme.com",
      phone: "123-456-7890",
    },
    // ... more suppliers
  ]
}

function SuppliersPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Suppliers</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

export default withRoleCheck(SuppliersPage, ["admin", "manager"])
