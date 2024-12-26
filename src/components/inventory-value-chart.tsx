"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", value: 100000 },
  { month: "Feb", value: 120000 },
  { month: "Mar", value: 130000 },
  { month: "Apr", value: 140000 },
  { month: "May", value: 150000 },
  { month: "Jun", value: 160000 },
]

export function InventoryValueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  )
}

