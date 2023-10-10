'use client'

import { User } from 'next-auth'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import UserAvatar from './UserAvatar'
import { signOut } from 'next-auth/react'

type HeaderAvatarProps = {
    user: Pick<User, 'name' | 'email' | 'image'>
}

export default function HeaderAvatar({user}: HeaderAvatarProps) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
            <UserAvatar user={user} className='h-8 w-8'/>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
            <div className='flex items-center justify-start gap-2 p-2'>
                <div className='flex flex-col space-y-1 leading-none'>
                    {user.name && <p className='font-medium'>{user.name}</p>}
                    {user.email && <p className='truncate w-[200px] text-sm text-muted-foreground'>{user.email}</p>}

                </div>

            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(event) => {
                event.preventDefault()
                signOut({callbackUrl: '/'})
            }} className='cursor-pointer font-semibold focus:text-primary'>
                Sign Out
            </DropdownMenuItem>

        </DropdownMenuContent>
    </DropdownMenu>
  )
}
