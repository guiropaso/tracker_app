'use client'
import { Button } from './ui/button'
import { Loader2, Plus } from 'lucide-react'
import { seedDb } from '@/actions/serverActions'
import { useTransition } from 'react'

export default function StartNewWorkout() {

    const [isUpdating, startTransition] = useTransition()

  return (
    <div className='text-center h-full'>
        <Button className='' variant={'ghost'} size={'icon'} onClick={() => startTransition(seedDb)}>
            { isUpdating ? <Loader2 className='h-6 w-6 animate-spin'/> : <Plus className='h-6 w-6'/>}
        </Button>
        <span className='block font-medium text-muted-foreground'>Start New Workout</span>
    </div>
  )
}
