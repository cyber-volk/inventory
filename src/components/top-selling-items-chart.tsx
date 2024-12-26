"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { name: "Item A", sales: 400 },
  { name: "Item B", sales: 300 },
  { name: "Item C", sales: 200 },
  { name: "Item D", sales: 150 },
  { name: "Item E", sales: 100 },
]

export function TopSellingItemsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sales" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  )
}

