import Navbar from "@/components/Layout/Navbar";
import Sidebar from "@/components/Layout/Sidebar";
import { cookies } from "next/headers"
import { redirect } from "next/navigation";


export default async function RootLayout({ children }: LayoutProps<"/">) {

   const cookieStore = await cookies()
    if (!cookieStore.get("token")) {
      redirect("/login")
    }
  return (
    <div className="grid grid-cols-[8fr_2fr]">
      <div>
          <Navbar />
          {children}
        </div>
        <div className="relative">
          <Sidebar/> 
        </div>
    </div>
  );
}
