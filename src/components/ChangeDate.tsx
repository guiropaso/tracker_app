'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { Dispatch, SetStateAction} from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Button } from './ui/button'



type Props = {
    currDate: Date
    setDateState: Dispatch<SetStateAction<Date>>
}

export default function ChangeDate({currDate, setDateState}: Props) {
    const router = useRouter()
    const path = usePathname()



    const decreaseDate = () => {
        router.push(`${path}`)
        const newDate = new Date(currDate)
        newDate.setDate(newDate.getDate() - 1)
        setDateState(newDate)
        
    }

    const increaseDate = () => {
        router.push(`${path}`)
        const newDate = new Date(currDate)
        newDate.setDate(newDate.getDate() + 1)
        setDateState(newDate)
       
    }


  return (
    <div className='w-full bg-secondary p-5'>
        <div className='container mx-auto flex justify-between items-center'>
            <Button onClick={decreaseDate} className='rounded-full'>
                <ChevronLeft className='h-8 w-8' />
            </Button>
            <p className='text-lg font-semibold'>{currDate.toDateString()}</p>
            <Button onClick={increaseDate} className='rounded-full'>
                <ChevronRight className='h-8 w-8' />
            </Button>
        </div>

    </div>
  )
}
