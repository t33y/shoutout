import { VscLoading } from "react-icons/vsc";


export function LoadingSpinner ({big = false}:{big ?: boolean}){
    const sizeClasses = big? "w-16 h-16" : "w-8 h-8";

    return <div className=" flex justify-center p-2">
        < VscLoading className= {`animate-spin ${sizeClasses}`} />
    </div>
}