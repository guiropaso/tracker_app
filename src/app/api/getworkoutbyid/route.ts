import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const {workoutId} = body
    
    if(!session) {
        return new Response('Unauthorized',{status: 401})
    }

    const prismaWorkout = await db.workout.findFirst({
        where: {
            workoutId: {
            equals: workoutId
            },
            userEmail: {
            equals: session?.user.email!
            }
        },

        select: {
            workoutId: true,
            workoutDate: true,
            sets: true
        }
    })

    if(prismaWorkout) {
        const {workoutId, workoutDate, sets} = prismaWorkout
        return new Response(JSON.stringify({workoutId, workoutDate, sets}))
    } else {
        return new Response('No workout found in database',{status: 400})
    }
}
