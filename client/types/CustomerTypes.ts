export interface CustomerType {
    id:number
    name:string
    city:string
    email:string
    isActive:boolean
    created_at:string
}

export interface infoListType {
    label:string
    key:keyof CustomerType
    icon:string
  }
  

