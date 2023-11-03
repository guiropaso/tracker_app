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
  const {email} = data

  const exercises = await db.exercise.findMany({
    where: {
      OR: [
        {
          userEmail: 'default',
        },
        {
          userEmail: email
        }
      ]
    }
  })


  if(!exercises) {
    return new Response(JSON.stringify({message: 'No exercise found'}), {status: 404})
  }
  return new Response(JSON.stringify(exercises), {status: 200})
}