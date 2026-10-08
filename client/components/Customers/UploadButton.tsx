'use client'

import { useState } from "react"
import Button from "../Button"
import axios from "axios"

export default function UploadFileButton({customerId}: {customerId:string}) {
    
      const [uploadedFile, setUploadedFile] = useState<File | null>(null)
      const [isUploading, setIsUploading] = useState<boolean>(false)
      const maxSize = 5 * 1024 * 1024
      function handleFile(e: React.ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            if(e.target.files[0].size > maxSize){
                alert("File Is Too Large, Maximum size is 5MB")
            }else {
                setUploadedFile(e.target.files[0])
            }
        }
      }

      async function handleUpload(){
        if(uploadedFile){
            setIsUploading(true)
            const formData = new FormData()
            formData.append('file', uploadedFile)
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}/upload`, formData, {withCredentials:true})
                        .then(res => {
                            if(res.data.status === 201){
                                alert("File Uploaded Successfully")
                                window.location.reload()
                            }
                        })
                        .catch(err => {
                            console.log(err)
                            alert("An error occurred")
                        })
                        .finally(() => {
                            setIsUploading(false)
                        })
        }
      }
    return (
        <div className="relative w-fit">
            <input name="file" type="file" onChange={handleFile} className="w-full absolute top-0 right-0 opacity-0 z-10 cursor-pointer" />
            <p>Or <span className="text-[var(--primary)] underline">{uploadedFile ? `File ${uploadedFile.name} Uploaded! Click to replace it` : 'Upload a new File'}</span></p>
            {
                uploadedFile ? (
                    <div className="mt-2">
                        <Button 
                        action={handleUpload} 
                        text={isUploading ? 'Uploading...' : "Upload"} 
                        icon="fa-solid fa-upload" 
                        isDisabled={isUploading} />
                    </div>
                ) : null
            }
        </div>
    )
}