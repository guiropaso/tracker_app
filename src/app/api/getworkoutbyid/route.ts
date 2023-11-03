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
  const {workoutId}:{workoutId:string} = await request.json()

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
    return new Response(JSON.stringify(prismaWorkout))
  }
}
