import { APIRes } from "./APITypes"

export interface FileType {
    id:string
    filename:string
    path:string
    size:number
    format:string
    relatedTo:number
    uploaded_at:string
}

export type FilesResponse = APIRes<FileType[]>
export type FileResponse = APIRes<FileType>