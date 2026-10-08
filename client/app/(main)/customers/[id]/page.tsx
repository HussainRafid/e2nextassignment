import FileRow from "@/components/Customers/FileRow"
import UploadFileButton from "@/components/Customers/UploadButton"
import NoResult from "@/components/NotResult"
import type{ CustomerType, infoListType } from "@/types/CustomerTypes"
import { FileType } from "@/types/FileType"
import { cookies } from "next/headers"
import { formatDateToDDMMYYYY } from "@/utils/formatDate"
import axios from "axios"

export default async function CustomerPage({params}: { params: Promise<{ id: string }>}) {
  const { id } = await params
  
  
  const cookieStore = await cookies()
  const headers = { Cookie: cookieStore.toString() }
  
  var message: string = 'an error occured'
  var customerData: CustomerType | null = null
  var customerFiles: FileType[] = []
  try {
    const resData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {headers})
    const filesData = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}/upload`, {headers})
    const resCustomerData = resData.data.data
    customerData = {
        ...resCustomerData,
        created_at: formatDateToDDMMYYYY(resCustomerData.created_at)
    }

    customerFiles = filesData.data.data
  }catch(err: any){
    console.log(err)
    if(axios.isAxiosError(err)){
        message = err.response?.data?.message || "An error has occured"
    }
  }

   const infoList:infoListType[] = [
    {
        label:"City",
        key:"city",
        icon:"fa-solid fa-landmark",
    },
    {
        label:"Email Address",
        key:"email",
        icon:"fa-solid fa-envelope",
    },
    {
        label:"Activity Status",
        key:"isActive",
        icon:"fa-solid fa-certificate",
    },
    {
        label:"Created At",
        key:"created_at",
        icon:"fa-solid fa-calendar",
    
    },
  ]

  const formatValue = (key: keyof CustomerType, value: CustomerType[keyof CustomerType]) => {
    if (key === "isActive") return value ? "Active" : "Inactive"
    return String(value ?? "-")
    }
  return (
    <div className="page-content-container">
        {!customerData ? <NoResult title={message} /> : <>
        <div>
            <h1 className="text-4xl font-semibold">{customerData.name} Details</h1>
            <div className="grid grid-cols-4 mt-4 gap-4">
                {
                    infoList.map((item:infoListType, i:number) => {
                        return (
                            <div key={i} className="flex items-center gap-2 border border-slate-900/20 p-2 rounded-md">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-md bg-cyan-500/10`}>
                                    <i className={`text-xl opacity-75 ${ item.icon} text-[var(--primary)]`}></i>
                                </div>
                                <div>
                                    <p className="text-sm opacity-65">{item.label}</p>
                                    <p className="text-base font-semibold">
                                          {customerData ? formatValue(item.key, customerData[item.key]) : ''}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        <div className="mt-5 pt-5 border-t border-slate-800/25">
            <h2 className="font-semibold text-2xl">Customer's Media</h2>
            <UploadFileButton customerId={id} />
            <div className="mt-2">
                {
                    !customerFiles || customerFiles.length === 0 ? 'No Files Uploaded' : customerFiles.map((file:FileType, i:number) => {
                        return (
                            <FileRow 
                            key={i} 
                            filename={file.filename} 
                            size={file.size} 
                            format={file.format} 
                            uploadedDate={file.uploaded_at}
                            id={file.id}
                             />
                        )
                    })
                }
            </div>
        </div>
        </>}
    </div>
  )
}