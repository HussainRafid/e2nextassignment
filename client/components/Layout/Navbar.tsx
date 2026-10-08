'use client'
import { useEffect, useState } from "react";
import Button from "../Button";
import LogoutAlert from '../LogoutAlert'

export default function Navbar(){

     const [email, setEmail] = useState<string>("Email")
    const [isAlertActive, setIsAlertActive] = useState<boolean>(false)

    useEffect(() => {
        setEmail(localStorage.getItem('user') || "Email")
    }, [])
    return (
        <>
        <LogoutAlert isActive={isAlertActive} doCancel={() => {setIsAlertActive(false)}} />
        <header className="py-4 h-21 border-b border-slate-900/25">
            <div className="container flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                        <i className="fa-solid fa-circle-user text-slate-700 text-3xl"></i>
                    </div>
                    <div>
                        {email}
                    </div>
                </div>
                <div>
                    <Button text="Logout" icon="fa-solid fa-arrow-right-from-bracket" status="error" action={() => {
                        setIsAlertActive(true)
                    }} />
                </div>
            </div>
        </header>
        </>
    )
}