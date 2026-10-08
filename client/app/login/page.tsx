'use client'

import Image from "next/image";
import Form from 'next/form'
import Button from "@/components/Button";
import { useState } from "react";
import { UserLoginRequest } from "@/types/User";
import axios from "axios";

export default function Home() {

    
    const [data, setData] = useState<UserLoginRequest>({
        email:"",
        password:""
    })
    const [isLogging, setIsLogging] = useState<boolean>(false)


    const handleLogin = async () => {
        setIsLogging(true)
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, data, {withCredentials:true})
                .then(res => {
                    if(res.status == 200){
                        console.log(res)
                        const userInfo = res.data.data 
                        localStorage.setItem('user', userInfo.email)
                        alert("User Logged In!")
                        window.location.href = '/'
                    }
                })
                .catch(err => {
                    alert(err.response?.data?.message || "An error occured while logging in")
                })
                .finally(() => setIsLogging(false))
    }
  return (
    <main className="grid grid-cols-[6fr_4fr] gap-5 h-screen">
        <div className="w-full h-full relative">
            <Image 
            className="object-cover align-middle"
            alt="Background Image" 
            loading="lazy" 
            src={'/background.webp'} 
            fill={true}/>
        </div>
        <div className="py-20 px-10">
            <h1 className="text-4xl font-semibold">Login To Your Account</h1>
            <Form action={'/login'} className="mt-10 flex flex-col gap-5">
                <div className="flex flex-col">
                    <label 
                    htmlFor="email" 
                    className="text-base opacity-75">Email Address</label>
                    <input 
                    value={data.email}
                    onChange={e => {setData(d => {
                        return {...d, email:e.target.value}
                    })}}
                    name="email" 
                    type="text"
                    className="border border-slate-900/25 outline-none p-2 mt-1 rounded-md duration-300 ease-in hover:border-slate-900/50" />
                </div>
                <div className="flex flex-col">
                    <label 
                    htmlFor="password" 
                    className="text-base opacity-75">Password</label>
                    <input 
                    value={data.password}
                    onChange={e => {
                        setData(d => {
                            return {...d, password:e.target.value}
                        })
                    }}
                    name="password" 
                    type="password"
                    className="border border-slate-900/25 outline-none p-2 mt-1 rounded-md duration-300 ease-in hover:border-slate-900/50" />
                </div>
                <div>
                    <Button isDisabled={isLogging} text={isLogging ? "Loading..." : "Login"} action={handleLogin}  />
                </div>
            </Form>
        </div>
    </main>
  );
}
