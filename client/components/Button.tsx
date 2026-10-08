'use client'

import type ButtonProps from '@/types/ButtonType'


const bgColors = {
    primary:"bg-[var(--primary)] hover:bg-slate-700",
    error:"bg-[var(--error)] hover:bg-red-700",
    accent:"bg-emerald-500"
}
export default function Button({text, action, status = 'primary', type = 'submit', icon, isDisabled}: ButtonProps){
    return( 
    <button
    type={type}
     onClick={e => {
        e.preventDefault()
        action && !isDisabled ? action() : null
     }} 
     className={`duration-300 ease-out py-3 px-4 text-sm rounded-md text-[var(--background)] flex items-center gap-2 justify-center cursor-pointer
     ${isDisabled ? 'opacity-50 cursor-default pointer-events-none' : ''} ${bgColors[status]}`}>
        {
            icon ? (
            <div>
                <i className={icon}></i>
            </div>  ) : null
        }
        <div>
            {text}
        </div>
    </button>
    )
}