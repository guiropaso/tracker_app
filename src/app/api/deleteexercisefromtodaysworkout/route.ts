import { db } from "@/lib/db"

export async function POST(req: Request) {
    const data = await req.json()
    const {workout, exercise} = data

    const deletedSets = await db.set.deleteMany({
        where: {
            AND: [
                {
                    workoutId: workout
                },
                {
                    exerciseName: exercise
                }
            ]
            
        }
    })

    if(!deletedSets) {
        return new Response(JSON.stringify({message: 'Could not delete any set'}), {status: 402})
    }
    console.log(deletedSets)
    return new Response(JSON.stringify(deletedSets), {status: 200})

}