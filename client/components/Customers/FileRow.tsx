'use client'
import { formatDateToDDMMYYYY } from "@/utils/formatDate";
import Button from "../Button";
import { useState } from "react";
import axios from "axios";

interface propsType {
    id:string,
    filename:string,
    size:number,
    format:string, 
    uploadedDate:string
}
export default function FileRow({filename, uploadedDate, size, format, id}: propsType) {
    const [isDownloading, setIsDownloading] = useState<boolean>(false)

    const handleDownload = async () => {
        const link = document.createElement('a')
        link.href = `${process.env.NEXT_PUBLIC_API_URL}/customers/files/${id}`
        link.click()
    }
    return (
        <div className="flex items-center justify-between py-3 border-y border-slate-800/15 px-2">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center bg-cyan-800/10 w-10 h-10 rounded-md">
                    <i className="fa-solid fa-file text-[var(--primary)] text-xl"></i>
                </div>
                <div>
                    <h2 className="font-semibold">{filename}</h2>
                    <p className="text-sm opacity-75">Uploaded on {formatDateToDDMMYYYY(uploadedDate)}, format: {format}</p>
                </div>
            </div>
            <div>
                <Button 
                action={handleDownload}
                text={isDownloading ? "Downloading File..." : `Download, ${Math.ceil(size/1024)}kb`} 
                isDisabled={isDownloading} />
            </div>
        </div>
    )
}