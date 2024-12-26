import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryValueChart } from "@/components/inventory-value-chart"
import { TopSellingItemsChart } from "@/components/top-selling-items-chart"
import { StockTurnoverChart } from "@/components/stock-turnover-chart"

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Analytics & Reports</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Value Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryValueChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <TopSellingItemsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock Turnover Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <StockTurnoverChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

