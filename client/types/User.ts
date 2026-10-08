export interface User {
    id:number
    email:string
    password:string
    type:'admin' | 'staff'
    isDeactivated?:boolean
    created_at:string
}
export interface UserLoginRequest {
    email:string
    password:string
}