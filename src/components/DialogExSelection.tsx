import React, { useEffect } from 'react'
import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogClose} from '@/components/ui/dialog'
import { ChevronLeft, Plus, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Exercise } from '@prisma/client'
import Link from 'next/link'
import { AlertDialog, AlertDialogTrigger } from './ui/alert-dialog'
import AddNewUserExerciseModal from './AddNewUserExerciseModal'
import { Session } from 'next-auth'
import { SheetClose } from './ui/sheet'

type Props = {
  selectedMuscle: string
  filteredExercises: Exercise[]
  setSelectedMuscle: React.Dispatch<React.SetStateAction<string>>
  workoutIdParam: string
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const muscles = [
  'Abs',
  'Back',
  'Biceps',
  'Chest',
  'Legs',
  'Shoulders',
  'Triceps',
]

export default function DialogExSelection({selectedMuscle, filteredExercises, setSelectedMuscle, workoutIdParam, setSheetOpen } : Props) {


  useEffect(() => {
    console.log('mounted')
    return () => {
      console.log('unmounted')
      setSelectedMuscle('')
    }
  },[])

  return (
    <>
      <Dialog modal={true}>
        <DialogTrigger className='w-full'>
          <p className='font-semibold flex items-center justify-center bg-primary text-white rounded-md p-3'>
            <PlusIcon className='mr-4'/>
            Add Exercise
          </p>
        </DialogTrigger>
        <DialogContent className='max-w-[300px] md:max-w-md h-5/6'>
          <DialogHeader>
            <DialogTitle className='text-2xl text-left mb-20'>Select Exercise</DialogTitle>
            <div className='h-full'>
              {selectedMuscle !== '' && <ChevronLeft className='hover:text-slate-700 absolute cursor-pointer bg-muted rounded-full h-7 w-7' onClick={() => setSelectedMuscle('')}/>}
              <div className='flex flex-col justify-between h-full pt-8'>
                <ul>
                  {
                    selectedMuscle && filteredExercises !== undefined
                  ? filteredExercises?.map(muscle => (
                    <Link key={muscle.exerciseName} href={{
                      pathname: '/tracker',
                      query:
                      {
                        workoutId: workoutIdParam,
                        exName: muscle.exerciseName,
                      }
                    }}>
                      <DialogClose asChild>
                        <li key={muscle.exerciseName} onClick={() => setSheetOpen(false)} className='border-b py-4 text-left text-md px-2 cursor-pointer hover:bg-muted hover:text-primary'>{muscle.exerciseName}</li>
                      </DialogClose> 
                    </Link>
                    ))
                  : muscles.map(muscle => (
                    <li key={muscle} onClick={() => setSelectedMuscle(muscle)} className='border-b py-4 text-left text-md px-2 cursor-pointer hover:bg-muted'>{muscle}</li>
                    ))}
                </ul>
                <div className='grid grid-flow-col gap-2 pb-4'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className='bg-emerald-400 font-semibold hover:bg-emerald-700'>Add New</Button>
                    </AlertDialogTrigger>
                      <AddNewUserExerciseModal />
                  </AlertDialog>
                  <DialogClose asChild>
                    <Button className='bg-sky-700 font-semibold hover:bg-sky-800'>Cancel</Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
