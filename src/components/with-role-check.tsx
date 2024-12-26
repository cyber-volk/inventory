"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

type Role = "admin" | "manager" | "warehouse"

export function withRoleCheck(WrappedComponent: React.ComponentType, allowedRoles: Role[]) {
  return function WithRoleCheck(props: any) {
    const [isAuthorized, setIsAuthorized] = useState(false)
    const router = useRouter()

    useEffect(() => {
      const userString = localStorage.getItem("user")
      if (!userString) {
        router.push("/login")
        return
      }

      const user = JSON.parse(userString)
      if (!allowedRoles.includes(user.role)) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this page.",
          variant: "destructive",
        })
        router.push("/")
      } else {
        setIsAuthorized(true)
      }
    }, [router])

    if (!isAuthorized) {
      return null // or a loading spinner
    }

    return <WrappedComponent {...props} />
  }
}

