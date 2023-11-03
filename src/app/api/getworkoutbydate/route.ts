import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { limiter } from "../config/limiter";

export async function POST(request: NextRequest) {
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
    include: {
      sets: true
    }

  })

  if(!prismaWorkout) {
    console.log('no workout')
    return new Response(JSON.stringify({}))
  }
  else {
    if(!prismaWorkout.sets.length) {
      return new Response(JSON.stringify({}))
    } else{
      return new Response(JSON.stringify(prismaWorkout))
    }
  }
}
