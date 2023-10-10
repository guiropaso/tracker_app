"use client"

import React from 'react'
import { Button } from './ui/button'
import { X } from 'lucide-react'
//import { useRouter } from 'next/router'
import {useRouter} from 'next/navigation'



export default function CloseModal() {
    const router = useRouter()

    return (
        <Button
        className='h-6 w-6 p-0 rounded-md'
        variant='ghost'
        aria-label='close modal'
        onClick={() => router.back()}
        >
            <X className='h-4 w-4'/>
        </Button>
    )
}
