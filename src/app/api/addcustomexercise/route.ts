import { db } from "@/lib/db"
import { limiter } from "../config/limiter"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
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