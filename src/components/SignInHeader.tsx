import React from 'react'
import { Menu} from 'lucide-react'
import Logo from '../../public/Logo.png'
import Image from 'next/image'
import Link from 'next/link'
import {buttonVariants } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { cn } from '@/lib/utils'
import ToggleTheme from './ToggleTheme'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HeaderAvatar from './HeaderAvatar'



export default async function SignInHeader() {
    const session = await getServerSession(authOptions)
    
  return (
    <header className={`fixed top-0 z-30 w-full py-3 bg-background border-b `}>
        <div className='container flex justify-between mx-auto px-4 items-center'>
            <Link href='/'>
                <Image src={Logo} alt='Logo'/>
            </Link>
            <ToggleTheme />
        </div>   
    </header>
  )
}
