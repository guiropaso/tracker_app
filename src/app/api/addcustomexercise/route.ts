import { db } from "@/lib/db"


export async function POST(req: Request) {
    const data = await req.json()
    const {exerciseName, group, userEmail} = data


    const newExercise = await db.exercise.create({
        data: {
            exerciseMuscle: group,
            exerciseName: exerciseName,
            userEmail: userEmail
        }
    })

    if(!newExercise) {
        return new Response(JSON.stringify({message: 'Could not create new exercise'}), {status: 402})
    }
    return new Response(JSON.stringify(newExercise), {status: 200})
}