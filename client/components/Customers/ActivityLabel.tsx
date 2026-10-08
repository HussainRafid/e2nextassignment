export default function ActivityLabel({isActive} : {isActive: boolean}){
    return <div className={`border  rounded-md px-3 py-1 text-center 
        
    ${isActive ? 'text-emerald-700 border-emerald-500 bg-emerald-500/20' : 
    'text-red-700 border-red-500 bg-red-500/20'}`}>
            {isActive ? 'Active' : "Inactive"}
        </div>
}