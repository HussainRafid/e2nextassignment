import Link from "next/link";

export default function Sidebar(){
    return (
        <aside className="border-l border-slate-900/25 h-screen overscroll-y-contain sticky top-0 right-0 w-full">
            <div className="p-7 h-21">
                <h2 className="font-semibold text-2xl">Browse Panel</h2>
            </div>
            <nav className="flex flex-col gap-6 p-7 border-t border-slate-900/25 ">
                <div>
                    <p className="text-sm opacity-50 font-light">Customers</p>
                    <ul className="mt-1">
                        <li>
                            <Link href='/'  className="p-3 rounded-xl bg-slate-900/5 flex items-center gap-2 group hover:bg-slate-900/10 duration-300 ease-out cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <i className="fa-solid fa-users group-hover:text-slate-700 duration-300 ease-out"></i>
                                </div>
                                <div className="group-hover:translate-x-1 duration-300 ease-out">
                                    View Customers
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <p className="text-sm opacity-50 font-light">Panel Users</p>
                    <ul className="mt-1">
                        <li>
                            <Link href='/users' className="p-3 rounded-xl bg-slate-900/5 flex items-center gap-2 group hover:bg-slate-900/10 duration-300 ease-out cursor-pointer">
                                <div className="flex items-center justify-center">
                                    <i className="fa-solid fa-users group-hover:text-slate-700 duration-300 ease-out"></i>
                                </div>
                                <div className="group-hover:translate-x-1 duration-300 ease-out">
                                    Users
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </aside>
    )
}