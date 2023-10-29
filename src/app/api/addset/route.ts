import { NextRequest} from "next/server";
import { Set } from "@prisma/client";
import { db } from "@/lib/db";



export async function POST(req: NextRequest) {
    const data: Omit<Set,'setId'> = await req.json()


    const newSetCreated = await db.set.create({
        data: {
        reps: data.reps,
        setNumber: data.setNumber,
        weight: data.weight,
        workoutId: data.workoutId,
        exerciseName: data.exerciseName
        }
    })

    
    if(!newSetCreated) {
        return new Response(JSON.stringify({message: 'Could not add set'}),{status:402})   
    } else {
        return new Response(JSON.stringify(newSetCreated),{status: 200})
    }
    
}