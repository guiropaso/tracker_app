import React from 'react'
import { Menu} from 'lucide-react'
import Logo from '../../public/Logo.png'
import Image from 'next/image'
import Link from 'next/link'
import {Button, buttonVariants } from './ui/button'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from './ui/sheet'
import { cn } from '@/lib/utils'
import ToggleTheme from './ToggleTheme'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HeaderAvatar from './HeaderAvatar'



export default async function Header() {
    const session = await getServerSession(authOptions)
    const routes = [
        {
            href: "#home",
            label: "Home"
        },
        {
            href: "#benefits",
            label: "Benefits"
        },
        {
            href: "#classes",
            label: "Classes"
        },
        {
            href: "#contact",
            label: "Contact"
        },
    ]
    const flexBetween = "flex items-center justify-between"
  return (
    <header className={`${flexBetween} fixed top-0 z-30 w-full py-3 bg-background border-b `}>
        <div className={`${flexBetween} mx-auto w-5/6`}>
            <div className={`flex items-center justify-between w-full gap-16`}>
                <Link href='/' className=''
                >
                    <Image src={Logo} alt="logo" className='w-[150px]'/>
                </Link>
                <div className={` hidden md:flex items-center md:justify-between w-full`}>
                    <nav className={`${flexBetween} gap-2 lg:gap-4`}>
                        {routes.map((route,i) => (
                            <Link
                            key={i}
                            href={route.href}
                            className={buttonVariants({variant: 'ghost', className: 'lg:text-base font-semibold'})}
                            >
                            {route.label}
                            </Link>
                        ))}
                        { session && (
                            <Link
                            href='/tracker'
                            className={buttonVariants({className: 'lg:text-base font-semibold'})}
                            >
                                Tracker
                            </Link>
                        )}
                    </nav>
                    <div className='flex gap-2 items-center overflow-visible'>
                        {session?.user 
                        ? <HeaderAvatar user = {session.user} />
                        : <Link href='/sign-in' className={cn(buttonVariants(),'rounded-sm whitespace-nowrap')} >Sign In</Link>
                        }
                        <ToggleTheme />
                    </div>
                </div>
                <Sheet>
                    <SheetTrigger className='md:hidden'>
                        <div className='inline-block p-2 rounded-full box-content bg-primary-foreground dark:bg-primary'>
                            <Menu className='w-5 h-5' />
                        </div>
                    </SheetTrigger>
                    <SheetContent side='left'>
                        <nav className='flex flex-col mt-10'>
                            {routes.map((route,i) => (
                                <SheetClose asChild className='px-2 py-4 text-lg border-b text-left' key={i}>
                                    <Link
                                    href={route.href}
                                    >{route.label}
                                    </Link>
                                </SheetClose>
                            ))}
                            { session
                            ? (
                            <SheetClose asChild className='px-2 py-4 text-lg border-b text-left text-primary font-semibold'>
                                <Link
                                href='/tracker'
                                >
                                Tracker
                                </Link>
                            </SheetClose>
                            )
                        : (
                            <SheetClose asChild>
                                <Link href='/sign-in' className='px-2 bg-primary py-4 text-lg border-b'>Tracker <span className='italic underline'>Sign In</span></Link>
                            </SheetClose>
                        )
                        }
                        </nav>
                        <div className='absolute bottom-8 right-0 '>
                        <ToggleTheme />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>    
    </header>
  )
}
