import { signIn, signOut, useSession } from 'next-auth/react'
import Link  from 'next/link'
import { IconHoverEffect } from './IconHoverEffect';
import { VscAccount, VscHome, VscSignIn, VscSignOut } from 'react-icons/vsc';


export function SideNav(){
    const session = useSession()
    const user = session.data?.user



    return <nav className=" sticky top-0 px-2 py-4">
        <ul className="flex flex-col gap-2 items-start min-h-screen whitespace-nowrap">
            <li>
                    <Link href="/">
                        <IconHoverEffect>
                            <span className=' flex gap-4 items-center'>
                                <VscHome className=' h-8 w-8' />
                                <span className='hidden text-lg md:inline'>Home</span>
                            </span>
                        </IconHoverEffect>
                    </Link>
            </li>
            {user != null && (<li>
                <Link href={`/profiles/${user.id}`} >
                    <IconHoverEffect>
                        <span className=' flex gap-4 items-center'>
                            <VscAccount className=' h-8 w-8' />
                            <span className='hidden text-lg md:inline'>Profile</span>
                        </span>
                    </IconHoverEffect>
                </Link>
            </li>)}
             <li>
                {user == null? 
                    <button onClick={()=> void signIn} >
                       <IconHoverEffect>
                            <span className=' flex gap-4 items-center'>
                                <VscSignIn className=' h-8 w-8 fill-green-700' />
                                <span className='hidden text-green-700 text-lg md:inline'>Log in</span>
                            </span>
                        </IconHoverEffect>
                    </button>
                    :<button onClick={()=>void signOut}>
                        <IconHoverEffect>
                            <span className=' flex gap-4 items-center'>
                                <VscSignOut className=' h-8 w-8  fill-red-700' />
                                <span className='hidden text-red-700 text-lg md:inline'>Log out</span>
                            </span>
                        </IconHoverEffect>
                    </button> }
            </li>
        </ul>
    </nav>
}