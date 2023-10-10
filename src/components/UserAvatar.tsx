import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { User } from 'next-auth'
import Image from 'next/image'
import { User as UserIcon } from 'lucide-react'
import { AvatarProps } from '@radix-ui/react-avatar'


interface UserAvatarProps extends AvatarProps {
    user: Pick<User,'image' | 'name'>
}

export default function UserAvatar({user, ...props}: UserAvatarProps) {
  return (
    <Avatar {...props}>
        {user.image
        ? <div className='relative aspect-square h-full w-full'>
            <Image fill src={user.image} alt='Profile Picture' referrerPolicy='no-referrer'/>
        </div>
        : <AvatarFallback>
            <span className='sr-only'>{user.name}</span>
            <UserIcon className='h-4 w-4'></UserIcon>
        </AvatarFallback>}
    </Avatar>
    )
}
