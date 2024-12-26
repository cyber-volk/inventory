"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { category: "Electronics", turnover: 5.2 },
  { category: "Clothing", turnover: 4.8 },
  { category: "Books", turnover: 3.5 },
  { category: "Home & Garden", turnover: 2.9 },
  { category: "Toys", turnover: 4.1 },
]

export function StockTurnoverChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="turnover" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  )
}

