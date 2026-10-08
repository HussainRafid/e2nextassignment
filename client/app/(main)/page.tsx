'use client'
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import axios from 'axios'
import { CustomerType } from "@/types/CustomerTypes";
import ActivityLabel from "@/components/Customers/ActivityLabel";
import { formatDateToDDMMYYYY } from "@/utils/formatDate";
import Loading from "@/components/Loading";
import NoResult from "@/components/NotResult";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true) 
  const [data, setData] = useState<CustomerType[]>([])
  const [step, setStep] = useState<number>(0)
  const [hasMoreCustomers, setHasMoreCustomers] = useState(true)
  const [search, setSearch] = useState<string>('')
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [msg, setMsg] = useState<string | null>(null)


  // this value is used to get a fixed value of the search for error messages, and it does not change
  // with the search input field 
  const [searchedVal, setSearchedVal] = useState<string>('')


  const loadData = async (s:number, search?:string, resetData?:boolean, signal?:AbortSignal) => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers`, 
      {withCredentials:true, 
      params: {
        step:s,
        search
      }})
        .then(res => {
          const rows = res.data.data.map((item: CustomerType) => ({
            ...item,
            created_at: formatDateToDDMMYYYY(item.created_at),
          }))
          setData(d => (resetData || s === 0 ? rows : [...d, ...rows]))
          if(res.data.data.length < 20) setHasMoreCustomers(false)
          setIsLoading(false)
          setIsSearching(false)
        })
        .catch(err => {
          console.log(err)
          setMsg(err.response?.data?.message || "An error has occured")
          setIsLoading(false)
          setIsSearching(false)
        })
  }

  useEffect(() => {
    const controller = new AbortController()
    loadData(step, undefined, false, controller.signal)
    return () => controller.abort()   // cancels the first Strict Mode run
  }, [step])

  const handleSearch = async () => {
    setIsSearching(true)
    setSearchedVal(search)
    loadData(0, search, true)
    if(search === ''){
      setHasMoreCustomers(true)
    }else {
      setHasMoreCustomers(false)
    }
  }
  return(
    <main>
     <div className="page-content-container">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Browse Customers Records</h1>
        <p>{data.length} Results</p>
      </div>
        <div className="mt-10">

          {/* searchbar */}
          <div className="flex gap-2 items-end">
            <div className="w-full">
              <label className="opacity-75" htmlFor="search">Search by name or Email</label>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="search..."
              className="py-3 px-2 text-sm outline-0 rounded-md bg-slate-900/5 border  border-slate-900/25 block w-full duration-300 ease-out hover:bg-slate-900/10 focus:border-[var(--primary)]"  
              name="search" type="text" />
            </div>
            <div>
              <Button isDisabled={isSearching} text={isSearching ? "Searching..." : "Search"} 
              icon="fa-solid fa-magnifying-glass" 
              action={handleSearch} />
            </div>
          </div>


          {/* table  */}
          {
            isLoading ? <Loading /> : data.length === 0 ? 
            <NoResult title={msg || `Oops, No Results Found for ${searchedVal}`} message="It seems like there are no results for your search, please try searching something else" /> : 
            (<>
              <table className="mt relative mt-4 w-full bg-[var(--background-500)] p-4 rounded-xl contain-paint">
                <thead className="sticky top-0 border-slate-900 border-b left-0 w-full bg-[var(--background-500)]">
                  <tr className="!text-left border border-slate-950/20">
                    <th className="p-5">Name</th>
                    <th className="p-5">Email Address</th>
                    <th className="p-5">City</th>
                    <th className="p-5">Status</th>
                    <th className="p-5">Creation Date</th>
                    <th className="p-5">Options</th>
                  </tr>
                </thead>
                <tbody className="border-x-slate-900/25 border">
                  {
                    data.map((customer: CustomerType, i:number) => {
                      return (
                        <tr className="py-2 odd:bg-slate-900/5" key={i}>
                          <td className="p-5">{customer.name}</td>
                          <td className="p-5">{customer.email}</td>
                          <td className="p-5">{customer.city}</td>
                          <td className="p-5">
                            <ActivityLabel isActive={customer.isActive} />
                          </td>
                          <td className="p-5">{customer.created_at}</td>
                          <td className="p-5">
                              <Button text="Details" action={() => {
                                window.location.href = `/customers/${customer.id}`
                              }} />
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              {
                hasMoreCustomers ? (
                    <div className="mt-3">
                      <Button text="Load More Customers" action={() => {
                        setStep(s => {return s + 1})
                      }} />
                    </div>
                ) : null
              }
            </>
            )
          }
        </div>
     </div>
    </main>
  );
}
