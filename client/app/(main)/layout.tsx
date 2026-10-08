import AuthGate from "@/components/Layout/AuthGate";
import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import { Suspense } from "react"

export default async function RootLayout({ children }: LayoutProps<"/">) {

  return (
    <div className="grid grid-cols-[8fr_2fr]">
      <div>
          <Navbar />
          <Suspense fallback={null}>
            <AuthGate>{children}</AuthGate>
          </Suspense>
        </div>
        <div className="relative">
          <Sidebar/> 
        </div>
    </div>
  );
}
