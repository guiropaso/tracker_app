import { Card, CardContent, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { MessageSquare } from "lucide-react"
import ExerciseDetails2 from "./ExerciseDetails2"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Set } from "@prisma/client"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Workout } from "@/lib/types"


type TodaysWorkoutType = {
    workout: Workout
    exNameParam: string |  null
    workoutParam: string |  null
    
    
    uniqueExercises: {
        exerciseName: string,
        frequency: number
      }[]
}

export type Exercise = {
    exerciseName: string
    frequency: number

}

export default function TodaysWorkout({workout, exNameParam, uniqueExercises} : TodaysWorkoutType) {
    const setRecords = workout?.sets || []

    return (
       <>
       {exNameParam && workout
       ? <ExerciseDetails2 />
       :
        <div className='flex flex-col space-y-6 container mx-auto max-w-[700px] my-10'>
            {uniqueExercises && uniqueExercises.map(exercise => (
                <Link href={`?workoutId=${workout.workoutId}&exName=${exercise.exerciseName}`}  key={exercise.exerciseName}>
                    <Card>
                        <CardTitle className="p-6 text-xl bg-secondary rounded-t-md text-primary">{exercise.exerciseName}</CardTitle>
                        <Separator className="bg-primary-foreground" />
                        <CardContent>
                            <div className="flex flex-col p-6">
                                {setRecords.filter(workingSet => workingSet.exerciseName === exercise.exerciseName).map(filteredSet => (
                                <div key={filteredSet.setId} className="grid grid-cols-3 items text-center space-y-2">
                                    <div>{filteredSet.comment ? <MessageSquare /> : null}</div>
                                    <div className="border-b"><p className="text-xl font-bold text-muted-foreground">{filteredSet.weight} <span className="text-sm text-muted-foreground font-normal">lbs</span></p></div>
                                    <div className="border-b"><p className="text-xl font-bold text-muted-foreground">{filteredSet.reps} <span className="text-sm text-muted-foreground font-normal"> reps </span></p></div>
                                </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
            </Link>
            ))}
        </div>
        }
        </>
    )
}
