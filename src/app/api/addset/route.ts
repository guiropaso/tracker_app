import { NextRequest, NextResponse} from "next/server";
import { Set } from "@prisma/client";
import { db } from "@/lib/db";
import { limiter } from "../config/limiter";



export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin')
    const remaining = await limiter.removeTokens(1)
    if(remaining < 0) {
        return new NextResponse(null,{
            status: 429,
            statusText: 'Too many requests',
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'text/plain'
            }
        })
    }
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