import { Set } from '@prisma/client'
import { MessageSquare } from 'lucide-react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    set: Set
    handleUpdate: (set:Set) => void
    isEditingSet: boolean
}


export default function IndividualSet({set, handleUpdate, isEditingSet}: Props) {
  return (
    <li key={set.setId} onClick={() => handleUpdate(set)} className={twMerge('cursor-pointer hover:bg-muted', isEditingSet && 'bg-muted')} >
        <div className='flex w-full items-center border-b py-3'>
            <div >
                <MessageSquare />
            </div>
            <div className='flex justify-between w-full'>
                <p className='font-semibold text-lg ml-10'>{set.setNumber}</p>
                <p className='font-semibold text-lg'>{set.weight} <span className='text-muted-foreground text-sm'>lbs</span></p>
                <p className='font-semibold text-lg'>{set.reps} <span className='text-muted-foreground text-sm'>reps</span></p>
            </div>
        </div>
    </li>
  )
}
