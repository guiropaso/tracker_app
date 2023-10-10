import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const {workoutId} = body
    if(workoutId === undefined) {
        return new Response('Not Found',{status: 404})
    }

    const setsRawData =  await db.workout.findMany({
        where: {
            workoutId: workoutId
        }, select: {
            sets: true
        }
    })
    if(setsRawData) {
        return new Response(JSON.stringify({setsRawData}))
    }
    return new Response(JSON.stringify({}))

}