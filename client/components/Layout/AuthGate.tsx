import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AuthGate({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  if (!cookieStore.get("token")) redirect("/login")
  return <>{children}</>
}