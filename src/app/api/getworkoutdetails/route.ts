import { db } from "@/lib/db";
import { Set } from "@prisma/client";
import { limiter } from "../config/limiter";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  const origin = request.headers.get('origin')
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
  const body = await request.json()
  const {currentWorkout, currentExercise} = body

  const setsRawData: Set[] = await db.set.findMany({
    where: {
      workoutId: {
        equals: currentWorkout
      },
      exerciseName: {
        equals: currentExercise
      }
    },
      
  })

  if(!setsRawData) {
    return new Response(JSON.stringify({message: 'No records found'}), {status: 404})
  }
  return new Response(JSON.stringify(setsRawData))
}