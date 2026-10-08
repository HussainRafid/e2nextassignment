import { APIRes } from "./APITypes"

export interface UserType {
    id:number
    email:string
    password:string
    type:'admin' | 'staff'
    isDeactivated?:boolean
    created_at:string
}

export type UsersRes = APIRes<UserType[]>
export type UserRes = APIRes<UserType>