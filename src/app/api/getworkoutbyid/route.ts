import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Workout } from "@prisma/client";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)
    const {workoutId}:{workoutId:string} = await request.json()
    console.log(workoutId)

    if(!session) {
        return new Response(JSON.stringify({message:'Unauthorized'}),{status: 401})
    }

    const prismaWorkout= await db.workout.findFirst({
        where: {
            workoutId: {
            equals: workoutId
            }
        },
        
        include: {
            sets: true,
        }
    })

    if(!prismaWorkout) {
        return new Response(JSON.stringify({message: 'No workout found for the provided ID'}),{status: 404})
    } else {
        if(prismaWorkout.userEmail !== session?.user.email) {
            return new Response(JSON.stringify({message: 'It seems you do not have access to view this workout'}),{status: 401})
        }
        console.log('by id')
        return new Response(JSON.stringify(prismaWorkout))
    }
}
