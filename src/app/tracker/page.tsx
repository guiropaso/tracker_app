"use client"
import { Button } from '@/components/ui/button'
import {Dumbbell, Plus } from 'lucide-react'
import ToggleTheme from '@/components/ToggleTheme'
import HeaderAvatar from '@/components/HeaderAvatar'
import StartNewWorkout from '@/components/StartNewWorkout'
import TodaysWorkout from '@/components/TodaysWorkout'
import ChangeDate from '@/components/ChangeDate'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {useQuery} from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { getWorkout } from '@/lib/api'
import { useEffect, useMemo, useState } from 'react'
import { Set,} from "@prisma/client"
import { Workout } from '@/lib/types'
import { twMerge } from 'tailwind-merge'
import ExerciseHeader from '@/components/ExerciseHeader'



let uniqueExercises: {exerciseName: string; frequency: number}[]

export default function Page() {
  const [workoutDate, setWorkoutDate] = useState<Date>(new Date())
  const params = useSearchParams()
  const workoutIdParam = params.get('workoutId')
  const exNameParam = params.get('exName')
  const router = useRouter()
  const path = usePathname()
  const {data: session} = useSession()
  
  
  const {data, error, isError} = useQuery({
    queryKey: ['workout', workoutIdParam || workoutDate],
    queryFn: () => getWorkout(workoutIdParam, workoutDate),
    enabled: true,
    refetchOnWindowFocus: false,  
  })
  
  
  
  useEffect(() => {
    if(data && (data as Workout).workoutId) {
      const workout = data as Workout
      const dateString = workout.workoutDate
      const newDate = new Date(dateString)
      newDate.setDate(newDate.getDate() + 1)
      setWorkoutDate(newDate)
      
      
      if (exNameParam) {
        router.push(`${path}?workoutId=${workout.workoutId}&exName=${exNameParam}`);
      } else {
        router.push(`${path}?workoutId=${workout.workoutId}`);
      }
    }
  }, [data]);
  
  if(isError) {
    console.log('axios error in FE: ', error)
  }

  
  if(data && (data as Workout).workoutId) {
    const workout = data as Workout
    const sets = workout.sets
    const exerciseFrequency: Record<string, number> = {}
    
    sets.forEach((record: Set) => {
        const exerciseName = record.exerciseName
        exerciseFrequency[exerciseName] = (exerciseFrequency[exerciseName] || 0) + 1
    })
    
    uniqueExercises = Object.keys(exerciseFrequency).map(exerciseName => ({
    exerciseName,
    frequency: exerciseFrequency[exerciseName]
    }))

  }

  if(!session || !session.user.email) {
    return 
  }

  return (
    <div className={twMerge((!workoutIdParam || !exNameParam && uniqueExercises?.length === 0) && 'grid grid-rows-2 h-screen')}>
      <div>

      {workoutIdParam && exNameParam && uniqueExercises
        ? 
        <ExerciseHeader uniqueExercises={uniqueExercises} exNameParam={exNameParam} session={session} workoutIdParam={workoutIdParam}/>
        :
        <>
        <header className='bg-background z-30 w-full border-b'>
          <div className='mx-auto container flex justify-between p-4 items-center'>
            <div className='flex space-x-3 items-center'>
              <Dumbbell className='text-secondary-foreground w-7 h-7' />
              <h2 className='font-semibold text-2xl text-primary'>Gym Tracker</h2>
            </div>
            <div className='flex space-x-3 items-center'>
              <Button variant='ghost' className='' size='icon'>
                <Plus className='h-6 w-6' />
              </Button>
              <ToggleTheme />
              {session.user && <HeaderAvatar user = {session.user} />}
            </div>
          </div>
        </header>
        <ChangeDate currDate={workoutDate} setDateState={setWorkoutDate}/>
        </>
      }

      </div>
      {session && workoutIdParam && uniqueExercises !== undefined && data &&  Object.keys(data).length > 0 && (data as Workout).workoutId
      ? <TodaysWorkout workout={data as Workout} exNameParam={exNameParam} workoutParam={workoutIdParam} uniqueExercises={uniqueExercises}/>
      :
      <div className='items-center justify-center row-start-2 grid grid-rows-2'>
          <div className='row-start-1 self-start'>
            <h2 className='text-lg font-medium text-muted-foreground text-center'>Workout Log Empty</h2>
          </div>
        <div className='row-start-2'>
          <StartNewWorkout workoutDate={workoutDate} session={session}/>
        </div>
      </div>
      }

    </div>
  )
}