import axios from "axios";
import Button from "./Button";

export default function logoutAlert({isActive, doCancel}:{isActive:boolean, doCancel: () => void}){
    
    const handleLogout = async () => {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {withCredentials:true})
                    .then(res => {
                        if(res.status === 200){
                            localStorage.removeItem('user')
                            window.location.href = '/login'
                        }
                    }).catch(err => {
                        console.log(err)
                        alert(err.response?.data?.message || "An Error occured")
                    })
    }
    return (<>
        <div onClick={doCancel} className={`z-20 w-screen h-screen block fixed bg-black duration-300 ease-out ${isActive ? 'opacity-30 pointer-events-[all]' : 'opacity-0 pointer-events-none' }`}></div>
        <div className={`w-1/2 bg-[var(--background)]  rounded-lg border border-slate-900/20 fixed inset-0 m-auto h-fit z-50 duration-300 ease-out ${isActive ? 'translate-y-0 opacity-100 pointer-events-[all]' : 'translate-y-5 opacity-0 pointer-events-none'}`}>
            <div className="text-center  border-b w-full border-slate-900/20 p-4 flex flex-col justify-center items-center gap-1">
                <div className="w-12 h-12 flex items-center justify-center bg-[var(--error)] rounded-md p-2">
                    <i className="fa-solid fa-triangle-exclamation text-[var(--background)] text-2xl"></i>
                </div>
                <h1 className="text-xl font-semibold">Warning, You're logging out</h1>
                <p className="text-sm opacity-80">You're about to log out of your account, You'll have to login again to use this account, are you sure you want to continue</p>
            </div>
            <div className="flex justify-center gap-2 p-2 ">
                <Button  text="Yes, Logout" status="error" action={handleLogout} />
                <Button  text="No, Cancel" action={doCancel} />
            </div>
        </div>
        </>
    )
}