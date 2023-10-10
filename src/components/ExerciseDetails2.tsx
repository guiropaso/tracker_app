import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { MessageSquare, Minus, Plus } from 'lucide-react'
import { Exercise } from './TodaysWorkout'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { useForm, Controller } from 'react-hook-form'
import type {FieldValues} from 'react-hook-form'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addSet } from '@/actions/serverActions'
import { experimental_useOptimistic as useOptimistic } from 'react'
import { Set } from '@prisma/client'


type ExerciseDetailsProps = {
    setRecords : Set[]
    setIsNewElementAdded: Dispatch<SetStateAction<boolean>>

}


export default function ExerciseDetails({setRecords, setIsNewElementAdded} : ExerciseDetailsProps) {
    //const [isEditingSet, setIsEditingSet] = useState(false)
    const inputWeightRef = useRef<HTMLInputElement | null>(null)
    //const inputRepRef = useRef(null)
    
    const addSetFormSchema = z.object({
        weight: z.coerce.number().min(1,'Weight is required'),
        reps: z.coerce.number().min(1,'Reps are required'),
    })

    type addSetFormSchemaType = z.infer<typeof addSetFormSchema>

    const {
        register,
        formState: {errors, isSubmitting},
        handleSubmit,
        control
    } = useForm({resolver: zodResolver(addSetFormSchema)})

    const params = useSearchParams()
    const currentExercise = params.get('exName')
    const currentExerciseSets = setRecords.filter(ex => ex.exerciseName === currentExercise)
    const maxSetNumber: number = currentExerciseSets.reduce((prev: number, cur) => cur.setNumber > prev ? cur.setNumber : prev, currentExerciseSets[0].setNumber)
    
    const handleUpdate = (set: Set) => {
        inputWeightRef.current!.value = set.weight.toString()
    }

  
    const onSubmit = async (data: FieldValues) => {
        
        const set = {
            reps: data.reps,
            weight: data.weight,
            workoutId: currentExerciseSets[0].workoutId,
            exerciseName: currentExercise!,
            setNumber: maxSetNumber + 1,
            comment: null
        }

        const res = await fetch('http://localhost:3000/api/addset',{
            body: JSON.stringify(set),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const newSet = await res.json()
        console.log('new set on client: ', newSet)
        setIsNewElementAdded(true)
    }
    

  return (
    <div className='container max-w-[700px] mt-10'>
        <form onSubmit={handleSubmit(onSubmit)}>
            <h5 className='font-semibold'>WEIGHT (lbs)</h5>
            <Separator />
            <div className='flex items-center justify-center gap-5 p-5'>
                <Button className='' size={'sm'}>
                    <Minus></Minus>
                </Button>
                <Controller 
                    control = {control}
                    name='weight'
                    render={({field:{ onChange, onBlur, value, ref }}) => (
                        <input
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        ref = {(el) => inputWeightRef.current = el}
                        type="text"
                        className='text-center w-20 leading-10 font-semibold text-xl rounded-sm border-b dark:border-none dark:bg-transparent'
                        />
                    )}

                />
                
                <Button className='' size={'sm'}>
                    <Plus></Plus>
                </Button>
            </div>
            {errors.weight && (
                <p className='text-center text-red-500 font-semibold'>{`${errors.weight.message}`}</p>
            )}
            <h5 className='font-semibold'>REPS</h5>
            <Separator />
            <div className='flex items-center justify-center gap-5 p-5'>
                <Button className='' size={'sm'}>
                    <Minus></Minus>
                </Button>
                <input
                type="text"
                {...register('reps')}
                className='text-center w-20 leading-10 font-semibold text-xl rounded-sm border-b dark:border-none dark:bg-transparent'
                />
                <Button className='' size={'sm'}>
                    <Plus></Plus>
                </Button>
            </div>
            {errors.reps && (
                <p className='text-center text-red-500 font-semibold'>{`${errors.reps.message}`}</p>
            )}
            <div className='flex gap-5 items-center justify-center mt-5'>
                <Button size={'lg'} className='font-semibold text-lg px-16' disabled={isSubmitting} type='submit'>Save</Button>
                <Button size={'lg'} className='font-semibold text-lg px-16' variant={'secondary'} disabled={isSubmitting}>Clear</Button>
            </div>
            
        </form>
        {currentExerciseSets &&
        <ul className='list-none container mx-auto mt-20 '>
            {currentExerciseSets.map(set => (
                <li key={set.setId} onClick={() => handleUpdate(set)} className='cursor-pointer hover:bg-muted' >
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
            ))}
        </ul>
        }
    </div>
  )
}
