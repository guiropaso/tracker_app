import { db } from "@/lib/db"
import { Set } from "@prisma/client"
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
  const data:Set = await req.json()
  console.log('updated set obj received in route: ', data)

  const updatedSet = await db.set.update({
    where: {
      setId: data.setId
    },
    data: {
      reps: data.reps,
      weight: data.weight
    }
  })

  if(!updatedSet) {
    return new Response(JSON.stringify({message: 'Could not update set'}), {status: 304})
  } else {
    return new Response(JSON.stringify(updatedSet), {status: 200})
  }
}