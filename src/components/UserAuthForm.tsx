"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import { icons } from './Icons'
import { cn } from '@/lib/utils'
import {signIn} from 'next-auth/react'
import { toast } from './ui/use-toast'
import { Loader2 } from 'lucide-react'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({className, ...props}: UserAuthFormProps) {


    const [isLoading, setIsLoading] = useState<boolean>(false)

    const loginWithGoogle = async () => {
        setIsLoading(true)

        try{
            await signIn('google', {callbackUrl: '/tracker'})
        } catch(error) {
            toast({
                title: 'Something went wrong',
                description: 'There was an error logging in with Google',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }


  return (
    <div className={cn('flex justify-center', className)} {...props}>
        <Button
        size={'sm'}
        className='w-full font-semibold text-base bg-stone-800 hover:bg-stone-900'
        onClick={loginWithGoogle}
        >
        {isLoading ? <Loader2 className='h-5 w-5 mr-4 animate-spin'></Loader2> : <icons.google className='h-5 w-5 mr-4'></icons.google>}
        Google
        </Button>
    </div>
  )
}
