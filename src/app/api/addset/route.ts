import { NextRequest, NextResponse } from "next/server";
import { Set } from "@prisma/client";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";



export async function POST(req: NextRequest) {
    const data:  Omit<Set, 'setId'> = await req.json()

    console.log('received set: ', data)

    const newSetCreated = await db.set.create({
        data: {
        reps: data.reps,
        setNumber: data.setNumber,
        weight: data.weight,
        workoutId: data.workoutId,
        exerciseName: data.exerciseName
        }
    })

    console.log('set created at db: ', newSetCreated)
    
    revalidatePath('/tracker')
    if(newSetCreated) {
        return new NextResponse(JSON.stringify(newSetCreated),{status: 200})
    }
}