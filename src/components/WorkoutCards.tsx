import React from 'react'
import { Card, CardContent, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { MessageSquare } from 'lucide-react'
import { Set } from '@prisma/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'



type WorkoutCardsProps = {
    exName: string
    setRecords: Set[]
}

export default async function WorkoutCards({exName, setRecords}: WorkoutCardsProps) {
   const answer = setRecords
    console.log(answer)
  return (
    <Link href={`?workoutId=${setRecords[0].workoutId}&exName=${exName}`}>
        <Card key={exName} className="" >
            <CardTitle className="p-6 text-xl bg-secondary rounded-t-md text-primary">{exName}</CardTitle>
            <Separator className="bg-primary-foreground" />
            <CardContent>
                <div className="flex flex-col p-6">
                    {setRecords.filter(workingSet => workingSet.exerciseName === exName).map(filteredSet => (

                    <div key={filteredSet.setId} className="grid grid-cols-3 items text-center">
                        <div>{filteredSet.comment ? <MessageSquare /> : null}</div>
                        <div><p className="text-xl font-bold text-muted-foreground">{filteredSet.weight} <span className="text-sm text-muted-foreground font-normal">lbs</span></p></div>
                        <div><p className="text-xl font-bold text-muted-foreground">{filteredSet.reps} <span className="text-sm text-muted-foreground font-normal"> reps </span></p></div>
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </Link>
  )
}
