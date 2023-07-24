import type { ReactNode } from "react"

type IconHoverEffectType ={
    children: ReactNode
    red?: boolean
}

export const IconHoverEffect = ({children, red=false}:IconHoverEffectType)=>{

    const colorClass = red ? "outline-red-400 hover:bg-red-200 group-hover:bg-red-200 group-focus-visible:bg-red-200 focus-visible:bg-red-200": "outline-gray-400 hover:bg-gray-200 group-hover:bg-gray-200 group-focus-visible:bg-gray-200 focus-visible:bg-gray-200"
    return <div className= {`rounded-full p-2 items-center transition-colors duration-300 ${colorClass}`}>{children}</div>
}