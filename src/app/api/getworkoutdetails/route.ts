import { db } from "@/lib/db";
import { Set } from "@prisma/client";


export async function POST(request: Request) {
    const body = await request.json()
    const {currentWorkout, currentExercise} = body

    const setsRawData: Set[] = await db.set.findMany({
        where: {
            workoutId: {
                equals: currentWorkout
            },
            exerciseName: {
                equals: currentExercise
            }
        },
        
    })

    if(!setsRawData) {
        return new Response(JSON.stringify({message: 'No records found'}), {status: 404})
    }
    return new Response(JSON.stringify(setsRawData))
}