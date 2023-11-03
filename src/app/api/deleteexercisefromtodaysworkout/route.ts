import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { limiter } from "../config/limiter"

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
return new Response(JSON.stringify(deletedSets), {status: 200})
}