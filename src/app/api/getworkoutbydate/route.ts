import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const {workoutDate} = body
    

    if(!session) {
        return new Response('Unauthorized',{status: 401})
    }

    const handledDate = new Date(workoutDate)
    const mins = handledDate.getTimezoneOffset()
    handledDate.setHours(0,- mins,0,0)
    const isoDate = handledDate.toISOString()

    const prismaWorkout = await db.workout.findFirst({
        where: {
            workoutDate: {
            equals: isoDate
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
        return new Response(JSON.stringify({}))
    }
}
