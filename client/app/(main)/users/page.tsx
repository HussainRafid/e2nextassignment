'use client'
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import axios from 'axios'
import type { User } from "@/types/User";
import { formatDateToDDMMYYYY } from "@/utils/formatDate";
import Loading from "@/components/Loading";
import NoResult from "@/components/NotResult";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true) 
  const [data, setData] = useState<User[]>([])
  const [msg, setMsg] = useState<string | null>(null)

  const loadData = async () => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {withCredentials:true})
        .then(res => {
          setData(res.data.data)
          setIsLoading(false)
        })
        .catch(err => {
          console.log(err)
          setIsLoading(false)
        })
  }
  
  useEffect(() => {
    if(isLoading){
      loadData()
    }
  }, [isLoading])



  const handleToggle = async (id:number) => {
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/auth/${id}/toggle`, {}, {withCredentials:true})
                .then(res => {
                    if(res.status === 200){
                        window.location.reload()
                    }
                })
                .catch(err => {
                    console.log(err.response)
                    alert(err.response?.data?.message || "An Error Occured while changing activation status")
                    setMsg(err.response?.data?.message || "An Error Occured while changing activation status")
                })
  }
  return(
    <main>
     <div className="page-content-container">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Browse Panel Users</h1>
      </div>
        <div className="mt-10">

          {/* table  */}
          {
            isLoading ? <Loading /> : data.length === 0 ? 
            <NoResult title={msg || `Oops, No Users Found`} message="It seems like there are no results" /> : 
            (<>
              <table className="mt relative mt-4 w-full bg-[var(--background-500)] p-4 rounded-xl contain-paint">
                <thead className="sticky top-0 border-slate-900 border-b left-0 w-full bg-[var(--background-500)]">
                  <tr className="!text-left border border-slate-950/20">
                    <th className="p-5">ID</th>
                    <th className="p-5">Email Address</th>
                    <th className="p-5">Role</th>
                    <th className="p-5">Created At</th>
                    <th className="p-5">Options</th>
                  </tr>
                </thead>
                <tbody className="border-x-slate-900/25 border">
                  {
                    data.map((user: User, i:number) => {
                      return (
                        <tr className={`py-2 odd:bg-slate-900/5 ${user.type === 'admin' ? 'opacity-60 pointer-events-all' : ''}`} key={i}>
                          <td className="p-5">{user.id}</td>
                          <td className="p-5">{user.email}</td>
                          <td className="p-5">{user.type}</td>
                          <td className="p-5">{formatDateToDDMMYYYY(user.created_at)}</td>
                          <td className="p-5">
                              <Button 
                              icon={user.isDeactivated ? "fa-solid fa-check" : 'fa-solid fa-hand'}
                              status={user.isDeactivated ? "primary" : 'error'}
                              text={user.isDeactivated ? "Activate User" : 'Deactivate User'} 
                              action={() => handleToggle(user.id)} />
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </>
            )
          }
        </div>
     </div>
    </main>
  );
}
