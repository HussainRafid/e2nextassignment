import { APIRes } from "./APITypes"

export interface Customer {
    id:number
    name:string
    city:string
    email:string
    isActive:boolean
    created_at:string
}

export type CustomersRes = APIRes<Customer[]>

export type CustomerRes = APIRes<Customer>