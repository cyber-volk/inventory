import { NextRequest, NextResponse } from "next/server"
import { db } from '../lib/db'

export async function activityLogger(req: NextRequest) {
  const user = req.headers.get("x-user")
  const path = req.nextUrl.pathname
  const method = req.method

  if (user) {
    await db.userActivity.create({
      data: {
        userId: user,
        action: `${method} ${path}`,
        timestamp: new Date(),
      },
    })
  }

  return NextResponse.next()
}
